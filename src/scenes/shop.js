import BaseShop from "./baseShop.js";
import RectTextButton from "../UI/rectTextButton.js";
import { growAnimation } from "../utils/graphics.js";

export default class MainShop extends BaseShop {
    constructor() {
        super("Shop");
    }

    create() {
        super.create();

        this.INIT_PROPS_X = this.CANVAS_WIDTH / 2;
        this.MOVED_PROPS_X = -this.counter.displayWidth / 2;
        this.MOVING_DURATION = 500;

        this.props = this.add.image(this.CANVAS_WIDTH / 2, this.counter.y - 190, "counterProps").setOrigin(0.5, 1);
        this.props.setScale(1.5);

        this.gachaButton = new RectTextButton(this, 200, 100, 300, 100, "Gacha", this.BASE_TEXT_CONFIG, () => { }, "GoToGachaButton", 0.5, 0.5, 25, 0xffffff);
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