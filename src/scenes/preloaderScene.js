import SceneManager from "../utils/sceneManager.js";

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({key: "PreloaderScene",});
    }

    init() {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.DEFAULT_LOADING_BAR_CONFIG = {
            x: this.CANVAS_WIDTH / 2,
            y: this.CANVAS_HEIGHT / 2,

            width: this.CANVAS_WIDTH / 2,
            height: 70,

            fillOffset: 10,
            bgColor: 0xcb2d80,
            fillColor: 0xf6a0d9,
            borderColor: 0xFFFFFF,
            borderThickness: 2,
            radiusPercentage: 0.25,

            textOffset: 70,
        };

        this.DEFAULT_TEXT_CONFIG = {
            padding: 80,

            originX: 0.5,
            originY: 0.5,

            style: {
                fontSize: 30,
                fill: "#FFFFFF",
                fontStyle: "bold",
                fontFamily: "Pacifico-Regular"
            }
        }

        this.createLoadingBar()
    }

    createLoadingBar() {
        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();

        let x = this.DEFAULT_LOADING_BAR_CONFIG.x;
        let y = this.DEFAULT_LOADING_BAR_CONFIG.y;
        let width = this.DEFAULT_LOADING_BAR_CONFIG.width;
        let height = this.DEFAULT_LOADING_BAR_CONFIG.height;
        let fillOffset = this.DEFAULT_LOADING_BAR_CONFIG.fillOffset;
        let radius = Math.min(width, height) * this.DEFAULT_LOADING_BAR_CONFIG.radiusPercentage;

        progressBox.fillStyle(this.DEFAULT_LOADING_BAR_CONFIG.bgColor, 1).fillRoundedRect(x - width / 2, y - height / 2, width, height, radius)
            .lineStyle(this.DEFAULT_LOADING_BAR_CONFIG.borderThickness, this.DEFAULT_LOADING_BAR_CONFIG.borderCol, 1)
            .strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius)


        // Se va actualizando la barra de progreso y el texto con el porcentaje
        this.load.on("progress", (value) => {
            if (value > 0) {
                percentText.setText(parseInt(value * 100) + "%");
                progressBar.clear();
                progressBar.fillStyle(this.DEFAULT_LOADING_BAR_CONFIG.fillColor, 1);
                progressBar.fillRoundedRect(x - (width - fillOffset) / 2, y - (height - fillOffset) / 2, (width - fillOffset) * value, height - fillOffset, radius);
            }
        });


        let style = this.DEFAULT_TEXT_CONFIG.style;
        let originX = this.DEFAULT_TEXT_CONFIG.originX;
        let originY = this.DEFAULT_TEXT_CONFIG.originY;
        let textPadding = this.DEFAULT_TEXT_CONFIG.padding;

        let percentText = this.add.text(x, y, "=%", style).setOrigin(originX, originY);
        let loadingText = this.add.text(x, y - textPadding, "Loading...", style).setOrigin(originX, originY);
        let assetText = this.add.text(x, y + textPadding, "", style).setOrigin(originX, originY);

        // Cuando carga un archivo, muestra el nombre del archivo debajo de la barra
        this.load.on("fileprogress", function (file) {
            // console.log(file.key);
            assetText.setText("Loading asset: " + file.key);
        });
    }

    preload() {
        this.load.image("test", "assets/favicon.png");
    }

    create() {
        let sceneManager = SceneManager.create();
        sceneManager.init(this);

        sceneManager.changeScene("Test", null, true, false);
    }
}