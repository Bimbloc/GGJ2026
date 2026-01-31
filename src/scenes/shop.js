import BaseShop from "./baseShop.js";
import ImageTextButton from "../UI/imageTextButton.js";
import { growAnimation } from "../utils/graphics.js";
import PartSelector from "../objects/partSelector.js";
import ClientGenerator from "../objects/clientGenerator.js";
import MaskAssembler from "../objects/maskAssembler.js";
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

        this.gachaButton = new ImageTextButton(this, 0, 0, "", {}, () => { }, "", "gachaIcon").setScale(0.3);
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
        const OFFSET = -200
        selectors.push(new PartSelector(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4 + OFFSET, 'eyes', -125 ));
        selectors.push(new PartSelector(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4 + OFFSET, 'head', -175));
        selectors.push(new PartSelector(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4 + OFFSET, 'nose', -75));
        selectors.push(new PartSelector(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4 + OFFSET, 'mouth', -25));

        this.clientGenerator = new ClientGenerator(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4  + OFFSET);
        this.clientGenerator.start();

        this.maskAssembler = new MaskAssembler(this, selectors, this.CANVAS_WIDTH - 150, this.CANVAS_HEIGHT - 100);
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