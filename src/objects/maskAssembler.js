import RectTextButton from "../UI/rectTextButton.js";
import EventDispatcher from "../managers/eventDispatcher.js";

export default class MaskAssembler {

    constructor(scene, selectors = [], x = 0, y = 0) {
        this.scene = scene;
        this.selectors = selectors;
        this.dispatcher = EventDispatcher.getInstance();

        this.confirmButton = new RectTextButton(scene, x, y, 140, 60, "Serve", { fontSize: 30, fill: "#000", fontFamily: "Pacifico-Regular" }, () => { }, "ServeButton", 0.5, 0.5, 18, 0xffffff);

        this.confirmButton.on("pointerdown", () => {
            const mask = this.getMask();
            this.dispatcher.dispatch("maskSubmitted", { mask });
        });
    }

    getMask() {
        let mask = {};
        this.selectors.forEach(sel => {
            mask[sel.part] = sel.images[sel.imageIndex];
        });
        return mask;
    }
}
