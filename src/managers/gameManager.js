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

    init(allCosmetics, allCapsules) {
        this.allCosmetics = allCosmetics;
        this.allCapsules = allCapsules;

        this.allCategories = [];
        allCosmetics.forEach((category) => {
            this.allCategories.push(category);
        });
    }

    unlockItem(category, id) {
        this.blackboard.get("unlockedCosmetics").get(category).add(id);
    }
    checkItemUnlocked(category, id) {
        return this.blackboard.get("unlockedCosmetics").get(category).has(id);
    }

    goToMainMenu() {
        // this.sceneManager.changeScene("Shop", null, true, false);
        this.resetGame();
        this.sceneManager.changeScene("Gacha", null, true, false);
    }

    resetGame() {
        this.blackboard.clear();
        this.dispatcher.removeAll();

        this.sceneManager.clearParallelScenes();

        // this.sceneManager.runInParallel("UI");
        // this.ui = this.sceneManager.getScene("UI");

        // TODO: Parametrizar
        this.blackboard.set("money", 0);
        this.blackboard.set("debt", -1000);
        this.blackboard.set("gachaCurrency", 2);

        this.blackboard.set("unlockedCosmetics", new Map());
        
        this.blackboard.set("cosmetics", this.allCosmetics);

        this.allCosmetics.forEach((category) => {
            if (!this.blackboard.get("unlockedCosmetics").has(category)) {
                this.blackboard.get("unlockedCosmetics").set(category, new Set());
            }

            // TODO: Elegir X cosmeticos aleatorios
            for (let i = 0; i < 4; i++) {
                this.blackboard.get("unlockedCosmetics").get(category).add("asdasd");
            }
        });
    }

    startGame() {

    }
}