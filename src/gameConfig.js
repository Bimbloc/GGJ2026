import PreloaderScene from "./scenes/preloaderScene.js";
import Test from "./scenes/test.js";

const MAX_W = 1200, MAX_H = 900, MIN_W = 400, MIN_H = 300;
const CONFIG = {
    width: MAX_W,
    height: MAX_H,
    backgroundColor: "#000000",
    version: "1.0",

    type: Phaser.AUTO,
    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        PreloaderScene,
        Test
    ],
    autoFocus: true,
    // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    disableContextMenu: true,
    render: {
        antialias: true,
        roundPixels: true,
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,   // CENTER_BOTH, CENTER_HORIZONTALLY, CENTER_VERTICALLY
        mode: Phaser.Scale.FIT,                 // ENVELOP, FIT, HEIGHT_CONTROLS_WIDTH, NONE, RESIZE, WIDTH_CONTROLS_HEIGHT
        min: {
            width: MIN_W,
            height: MIN_H
        },
        max: {
            width: MAX_W,
            height: MAX_H,
        },
        zoom: 1,
        parent: "game",
    },
}

gameDebug.enable = false;
gameDebug.enableText = false;
const GAME = new Phaser.Game(CONFIG);