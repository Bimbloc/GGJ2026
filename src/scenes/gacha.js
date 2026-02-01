import BaseShop from "./baseShop.js";
import { growAnimation } from "../utils/graphics.js";
import GachaMachine from "../objects/gachaMachine.js";
import ImageTextButton from "../UI/imageTextButton.js";
import AnimatedContainer from "../UI/animatedContainer.js";
import TextArea from "../UI/textArea.js";
import EventNames from "../utils/eventNames.js";

export default class Gacha extends BaseShop {
    constructor() {
        super("Gacha");
    }

    create() {
        super.create();

        this.MULTI_PULL_AMOUNT = 10;
        this.PULL_COST_COINS = 100;

        this.REWARDS_MIN_STARS = 3;
        this.ENSURED_REWARD_STARS = 4;
        this.REWARDS_MAX_STARS = 5;

        this.THREE_STAR_PERCENTAGE = 80;
        this.FOUR_STAR_PERCENTAGE = 15;
        this.FIVE_STAR_PERCENTAGE = 5;

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

        this.shopButon = new ImageTextButton(this, 0, 0, "", {}, this.add.image(0, 0, "shopIcon").setScale(0.5));
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

        this.createWarnings();
        this.warnings.setVisible(false);

        this.initialAnimation();

        this.dispatcher.add(EventNames.pullAnimationEnd, this, () => {
            this.activateButtons(true);
        });
    }

    onWake(params) {
        super.onWake(params);

        this.gachaMachine.resetElements();
        this.gachaMachine.setPosition(this.GACHA_INIT_X, this.GACHA_INIT_Y).setRotation(this.GACHA_INIT_ROT);
        this.initialAnimation();
    }

    createPullButtons() {
        const BUTTON_WIDTH = 250;
        const BUTTON_HEIGHT = 100;
        const BUTTON_X = this.CANVAS_WIDTH - BUTTON_WIDTH * 0.5 - this.BUTTON_PADDING;
        const BUTTON_Y = this.CANVAS_HEIGHT - BUTTON_HEIGHT * 0.5 - this.BUTTON_PADDING;

        this.multiPullButton = new ImageTextButton(this, BUTTON_X, BUTTON_Y, `x${this.MULTI_PULL_AMOUNT}`, this.BASE_TEXT_CONFIG,
            this.add.nineslice(0, 0, "button", "", BUTTON_WIDTH, BUTTON_HEIGHT, 20, 20, 20, 20), null, 0.5, 0.5, 0, 0, 150, 0, 0);
        this.multiPullButton.add(this.add.image(-60, 0, "diamond").setScale(0.7));

        this.singlePullButton = new ImageTextButton(this, this.multiPullButton.x - BUTTON_WIDTH - this.BUTTON_PADDING, BUTTON_Y, "x1", this.BASE_TEXT_CONFIG,
            this.add.nineslice(0, 0, "button", "", BUTTON_WIDTH, BUTTON_HEIGHT, 20, 20, 20, 20), null, 0.5, 0.5, 0, 0, 150, 0, 0);
        this.singlePullButton.add(this.add.image(-40, 0, "diamond").setScale(0.7));

        growAnimation(this.singlePullButton, this.singlePullButton, () => {
            this.pull(1);
        }, false, false, 1.05, true);

        growAnimation(this.multiPullButton, this.multiPullButton, () => {
            this.pull(this.MULTI_PULL_AMOUNT);
        }, false, false, 1.05, true);
    }

    createWarnings() {
        const WARNING_WIDTH = 500;
        const WARNING_HEIGHT = 300;
        const WARNING_TEXT_PADDING = 30;
        const WARNING_TEXT_HEIGHT = 200;

        this.warningTextConfig = { ...this.BASE_TEXT_CONFIG };
        this.warningTextConfig.wordWrap = {
            width: WARNING_WIDTH - WARNING_TEXT_PADDING * 2,
            useAdvancedWrap: true
        }
        this.warningTextConfig.align = "center";

        this.warnings = new AnimatedContainer(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2);

        let bgBlock = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x0, 0);
        this.warnings.add(bgBlock);
        bgBlock.setInteractive();
        bgBlock.on("pointerdown", () => {
            this.warnings.activate(false);
        });

        this.warnings.add(this.add.nineslice(0, 0, "button", "", WARNING_WIDTH, WARNING_HEIGHT, 20, 20, 20, 20).setAlpha(0.9));


        const WARNING_BUTTON_Y = 96;
        const WARNING_BUTTON_WIDTH = 200;
        const WARNING_BUTTON_HEIGHT = 70;

        this.coinsWarning = this.add.container(0, 0);
        this.warnings.add(this.coinsWarning);

        let coinsWarningText = new TextArea(this, 0, -WARNING_HEIGHT / 2 + WARNING_TEXT_PADDING, WARNING_WIDTH - WARNING_TEXT_PADDING * 2, WARNING_TEXT_HEIGHT,
            "You don't have enough coins", this.warningTextConfig).setOrigin(0.5, 0);
        coinsWarningText.adjustFontSize();
        this.coinsWarning.add(coinsWarningText);
        
        let okButton = new ImageTextButton(this, 0, WARNING_BUTTON_Y, "Ok", this.BASE_TEXT_CONFIG,
            this.add.nineslice(0, 0, "button", "", WARNING_BUTTON_WIDTH, WARNING_BUTTON_HEIGHT, 20, 20, 20, 20));
        this.coinsWarning.add(okButton);
        growAnimation(okButton, okButton, () => {
            this.warnings.activate(false);
        }, false, false, 1.05, true);


        this.diamondsWarning = this.add.container(0, 0);
        this.warnings.add(this.diamondsWarning);

        this.diamondsWarningText = new TextArea(this, 0, -WARNING_HEIGHT / 2 + WARNING_TEXT_PADDING, WARNING_WIDTH - WARNING_TEXT_PADDING * 2, WARNING_TEXT_HEIGHT, "", this.warningTextConfig).setOrigin(0.5, 0);
        this.diamondsWarningText.adjustFontSize();
        this.diamondsWarning.add(this.diamondsWarningText);

        let yesButton = new ImageTextButton(this, -WARNING_WIDTH / 4.5, WARNING_BUTTON_Y, "Yes", this.BASE_TEXT_CONFIG,
            this.add.nineslice(0, 0, "button", "", WARNING_BUTTON_WIDTH, WARNING_BUTTON_HEIGHT, 20, 20, 20, 20).setTint(0x90e99e));
        this.diamondsWarning.add(yesButton);
        growAnimation(yesButton, yesButton, () => {
            this.warnings.activate(false, () => {
                if (this.missingCoins > this.gameManager.blackboard.get("money")) {
                    this.coinsWarning.setVisible(true);
                    this.diamondsWarning.setVisible(false);
                    this.warnings.activate(true);
                }
                else {
                    this.gameManager.blackboard.set("money", this.gameManager.blackboard.get("money") - this.missingCoins);
                    this.gameManager.blackboard.set("gachaCurrency", this.gameManager.blackboard.get("gachaCurrency") + this.missingDiamonds);
                    this.dispatcher.dispatch(EventNames.currencyChanged);
                }
            });

        }, false, false, 1.05, true);

        let noButton = new ImageTextButton(this, WARNING_WIDTH / 4.5, WARNING_BUTTON_Y, "No", this.BASE_TEXT_CONFIG,
            this.add.nineslice(0, 0, "button", "", WARNING_BUTTON_WIDTH, WARNING_BUTTON_HEIGHT, 20, 20, 20, 20).setTint(0xe99090));
        this.diamondsWarning.add(noButton);
        growAnimation(noButton, noButton, () => {
            this.warnings.activate(false);
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
        this.missingDiamonds = Math.abs(this.gameManager.blackboard.get("gachaCurrency") - amount);
        this.missingCoins = this.missingDiamonds * this.PULL_COST_COINS;

        if (this.missingDiamonds > 0) {
            let word = (amount == 1) ? "diamond" : "diamonds";
            this.diamondsWarningText.setText(`You need ${this.missingDiamonds} more ${word}.\n Purchase for ${this.missingCoins} coins?`);
            this.diamondsWarningText.setStyle(this.warningTextConfig);
            this.diamondsWarningText.adjustFontSize();

            this.coinsWarning.setVisible(false);
            this.diamondsWarning.setVisible(true);
            this.warnings.activate(true);
        }
        else {
            this.gameManager.blackboard.set("gachaCurrency", this.gameManager.blackboard.get("gachaCurrency") - amount);
            this.dispatcher.dispatch(EventNames.currencyChanged);

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
    }

    generateRandomPull(forceRarity = false) {
        let rarity = this.ENSURED_REWARD_STARS;

        if (!forceRarity) {
            let rnd = Math.floor(Math.random() * 100);

            if (rnd <= this.FIVE_STAR_PERCENTAGE) {
                rarity = 5;
            }
            else if (rnd <= this.FIVE_STAR_PERCENTAGE + this.FOUR_STAR_PERCENTAGE) {
                rarity = 4;
            }
            else  {
                rarity = 3;
            }
            console.log(rnd)
        }

        let item = this.gameManager.getRandomItemByRarity(rarity);
        let result = {
            rarity: rarity,
            texture: item,
            isNew: !this.gameManager.checkItemUnlocked(item)
        };
        this.gameManager.unlockItem(result.texture);
        return result;
    }
}