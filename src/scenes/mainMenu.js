import BaseShop from "./baseShop.js";
import { growAnimation } from "../utils/graphics.js";

export default class MainMenu extends BaseShop {
    constructor() {
        super("MainMenu");
    }

    create() {
        super.create();
        
        let sparkles = [];
        let min = -100;
        let max = 100;
        for (let i = 0; i < 4; i++) {
            let rndOffsetX = Math.floor(Math.random() * (max - min + 1)) + min;
            let rndOffsetY = Math.floor(Math.random() * (max - min + 1)) + min;
            let img = this.add.image(this.CANVAS_WIDTH / 2 + rndOffsetX, this.CANVAS_HEIGHT / 2 + rndOffsetY, "sparkles").setScale(3);
            img.setAlpha(0);
            sparkles.push(img);
        }

        let logo = this.add.image(400, 240, "logo");

        let anim = this.tweens.add({
            targets: logo,
            y: { from: logo.y + 50, to: logo.y },
            alpha: { from: 0, to: 1 },
            duration: 700,
            repeat: 0,
            ease: "Sine.easeOut"
        });
        this.sound.play("sparkles");

        anim.on("complete", () => {
            
            let duration = 1000;
            this.tweenChain = this.tweens.chain({
                targets: null,
                tweens: [
                    {
                        targets: sparkles[0],
                        alpha: { from: 0, to: 1 },
                        duration: duration,
                        repeat: 0,
                        yoyo: true,
                    },
                    {
                        targets: sparkles[1],
                        alpha: { from: 0, to: 1 },
                        duration: duration,
                        repeat: 0,
                        yoyo: true,
                    },
                    {
                        targets: sparkles[2],
                        alpha: { from: 0, to: 1 },
                        duration: duration,
                        repeat: 0,
                        yoyo: true,
                    },
                    {
                        targets: sparkles[3],
                        alpha: { from: 0, to: 1 },
                        duration: duration,
                        repeat: 0,
                        yoyo: true,
                    }
                ],
                repeat: -1
            });
        });

        this.openButton.textObj.setText("Open");
        growAnimation(this.openButton, this.openButton, () => {
            this.openButton.textObj.setText("Closed");
            this.gameManager.startGame();
        }, true, true, 1.1);
    }
}