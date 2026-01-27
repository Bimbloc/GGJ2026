import BaseScene from "./baseScene.js";

export default class Test extends BaseScene {
    constructor() {
        super("Test");
    }

    create() {
        this.add.rectangle(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 100, 100, 0xffffff, 1);
    }
}