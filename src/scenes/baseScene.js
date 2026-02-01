import Blackboard from "../utils/blackboard.js";
import GameManager from "../managers/gameManager.js";
import SceneManager from "../managers/sceneManager.js";
import EventDispatcher from "../managers/eventDispatcher.js";
import { setInteractive } from "../utils/misc.js";

export default class BaseScene extends Phaser.Scene { 
    /**
    * Escena base para las escenas del juego. Guarda parametros como las dimensiones del canvas o los managers
    * @extends Phaser.Scene
    * @param {String} name - id de la escena
    * @param {String} atlasName - nombre del atlas que se utiliza en esta escena (opcional)
    */
    constructor(sceneName, atlasName = "") {
        super({key: sceneName});
        
        this.atlasName = atlasName;
    }

    init() {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.BASE_TEXT_CONFIG = {
            fontSize: 50,
            fill: "#000000",
            fontStyle: "bold",
            fontFamily: "Pacifico-Regular"
        }
    }

    create(params) {
        this.blackboard = new Blackboard();

        this.gameManager = GameManager.getInstance();
        this.sceneManager = SceneManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();

        // Funciones adicionales a las que se llamara al crear y reactivar la escena
        this.events.once("create", () => {
            this.onCreate(params);
        }, this);
        this.events.on("wake", (scene, params) => {
            this.onWake(params);
        }, this);
    }
    
    /**
    * Se llama al terminar de crear la escena
    * @param {Object} params - parametros adicionales que pasar a la funcion (opcional)
    */
    onCreate(params) { }

    /**
    * Se llama al despertar la escena
    * @param {Object} params - parametros adicionales que pasar a la funcion (opcional)
    */
    onWake(params) { }

    /**
    * Se llama al detener la escena. Limpia los eventos del dispatcher
    * @param {Object} params - parametros adicionales que pasar a la funcion (opcional)
    */
    shutdown(params) {
        if (this.dispatcher != null) {
            this.dispatcher.removeByObject(this);
        }
    }

    setInteractive(gameObject, config = {}) {
        setInteractive(gameObject, config);
    }
}
