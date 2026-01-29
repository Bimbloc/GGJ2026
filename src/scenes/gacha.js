import RectTextButton from "../UI/rectTextButton.js";
import { growAnimation } from "../utils/graphics.js";
import BaseScene from "./baseScene.js";
import TweenQueue from "../utils/tweenQueue.js";

export default class Gacha extends BaseScene {
    constructor() {
        super("Gacha");
    }

    create() {
        let bg = this.add.image(0, 0, "shopBg").setOrigin(0, 0);
        bg.setScale(this.CANVAS_WIDTH / bg.displayWidth, this.CANVAS_HEIGHT / bg.displayHeight);

        let machineBot = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "gachaBot");
        let capsule = this.add.image(638, 507, "capsule");
        let machineTop = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "gachaTop");
        let handle = this.add.image(557, 572, "handle");

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
        let multiPull = new RectTextButton(this, BUTTON_X, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, "x10", TEXT_CONFIG, () => { }, "SinglePullButton", 0.5, 0.5, 25, BUTTON_COLOR);
        let singlePull = new RectTextButton(this, multiPull.x - BUTTON_WIDTH - OFFSET, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, "x1", TEXT_CONFIG, () => { }, "SinglePullButton", 0.5, 0.5, 25, BUTTON_COLOR);

        growAnimation(singlePull, singlePull.list, () => {
            this.pull(handle, capsule);
        }, false, false, 1.05, true);

        growAnimation(multiPull, multiPull.list, () => {
            this.pull(handle, capsule);
        }, false, false, 1.05, true);
    }

    pull(handle, capsule) {
        const SPIN_DURATION = 300;
        const SPIN_DELAY = 100;

        let queue = new TweenQueue(this.tweens);

        let animInfo = {
            targets: handle,
            duration: SPIN_DURATION,
            repeat: 0,
            rotation: Math.PI * 0.5
        };

        for(let i = 0; i < 4; i++) {
            queue.push((handle) => {
                animInfo.rotation = Math.PI * 0.5 + handle.rotation;
                return animInfo;
            }, i === 0 ? 0 : SPIN_DELAY, handle);
        }

        queue.push({
            targets: capsule,
            duration: 100,
            repeat: 0,
            y: capsule.y + capsule.displayHeight
        });

        queue.push((capsule) => {
            capsule.setDepth(1);
            return {
                targets: capsule,
                duration: 200,
                scale: capsule.scale * 2,
                x: this.CANVAS_WIDTH / 2,
                y: this.CANVAS_HEIGHT / 2,
                repeat: 0,
            };
        }, SPIN_DELAY, capsule);
    }
}