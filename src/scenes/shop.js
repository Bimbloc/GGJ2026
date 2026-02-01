import BaseShop from "./baseShop.js";
import ImageTextButton from "../UI/imageTextButton.js";
import { growAnimation } from "../utils/graphics.js";
import AnimatedContainer from "../UI/animatedContainer.js";
import PartSelector from "../objects/partSelector.js";
import ClientGenerator from "../objects/clientGenerator.js";
import MaskAssembler from "../objects/maskAssembler.js";
import EventNames from "../utils/eventNames.js";

export default class MainShop extends BaseShop {
    constructor() {
        super("Shop");
    }

    create() {
        super.create();

        this.INIT_PROPS_X = this.CANVAS_WIDTH * 0.55;
        this.MOVED_PROPS_X = -this.counter.displayWidth / 2;
        this.MOVING_DURATION = 500;

        this.props = this.add.image(this.INIT_PROPS_X, this.counter.y - 190, "counterProps").setOrigin(0.5, 1);
        this.props.setScale(1.5);

        this.gachaButton = new ImageTextButton(this, 0, 0, "", {}, this.add.image(0, 0, "gachaIcon").setScale(0.3));
        this.gachaButton.x = this.gachaButton.displayWidth / 2 + this.BUTTON_PADDING;
        this.gachaButton.y = this.gachaButton.displayHeight / 2 + this.BUTTON_PADDING;

        growAnimation(this.gachaButton, this.gachaButton, () => {
            let anim = this.tweens.add({
                targets: this.props,
                duration: this.MOVING_DURATION,
                repeat: 0,
                x: this.MOVED_PROPS_X,
                ease: "Sine.Out"
            });

            this.gachaButton.disableInteractive();
            this.gachaButton.activate(false);

            anim.on("complete", () => {
                this.sceneManager.changeScene("Gacha", null, false, true);
            });
        }, true, true, 1.1, true);


        // TODO: Todo el flujo de juego xdn't
        const selectors = [];
        let selectorsContainer = new AnimatedContainer(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2);
        selectors.push(new PartSelector(this, 0, 0, 'eyes', -125));
        selectors.push(new PartSelector(this, 0, 0, 'head', -175));
        selectors.push(new PartSelector(this, 0, 0, 'nose', -75));
        selectors.push(new PartSelector(this, 0, 0, 'mouth', -25));

        selectorsContainer.add(this.add.image(0, 0, "maskBase"))
        selectors.forEach((selector) => {
            selectorsContainer.add(selector);
        });

        this.clientGenerator = new ClientGenerator(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2);
        this.clientGenerator.start();

        const BUTTON_WIDTH = 200;
        const BUTTON_HEIGHT = 100;
        const BUTTON_X = this.CANVAS_WIDTH - BUTTON_WIDTH * 0.5 - this.BUTTON_PADDING;
        const BUTTON_Y = this.CANVAS_HEIGHT - BUTTON_HEIGHT * 0.5 - this.BUTTON_PADDING;
        
        this.confirmButton = new ImageTextButton(this, BUTTON_X, BUTTON_Y, "Serve", this.BASE_TEXT_CONFIG,
            this.add.nineslice(BUTTON_X, BUTTON_Y, "button", "", BUTTON_WIDTH, BUTTON_HEIGHT, 20, 20, 20, 20));
        growAnimation(this.confirmButton, this.confirmButton, () => {
            let mask = {};
            selectors.forEach(sel => {
                mask[sel.part] = sel.itemId;
            });
            this.dispatcher.dispatch(EventNames.maskSubmitted, { mask });
        }, true, false, 1.1);
    }

    onWake(params) {
        if (this.props.x != this.INIT_PROPS_X) {
            let anim = this.tweens.add({
                targets: this.props,
                duration: this.MOVING_DURATION,
                repeat: 0,
                x: this.INIT_PROPS_X,
                ease: "Sine.In"
            });

            anim.on("complete", () => {
                this.gachaButton.activate(true, () => {
                    this.setInteractive(this.gachaButton);
                });
            });
        }
    }
}