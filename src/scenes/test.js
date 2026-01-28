import BaseScene from "./baseScene.js";
import PartSelector from "../objects/partSelector.js";

export default class Test extends BaseScene {
    constructor() {
        super("Test");
    }

    preload() {
        this.load.image('cuernos', 'assets/MaskParts/Cuernos.png');
        this.load.image('gatorejas', 'assets/MaskParts/OrejasGato.png');
        this.load.image('yipee', 'assets/favicon.png');
        this.load.image('funhead', 'assets/MaskParts/funhead1.png');
        this.load.image('fancyhead', 'assets/MaskParts/fancyhead1.png');
        this.load.image('naturalhead', 'assets/MaskParts/nathead1.png');
        this.load.image('edgyhead', 'assets/MaskParts/edgyhead1.png');
        this.load.image('mshead', 'assets/MaskParts/mshead1.png');
        this.load.image('safehead', 'assets/MaskParts/safehead1.png');



    }

    create() {
        this.add.rectangle(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 1000, 1000, 0xffffff, 1);
        this.partSelector = new PartSelector(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 3 / 4);
    }
}