import GameManager from "../managers/gameManager.js";
import ImageTextButton from "../UI/imageTextButton.js";

export default class PartSelector extends Phaser.GameObjects.GameObject {
    get baseSpeed() { return 5; }
    get maxMove() { return 150; }

    constructor(scene, x, y, part, buttonOffset) {
        super(scene, 'part_selector');
        this.x = x;
        this.y = y;
        this.moving = false;
        scene.add.existing(this);

        this.buttonLeft = new ImageTextButton(scene, x - 200, y + buttonOffset, '', null, () => {
            this.moveLeft();
        }, '', 'leftButton', 0.5, 0.5, 0.1, 0.1);
        this.buttonRight = new ImageTextButton(scene, x + 200, y + buttonOffset, '', null, () => {
            this.moveRight();
        }, '', 'rightButton', 0.5, 0.5, 0.1, 0.1);

        const gm = GameManager.getInstance();

        // Imagen
        this.images = [];
        const cosmetics = gm.blackboard.get("cosmetics").get(part);
        cosmetics.forEach(id => {
            this.images = this.images.concat(id);
        });
        this.imageIndex = 0;
        this.image = scene.add.image(x, y, this.images[this.imageIndex]);
        this.newImage = scene.add.image(x, y);
        this.newImage.setVisible(false);
    }

    preUpdate(t, dt) {
        if(this.moving) {
            this.image.x += this.speed * dt;
            this.newImage.x += this.speed * dt;
            if(Math.abs(this.image.x - this.x) >= this.maxMove) {
                const temp = this.image;
                this.image = this.newImage;
                this.newImage = temp;
                this.image.x = this.x;
                this.moving = false;
                this.newImage.setVisible(false);
            }
        }
    }

    moveLeft() {
        if(this.moving) return;
        this.moving = true;
        this.speed = -this.baseSpeed;
        this.imageIndex--;
        if(this.imageIndex < 0) {
            this.imageIndex += this.images.length;
        }
        this.newImage.setTexture(this.images[this.imageIndex]);
        this.newImage.x = this.x + this.maxMove;
        this.newImage.setVisible(true);
    }

    moveRight() {
        if(this.moving) return;
        this.moving = true;
        this.speed = this.baseSpeed;
        this.imageIndex++;
        if(this.imageIndex >= this.images.length) {
            this.imageIndex -= this.images.length;
        }
        this.newImage.x = this.x - this.maxMove;
        this.newImage.setTexture(this.images[this.imageIndex]);
        this.newImage.setVisible(true);
    }
}