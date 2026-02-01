import InteractiveContainer from "./interactiveContainer.js";
import TextArea from "./textArea.js";

export default class ImageTextButton extends InteractiveContainer {
    /**
    * Clase para los botones con texto cuyo fondo es una imagen. Si no se especifica nada, el texto se colocara centrado en la imagen
    * 
    * @extends InteractiveContainer
    * @param {Phaser.Scene} scene - escena en la que se va a crear el boton 
    * @param {Number} x - posicion x del boton 
    * @param {Number} y - posicion y del boton 
    * @param {String} text - texto a escribir
    * @param {Object} textConfig - configuracion del texto
    * @param {Phaser.GameObjects} img - instancia previamente creada de un GameObject (Image, Sprite, NineSlice...) que tenga  displayWidth y displayHeight
    * @param {Function} onClick - funcion a llamar al pulsar el boton (opcional)
    * @param {Number} textOriginX - origen x del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textOriginY - origen y del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textPaddingX - margen x entre el texto y sus dimensiones maximas (opcional)
    * @param {Number} textPaddingY - margen y entre el texto y sus dimensiones maximas (opcional)
    * @param {Number} textOffsetX - offset x del texto (opcional)
    * @param {Number} textOffsetY - offset y del texto (opcional)
    * @param {Number} textAlignX - alineacion horizontal del texto [0-1] (opcional)
    * @param {Number} textAlignY - alineacion vertical del texto [0-1] (opcional)
    */
    constructor(scene, x, y, text, textConfig, img, onClick = () => { }, 
        textOriginX = 0.5, textOriginY = 0.5, textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textAlignX = 0.5, textAlignY = 0.5) {
        super(scene, x, y);

        img.setPosition(0, 0);
        this.image = img;
        this.add(this.image);

        let textX = this.image.displayWidth * (0.5 - this.image.originX);
        let textY = this.image.displayHeight * (0.5 - this.image.originY);
        this.textObj = new TextArea(this.scene,
            textX, textY, this.image.displayWidth, this.image.displayHeight, text, textConfig, textOriginX, textOriginY, textPaddingX, textPaddingY,
            textOffsetX, textOffsetY, textAlignX, textAlignY)
        this.textObj.adjustFontSize();
        this.add(this.textObj);

        this.calculateRectangleSize();

        if (onClick != null && typeof onClick === "function") {
            this.onClick = onClick;
            this.setInteractive();
            this.on("pointerdown", onClick);
        }
    }
}