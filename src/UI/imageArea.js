import { range } from "../utils/misc.js";

export default class ImageArea extends Phaser.GameObjects.Image {
    /**
    * Imagen que tiene que estar contenida en un area especifica
    * @extends Phaser.GameObjects.Text
    * @param {Phaser.GameObjects.Scene} scene - escena en la que se crea
    * @param {Number} x - posicion x del imagen (opcional)
    * @param {Number} y - posicion y del imagen (opcional)
    * @param {Number} maxWidth - ancho maximo que puede ocupar el imagen (opcional)
    * @param {Number} maxHeight - alto maximo que puede ocupar el imagen (opcional)
    * @param {String} imgAtlas - id del atlas en el que esta la imagen (opcional)
    * @param {String} img - id de la imagen (opcional)
    */
    constructor(scene, x = 0, y = 0, maxWidth = 100, maxHeight = 100, imgAtlas = "", img = "",
        originX = 0, originY = 0) {
        if (imgAtlas === "") {
            super(scene, x, y, img);
        }
        else {
            super(scene, x, y, imgAtlas, img);
        }
        scene.add.existing(this);

        this.setOrigin(originX, originY);

        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }

    /**
    * Comprueba si la imagen cabe en los limites establecidos
    * @returns {Boolean} - true si la imagen cabe, false en caso contrario
    */
    fits() {
        return this.displayWidth <= this.maxWidth && this.displayHeight <= this.maxHeight;
    }


    /**
    * Ajusta automaticamente la escala de la imagen para que quepa en el area indicada
    * @param {Number} reduction - reduccion que se le ira aplicando a la escala cada vez que se compruebe si cabe o no 
    */
    adjustScale(reduction = 0.1) {
        let scales = range(0, this.scale, reduction);

        if (this.maxWidth > 0 && this.maxHeight > 0 && !this.fits()) {
            let ini = 0;
            let end = scales.length - 1;

            // Divide y venceras
            while (end - ini > 1) {
                let half = Math.floor((end + ini) / 2);
                this.setScale(scales[half]);

                if (this.fits()) {
                    ini = half;
                }
                else {
                    end = half;
                }
            }

            this.setScale(scales[ini]);
        }
    }
}