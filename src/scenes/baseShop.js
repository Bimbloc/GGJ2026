import { fadeAnimation } from "../utils/graphics.js";
import BaseScene from "./baseScene.js";

export default class BaseShop extends BaseScene {
    constructor(sceneName) {
        super(sceneName);
    }

    create(params) {
        super.create(params);

        this.bg = this.add.image(0, 0, "shopBg").setOrigin(0, 0);
        this.bg.setScale(this.CANVAS_WIDTH / this.bg.displayWidth, this.CANVAS_HEIGHT / this.bg.displayHeight);

        this.counter = this.add.image(this.CANVAS_WIDTH / 2 - 50, this.CANVAS_HEIGHT + 20, "counter").setOrigin(0.5, 1);
        this.counter.setScale(1.9);
    }
}