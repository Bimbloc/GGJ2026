import InteractiveContainer from "./interactiveContainer.js";
import TextArea from "./textArea.js";
import { createRectTexture } from "../utils/graphics.js";

export default class RectTextButton extends InteractiveContainer {
    /**
    * Clase para los botones con texto cuyo fondo es un rectangulo. Si no se especifica nada, por defecto
    * el rectangulo tendra su origen en el centro y el texto se colocara centrado en el rectangulo
    * 
    * @extends InteractiveContainer
    * @param {Phaser.Scene} scene - escena en la que se va a crear el boton 
    * @param {Number} x - posicion x del boton 
    * @param {Number} y - posicion y del boton 
    * @param {Number} width - ancho del rectangulo
    * @param {Number} height - alto del rectangulo
    * @param {String} text - texto a escribir
    * @param {Object} textConfig - configuracion del texto
    * @param {Function} onClick - funcion a llamar al pulsar el boton (opcional)
    * @param {String} textureId - id de la textura que se creara para el fondo. Si no se especifica, se reutilizara la del primer rectangulo sin id que se cree (opcional)
    * @param {Number} rectOriginX - origen x del rectangulo [0-1] (opcional)
    * @param {Number} rectOriginY - origen y del rectangulo [0-1] (opcional)
    * @param {Number} radiusPercentage - valor en porcentaje del radio de los bordes [0-100] (opcional)
    * @param {Number} fillColor - valor hex del color por defecto del rectangulo (opcional)
    * @param {Number} fillAlpha - alpha del rectangulo [0-1] (opcional) 
    * @param {Number} borderThickness - ancho del borde del rectangulo (opcional)
    * @param {Number} borderColor - valor hex del color por defecto del borde (opcional)
    * @param {Number} borderAlpha - alpha del borde [0-1] (opcional)
    * @param {Number} textOriginX - origen x del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textOriginY - origen y del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textPaddingX - margen x entre el texto y sus dimensiones maximas (opcional)
    * @param {Number} textPaddingY - margen y entre el texto y sus dimensiones maximas (opcional)
    * @param {Number} textOffsetX - offset x del texto (opcional)
    * @param {Number} textOffsetY - offset y del texto (opcional)
    * @param {Number} textAlignX - alineacion horizontal del texto [0-1] (opcional)
    * @param {Number} textAlignY - alineacion vertical del texto [0-1] (opcional)
    */
    constructor(scene, x, y, width, height, text, textConfig, onClick = () => { }, textureId = "rectButtonTexture",
        rectOriginX = 0.5, rectOriginY = 0.5, radiusPercentage = 0, fillColor = 0xffffff, fillAlpha = 1, borderThickness = 5, borderColor = 0x000000, borderAlpha = 1,
        textOriginX = 0.5, textOriginY = 0.5, textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textAlignX = 0.5, textAlignY = 0.5) {
        super(scene, x, y);

        createRectTexture(this.scene, textureId, width, height, fillColor, fillAlpha, borderThickness, borderColor, borderAlpha, radiusPercentage);

        // Se crea la imagen en base a la textura indicada
        this.rect = this.scene.add.image(0, 0, textureId).setOrigin(rectOriginX, rectOriginY);
        this.add(this.rect);

        let textX = this.rect.x + this.rect.displayWidth * (0.5 - rectOriginX);
        let textY = this.rect.y + this.rect.displayHeight * (0.5 - rectOriginY);
        this.textObj = new TextArea(this.scene,
            textX, textY, width, height, text, textConfig, textOriginX, textOriginY, textPaddingX, textPaddingY, textOffsetX, textOffsetY, textAlignX, textAlignY)
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