export default class Test extends Phaser.Scene {
    constructor() {
        super({key: "Test",});
    }

    create() {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.add.rectangle(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 100, 100, 0xffffff, 1);
    }
}