import BaseScene from "./baseScene.js";
import PartSelector from "../objects/partSelector.js";

export default class Test extends BaseScene {
    constructor() {
        super("Test");
    }

    preload() {
        this.load.image('personajeTest', 'assets/characters/char1.png');
    }

    create() {
        this.add.rectangle(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 1000, 1000, 0xffffff, 1);
        this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4, 'personajeTest');
        this.partSelector = new PartSelector(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4, 'head');
        this.partSelector = new PartSelector(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4, 'eyes');
        this.partSelector = new PartSelector(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4, 'mouth');
        this.partSelector = new PartSelector(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4, 'nose');
    }
}