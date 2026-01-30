import BaseShop from "./baseShop.js";
import RectTextButton from "../UI/rectTextButton.js";
import { growAnimation } from "../utils/graphics.js";
import GachaMachine from "../objects/gachaMachine.js";

export default class Gacha extends BaseShop {
    constructor() {
        super("Gacha");
    }
    
    create() {
        super.create();

        this.MULTI_PULL_AMOUNT = 10;

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

        this.shopButon = new RectTextButton(this, 200, 100, 300, 100, "Shop", this.BASE_TEXT_CONFIG, () => { }, "GoToShopButton", 0.5, 0.5, 25, 0xffffff);
        growAnimation(this.shopButon, this.shopButon, () => {
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
        this.activateButtons(false, 0);

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
        this.activateButtons(false);

        let rewards = [];
        let hasFour = false;
        
        // TODO: Implementar posibilidades de verdad 
        for (let i = rewards.length; i < amount - 1; i++) {
            let result = Math.floor(Math.random() * (6 - 3) + 3);
            rewards.push(result);

            hasFour |= (result > 3);
        }
        if (amount === this.MULTI_PULL_AMOUNT && !hasFour) {
            rewards.push(4);
        }
        else {
            rewards.push(Math.floor(Math.random() * (6 - 3) + 3));
        }
        console.log(rewards);

        // TODO: Hacer que el jugador obtenga los objetos

        this.gachaMachine.playPullAnimation();
    }
}