

export default class PartSelector extends Phaser.GameObjects.GameObject {
    get baseSpeed() { return 5; }
    get maxMove() { return 200; }

    constructor(scene, x, y) {
        super(scene, 'part_selector');
        this.x = x;
        this.y = y;
        this.moving = false;
        this.keyDown = false;
        scene.add.existing(this);

        // Imagen
        this.images = [
            'cuernos',
            'gatorejas',
            'yipee'
        ];
        this.imageIndex = 0;
        this.image = scene.add.image(x, y, this.images[this.imageIndex]);

        // Input de teclado
        this.input = this.scene.input.keyboard.addKeys({
            //movimiento
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });
    }

    preUpdate(t, dt) {
        if(this.input.left.isDown && !this.input.right.isDown) {
            this.moveLeft();
        }

        if(this.input.right.isDown && !this.input.left.isDown) {
            this.moveRight();
        }

        if(this.moving) {
            this.image.x += this.speed * dt;
            this.newImage.x += this.speed * dt;
            if(Math.abs(this.image.x - this.x) >= this.maxMove) {
                this.image.destroy();
                this.image = this.newImage;
                this.image.x = this.x;
                this.moving = false;
            }
        }

        if(this.keyDown && !this.input[this.keyDown].isDown) {
            this.keyDown = false;
        }
    }

    baseMove() {
        this.moving = true;
        this.newImage = this.scene.add.image(this.x + this.maxMove, this.y, this.images[this.imageIndex]);
    }

    moveLeft() {
        if(this.moving || this.keyDown) return;
        this.keyDown = "left";
        console.log('Move left!');
        this.speed = -this.baseSpeed;
        this.imageIndex--;
        if(this.imageIndex < 0) {
            this.imageIndex += this.images.length;
        }
        this.baseMove();
    }

    moveRight() {
        if(this.moving || this.keyDown) return;
        this.keyDown = "right";
        console.log('Move right!');
        this.speed = this.baseSpeed;
        this.imageIndex++;
        if(this.imageIndex >= this.images.length) {
            this.imageIndex -= this.images.length;
        }
        this.baseMove();
    }
}