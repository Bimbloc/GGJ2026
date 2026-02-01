import ImageTextButton from "../UI/imageTextButton.js";
import { growAnimation } from "../utils/graphics.js";

export default class PartSelector extends Phaser.GameObjects.Container {
    get baseSpeed() { return 5; }
    get maxMove() { return 150; }

    constructor(scene, x, y, category, buttonOffsetY) {
        super(scene, x, y);
        scene.add.existing(this);
        
        this.scene = scene;

        const BUTTON_OFFSET_X = 200;
        const BUTTON_SCALE = 0.28;

        this.buttonLeft = new ImageTextButton(scene, -BUTTON_OFFSET_X, buttonOffsetY, "", null, scene.add.image(0, 0, "leftButton").setScale(BUTTON_SCALE));
        this.add(this.buttonLeft);
        growAnimation(this.buttonLeft, this.buttonLeft, () => {
            this.animate(true);
        }, false, false, 1.1, true);
        
        this.buttonRight = new ImageTextButton(scene, BUTTON_OFFSET_X, buttonOffsetY, "", null, scene.add.image(0, 0, "rightButton").setScale(BUTTON_SCALE));
        this.add(this.buttonRight);
        growAnimation(this.buttonRight, this.buttonRight, () => {
            this.animate(false);
        }, false, false, 1.1, true);


        this.index = 0;
        this.category = category;

        this.itemId = scene.gameManager.getItemByIndex(category, this.index);
        this.image = scene.add.image(0, 0, this.itemId);
        this.add(this.image);
        
        this.nextImage = scene.add.image(0, 0, "");
        this.add(this.nextImage);
        this.nextImage.setVisible(false);
    }

    animate(toPrev = false) {
        const DURATION = 100;
        const INIT_X = 200;

        this.index += toPrev ? -1 : 1;
        this.index %= this.scene.gameManager.blackboard.get("unlockedCosmetics").get(this.category).size; 
        this.itemId = this.scene.gameManager.getItemByIndex(this.category, this.index);
        this.nextImage.setTexture(this.itemId);

        this.buttonLeft.disableInteractive();
        this.buttonRight.disableInteractive();

        this.nextImage.setAlpha(0);
        this.nextImage.setVisible(true);

        let anim = this.scene.tweens.add({
            targets: this.nextImage,
            x: { from: toPrev ? INIT_X : -INIT_X, to: 0 },
            alpha: { from: 0, to: 1 },
            duration: DURATION,
            repeat: 0,
        });

        const CURR_IMG_END_X = toPrev ? -INIT_X : INIT_X;
        this.scene.tweens.add({
            targets: this.image,
            x: { from: 0, to: CURR_IMG_END_X },
            alpha: { from: 1, to: 0 },
            duration: DURATION,
            repeat: 0,
        });

        anim.on("complete", () => {
            setTimeout(() => {
                this.image.x = 0;
                this.image.setAlpha(1);
                this.image.setTexture(this.itemId);
                this.image.setVisible(true);

                this.nextImage.setAlpha(0);
                this.nextImage.setVisible(false);

                this.scene.setInteractive(this.buttonLeft);
                this.scene.setInteractive(this.buttonRight);
            }, 100);
        });
    }
}