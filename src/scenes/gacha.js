import BaseShop from "./baseShop.js";
import { growAnimation } from "../utils/graphics.js";
import GachaMachine from "../objects/gachaMachine.js";
import ImageTextButton from "../UI/imageTextButton.js";
import RectTextButton from "../UI/rectTextButton.js";

export default class Gacha extends BaseShop {
    constructor() {
        super("Gacha");
    }

    create() {
        super.create();


        this.MULTI_PULL_AMOUNT = 10;
        this.REWARDS_MIN_STARS = 3;
        this.REWARDS_MAX_STARS = 5;
        this.ENSURED_REWARD_STARS = 4;

        const END_OFFSET = 150;
        this.GACHA_INIT_X = this.CANVAS_WIDTH / 2;
        this.GACHA_INIT_Y = -250;
        this.GACHA_END_Y = this.counter.y - 420;
        this.GACHA_INIT_ROT = 0;
        this.GACHA_MOVED_X = this.CANVAS_WIDTH + END_OFFSET;
        this.GACHA_MOVED_Y = -END_OFFSET;
        this.GACHA_MOVED_ROT = Math.PI * 2;
        this.gachaMachine = new GachaMachine(this, this.GACHA_INIT_X, this.GACHA_INIT_Y, this.MULTI_PULL_AMOUNT).setRotation(this.GACHA_INIT_ROT);

        this.createPullButtons();

        // TODO: Crear indicadores con la cantidad de "monedas", crear avisos de confirmacion y de conversion entre monedas 

        this.shopButon = new ImageTextButton(this, 0, 0, "", {}, () => { }, "", "shopIcon").setScale(0.5);
        this.shopButon.x = this.shopButon.displayWidth / 2 + this.BUTTON_PADDING;
        this.shopButon.y = this.shopButon.displayHeight / 2 + this.BUTTON_PADDING;
        growAnimation(this.shopButon, this.shopButon, () => {
            this.gachaMachine.resetElements().on("complete", () => {
                this.activateButtons(false, 100);

                let anim = this.tweens.add({
                    targets: this.gachaMachine,
                    duration: 300,
                    repeat: 0,
                    rotation: this.GACHA_MOVED_ROT,
                    x: this.GACHA_MOVED_X,
                    y: this.GACHA_MOVED_Y,
                });

                anim.on("complete", () => {
                    let sceneChanged = false;
                    this.cameras.main.shake(200, 0.02);
                    this.cameras.main.on("camerashakecomplete", () => {
                        if (!sceneChanged) {
                            sceneChanged = true;
                            setTimeout(() => {
                                this.sceneManager.changeScene("Shop", null, false, true);
                            }, 200);
                        }
                    });
                });
            });
        }, true, true, 1.1, true);


        this.initialAnimation();

        this.dispatcher.add("pullAnimationEnded", this, () => {
            this.activateButtons(true);
        });
    }

    onWake(params) {
        super.onWake(params);

        this.gachaMachine.resetElements();
        this.gachaMachine.setPosition(this.GACHA_INIT_X, this.GACHA_INIT_Y).setRotation(this.GACHA_INIT_ROT);
        this.initialAnimation();
    }

    // TODO: Ajustar estetica/reemplazar los botones con imagenes
    createPullButtons() {
        const TEXT_CONFIG = {
            fontSize: 70,
            fill: "#000000",
            fontStyle: "bold",
            fontFamily: "Pacifico-Regular"
        }
        const OFFSET = 20;
        const BUTTON_WIDTH = 300;
        const BUTTON_HEIGHT = 100;
        const BUTTON_X = this.CANVAS_WIDTH - BUTTON_WIDTH * 0.5 - OFFSET;
        const BUTTON_Y = this.CANVAS_HEIGHT - BUTTON_HEIGHT * 0.5 - OFFSET;
        const BUTTON_COLOR = 0xffffff;

        this.multiPullButton = new RectTextButton(this, BUTTON_X, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, `x${this.MULTI_PULL_AMOUNT}`, TEXT_CONFIG, () => { }, "SinglePullButton", 0.5, 0.5, 25, BUTTON_COLOR);
        this.singlePullButton = new RectTextButton(this, this.multiPullButton.x - BUTTON_WIDTH - OFFSET, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, "x1", TEXT_CONFIG, () => { }, "SinglePullButton", 0.5, 0.5, 25, BUTTON_COLOR);

        growAnimation(this.singlePullButton, this.singlePullButton.list, () => {
            this.pull(1);
        }, false, false, 1.05, true);

        growAnimation(this.multiPullButton, this.multiPullButton.list, () => {
            this.pull(this.MULTI_PULL_AMOUNT);
        }, false, false, 1.05, true);
    }


    initialAnimation() {
        this.shopButon.setVisible(false);
        this.singlePullButton.setVisible(false);
        this.multiPullButton.setVisible(false);

        setTimeout(() => {
            let anim = this.tweens.add({
                targets: this.gachaMachine,
                duration: 1000,
                repeat: 0,
                y: this.GACHA_END_Y,
                ease: "Bounce.Out"
            });
            anim.on("complete", () => {
                this.activateButtons(true);
            });
        }, 200);
    }

    activateButtons(active, duration = 100) {
        this.shopButon.activate(active);
        this.singlePullButton.activate(active);
        this.multiPullButton.activate(active);
    }

    pull(amount) {

        let rewards = [];
        let ensuredSpawned = false;

        for (let i = rewards.length; i < amount - 1; i++) {
            let result = this.generateRandomPull();
            rewards.push(result);
            ensuredSpawned |= (result == this.ENSURED_REWARD_STARS);
        }

        if (amount === this.MULTI_PULL_AMOUNT && !ensuredSpawned) {
            let result = this.generateRandomPull(true);
            rewards.push(result);
        }
        else {
            rewards.push(this.generateRandomPull());
        }

        this.activateButtons(false);
        this.gachaMachine.playPullAnimation(rewards);
    }

    generateRandomPull(forceRarity = false) {
        // TODO: Implementar probabilidades reales 
        let rarity = forceRarity ? this.ENSURED_REWARD_STARS : Math.floor(Math.random() * ((this.REWARDS_MAX_STARS + 1) - this.REWARDS_MIN_STARS) + this.REWARDS_MIN_STARS);
        let category = this.gameManager.allCategories[Math.floor(Math.random() * this.gameManager.allCategories.length)];

        // TODO: Generar un cosmetico de la rareza correspondiente y la categoria que haya salido
        let texture = "head_funny_1"

        let result = {
            category: category,
            texture: texture,
            rarity: rarity,
            isNew: !this.gameManager.checkItemUnlocked(category, texture)
        };
        this.gameManager.unlockItem(category, result.texture);
        return result;
    }
}