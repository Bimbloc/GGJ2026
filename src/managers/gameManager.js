import Singleton from "../utils/singleton.js";
import SceneManager from "./sceneManager.js";
import EventDispatcher from "./eventDispatcher.js";
import Blackboard from "../utils/blackboard.js";

export default class GameManager extends Singleton {
    constructor() {
        super("GameManager");

        this.sceneManager = SceneManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();

        // Blackboard de variables de todo el juego
        this.blackboard = new Blackboard();
        this.ui = null;
    }

    init() {
    }

    goToMainMenu() {
        // this.sceneManager.changeScene("Shop", null, true, false);
        this.sceneManager.changeScene("Gacha", null, true, false);
    }

    resetGame() {
        this.blackboard.clear();
        this.dispatcher.removeAll();

        this.sceneManager.clearParallelScenes();

        // this.sceneManager.runInParallel("UI");
        // this.ui = this.sceneManager.getScene("UI");
    }

    startGame() {

    }
}