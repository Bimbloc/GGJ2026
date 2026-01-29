import BaseScene from "./baseScene.js";
import RectTextButton from "../UI/rectTextButton.js"
import { growAnimation } from "../utils/graphics.js";
import PartSelector from "../objects/partSelector.js";

export default class Shop extends BaseScene {
    constructor() {
        super("Shop");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "shopBg").setOrigin(0, 0);
        bg.setScale(this.CANVAS_WIDTH / bg.displayWidth , this.CANVAS_HEIGHT / bg.displayHeight);

        const TEXT_CONFIG = {
            fontSize: 70,
            fill: "#000000",
            fontStyle: "bold",
            fontFamily: "Pacifico-Regular"
        }
        const BUTTON_X = this.CANVAS_WIDTH / 2;
        const BUTTON_Y = this.CANVAS_HEIGHT / 2;
        const BUTTON_WIDTH = 400;
        const BUTTON_HEIGHT = 150;
        const BUTTON_COLOR = 0xffffff;
        let button = new RectTextButton(this, BUTTON_X, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, "Jugar", TEXT_CONFIG, () => {}, "PlayButton", 0.5, 0.5, 25, BUTTON_COLOR)

        growAnimation(button, button.list, () => { 
            console.log("pressed"); 
        }, false, false, 1.05, true);
    }
}