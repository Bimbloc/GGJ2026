import Singleton from "../utils/singleton.js";
import SceneManager from "./sceneManager.js";
import EventDispatcher from "./eventDispatcher.js";
import Blackboard from "../utils/blackboard.js";
import EventNames from "../utils/eventNames.js";

export default class GameManager extends Singleton {
    constructor() {
        super("GameManager");

        this.sceneManager = SceneManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();

        // Blackboard de variables de todo el juego
        this.blackboard = new Blackboard();
        this.ui = null;
    }

    init(cosmeticsByType, cosmeticsInfo, capsuleVariants) {
        this.cosmeticsByType = cosmeticsByType;
        this.cosmeticsInfo = cosmeticsInfo;
        this.capsuleVariants = capsuleVariants;

        this.allCategories = [];
        cosmeticsByType.forEach((items, category) => {
            this.allCategories.push(category);
        });

        let rarities = this.sceneManager.currentScene.cache.json.get("partsRarities");
        this.itemsByRarity = [];
        for (let i = 0; i < rarities.length; i++) {
            this.itemsByRarity.push(rarities[i]);
            rarities[i].forEach((cosmetic) => {
                if (this.cosmeticsInfo.has(cosmetic)) {
                    this.cosmeticsInfo.get(cosmetic).rarity = i;
                }
            });
        }

        this.dispatcher.add(EventNames.clientServed, this, (param) => {
            if(param.success>0) {
                // TODO: Parametrizar
                this.blackboard.set("money", this.blackboard.get("money") + param.success * 25);
                this.dispatcher.dispatch(EventNames.currencyChanged);
            }
        }, true);
    }

    getRandomCapsule() {
        return this.capsuleVariants[Math.floor(Math.random() * this.capsuleVariants.length)];
    }
    getRandomItemByRarity(rarity) {
        let possibleItems = this.itemsByRarity[rarity]; 
        return possibleItems[Math.floor(Math.random() * this.itemsByRarity[rarity].length)];
    }
    getItemByIndex(category, i) {
        return Array.from(this.blackboard.get("unlockedCosmetics").get(category)).at(i);
    }
    getItemCategory(id) {
        if (this.cosmeticsInfo.has(id)) {
            return this.cosmeticsInfo.get(id).category;
        }
        return null;
    }

    unlockItem(id) {
        this.blackboard.get("unlockedCosmetics").get(this.getItemCategory(id)).add(id);
    }
    checkItemUnlocked(id) {

        return this.blackboard.get("unlockedCosmetics").get(this.getItemCategory(id)).has(id);
    }


    goToMainMenu() {
        // this.startGame();
        this.sceneManager.changeScene("MainMenu", null, true, false);
    }

    resetGame() {
        this.blackboard.clear();
        this.dispatcher.removeAll();

        this.sceneManager.clearParallelScenes();

        this.sceneManager.runInParallel("CommonUI");
        this.ui = this.sceneManager.getScene("CommonUI");

        // TODO: Parametrizar
        this.blackboard.set("money", 1000);
        this.blackboard.set("debt", -1000);
        this.blackboard.set("gachaCurrency", 0);

        this.blackboard.set("unlockedCosmetics", new Map());
        
        this.cosmeticsByType.forEach((items, category) => {
            this.blackboard.get("unlockedCosmetics").set(category, new Set());
        });
        this.itemsByRarity[2].forEach((item) => {
            this.unlockItem(item);
        });
    }

    startGame() {
        this.resetGame();
        this.sceneManager.changeScene("Shop", null, false, false);
    }
}