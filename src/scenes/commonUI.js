import BaseScene from "./baseScene.js";
import ImageTextButton from "../UI/imageTextButton.js";
import EventNames from "../utils/eventNames.js";

export default class CommonUI extends BaseScene {
    constructor() {
        super("CommonUI");
    }

    create(params) {
        super.create(params);

        const TEXT_PADDING = 10;

        const BUTTON_PADDING = 20;
        const BUTTON_WIDTH = 200;
        const BUTTON_HEIGHT = 50;
        const BUTTON_X = this.CANVAS_WIDTH - BUTTON_WIDTH * 0.5 - BUTTON_PADDING;
        const BUTTON_Y = BUTTON_HEIGHT * 0.5 + BUTTON_PADDING;

        const ICON_X = -BUTTON_WIDTH * 0.5 + BUTTON_PADDING * 1.5;
        const ICON_SCALE = 0.5;

        this.diamonds = new ImageTextButton(this, BUTTON_X, BUTTON_Y, this.gameManager.blackboard.get("gachaCurrency"), this.BASE_TEXT_CONFIG,
            this.add.nineslice(0, 0, "button", "", BUTTON_WIDTH, BUTTON_HEIGHT, 20, 20, 20, 20), null, 1, 0.5, TEXT_PADDING, 0, 0, 0, 1);
        let diamondIcon = this.add.image(ICON_X, 0, "diamond").setScale(ICON_SCALE);
        this.diamonds.add(diamondIcon);

        this.coins = new ImageTextButton(this, this.diamonds.x - BUTTON_WIDTH - BUTTON_PADDING, BUTTON_Y, this.gameManager.blackboard.get("money"), this.BASE_TEXT_CONFIG,
            this.add.nineslice(0, 0, "button", "", BUTTON_WIDTH, BUTTON_HEIGHT, 20, 20, 20, 20), null, 1, 0.5, TEXT_PADDING, 0, 0, 0, 1);
        let coinIcon = this.add.image(ICON_X, 0, "coins").setScale(ICON_SCALE);
        this.coins.add(coinIcon);

        this.diamonds.textObj.setAreaSize(this.diamonds.textObj.maxWidth - diamondIcon.displayWidth - TEXT_PADDING, this.diamonds.textObj.maxHeight)
        this.coins.textObj.setAreaSize(this.coins.textObj.maxWidth - diamondIcon.displayWidth - TEXT_PADDING, this.coins.textObj.maxHeight)


        // TODO: INDICADOR DE DEUDA


        this.dispatcher.add(EventNames.currencyChanged, this, () => {
            this.diamonds.textObj.setText(this.gameManager.blackboard.get("gachaCurrency"));
            this.diamonds.textObj.adjustFontSize();

            this.coins.textObj.setText(this.gameManager.blackboard.get("money"));
            this.coins.textObj.adjustFontSize();
        });
        this.dispatcher.add(EventNames.pullAnimationStart, this, () => {
            this.diamonds.activate(false);
            this.coins.activate(false);
        });
        this.dispatcher.add(EventNames.pullAnimationEnd, this, () => {
            this.diamonds.activate(true);
            this.coins.activate(true);
        });
    }
}