import EventNames from "../utils/eventNames.js";

export default class Client extends Phaser.GameObjects.Container {
    constructor(scene, x, y, requestedMask = null) {
        super(scene, x, y);
        scene.add.existing(this);
        
        this.scene = scene;

        this.setDepth(-1);

        this.scene = scene;
        this.gm = scene.gameManager;
        this.dispatcher = scene.dispatcher;

        this.partsOrder = Array.from(this.gm.allCategories);

        this.requestedMask = requestedMask || this._generateRandomMask();
        this.served = false;

        this.avatar = scene.add.image(0, 0, 'personajeTest');

        this.add(this.avatar);

        this.reqContainer = scene.add.container(0, -350);

        this._createRequestThumbnails();
        this.add(this.reqContainer);

        this.statusText = scene.add.text(0, -300, "waiting", { fontSize: 16, fill: "#000" }).setOrigin(0.5, 0);

        this.add(this.statusText);

        this.setAlpha(0);
        scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 200,
            repeat: 0
        });
    }

    _createRequestThumbnails() {
        this.reqContainer.removeAll(true);
        const size = 128;

        let reqBg = this.scene.add.rectangle(-size/2, -size/1.5, 0, 0, 0xeeeeee);
        reqBg.width = size;
        reqBg.height = size;
        this.reqContainer.add(reqBg);

        this.partsOrder.forEach(part => {
            const key = this.requestedMask[part];
            const img = this.scene.add.image(0,0,key).setDisplaySize(size, size).setOrigin(0.5, 0.5);
            this.reqContainer.add(img);
        });
    }

    _generateRandomMask() {
        let mask = {};
        this.partsOrder.forEach(part => {
            const set = Array.from(this.gm.cosmeticsByType.get(part));
            mask[part] = set[Math.floor(Math.random() * set.length)];
        });
        return mask;
    }

    checkMask(submittedMask) {
        for (let part of this.partsOrder) {
            if (!submittedMask[part] || submittedMask[part] !== this.requestedMask[part]) {
                return false;
            }
        }
        return true;
    }

    serve(success = true) {
        this.served = true;
        this.statusText.setText(success ? "happy" : "angry");
        this.scene.tweens.add({
            targets: this,
            x: this.x + (success ? 200 : -200),
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.dispatcher.dispatch(EventNames.clientRemoved, { client: this, success });
                this.destroy(true);
            }
        });
    }
}
