export default class Singleton {
    /**
    * Clase base para los singletons 
    * @param {String} className - nombre de la clase. Se usa solo para el mensaje de la constructora
    */

    static instance = null;

    constructor(className = "Singleton") {
        const Class = this.constructor;
        if (!Class.instance) {
            Class.instance = this;
        }
        else {
            console.warn(className, "is a Singleton class!");
        }
        return Class.instance;
    }

    /**
    * Crear y obtener la instancia
    * @returns {Singleton} - instancia unica de la clase
    */
    static create() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    /**
    * Obtener la instancia
    * @returns {Singleton} - instancia unica de la clase
    */
    static getInstance() {
        return this.create();
    }
}