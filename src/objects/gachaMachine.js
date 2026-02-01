import TweenQueue from "../utils/tweenQueue.js";
import GachaItem from "./gachaItem.js";
import Grid from "../UI/grid.js";
import EventNames from "../utils/eventNames.js";

export default class GachaMachine extends Phaser.GameObjects.Container {
    constructor(scene, x = 0, y = 0, multiPullAmount) {
        super(scene, x, y);
        scene.add.existing(this);

        this.scene = scene;
        this.MACHINE_SCALE = 1.2;

        // Agujero de la maquina
        this.machineBot = scene.add.image(0, 0, "gachaBot").setScale(this.MACHINE_SCALE);
        this.add(this.machineBot);
        
        // Parte superior de la maquina
        this.machineTop = scene.add.image(0, 0, "gachaTop").setScale(this.MACHINE_SCALE);
        this.add(this.machineTop);

        // Manivela de la maquina
        this.handle = scene.add.image(-100 / 2, 285 / 2, "handle").setScale(this.MACHINE_SCALE);
        this.add(this.handle);

        // Capsula separada en parte superior e inferior
        this.CAPSULE_INIT_X = 50;
        this.CAPSULE_INIT_Y = 70;
        this.capsule = scene.add.container(0, 0);
        this.add(this.capsule);
        this.capsuleTop = scene.add.image(0, 0, "capsuleTop");
        this.capsule.add(this.capsuleTop);
        this.capsuleBot = scene.add.image(0, 0, "");
        this.capsule.add(this.capsuleBot);

        // Efecto de destello al abrir la capsula
        this.flash = scene.add.image(0, -70, "flash").setScale(0);
        this.add(this.flash);

        // Fondo de los resultados de la tirada
        this.resultBg = scene.add.image(0, 0, "gachaBg");
        this.add(this.resultBg);

        // Resultado de las tiradas individuale
        const PULL_ITEMS_Y = -60;
        this.singlePullItem = new GachaItem(scene, 0, PULL_ITEMS_Y);
        this.singlePullItem.setInitY();
        this.add(this.singlePullItem);
        
        // Resultados de las tiradas multiples
        const MULTI_PULL_WIDTH_MULTIPLIER = 1;
        const MULTI_PULL_HEIGHT_MULTIPLIER = 0.7;
        const MULTI_PULL_WIDTH = scene.CANVAS_WIDTH * MULTI_PULL_WIDTH_MULTIPLIER;
        const MULTI_PULL_HEIGHT = scene.CANVAS_HEIGHT * MULTI_PULL_HEIGHT_MULTIPLIER;
        const MULTI_PULL_GRID_X = -scene.CANVAS_WIDTH * (MULTI_PULL_WIDTH_MULTIPLIER / 2);
        const MULTI_PULL_GRID_Y = -scene.CANVAS_HEIGHT * (MULTI_PULL_HEIGHT_MULTIPLIER / 2) + PULL_ITEMS_Y;
        const MULTI_PULL_PADDING = 30;
        this.multiPullGrid = new Grid(scene, MULTI_PULL_GRID_X, MULTI_PULL_GRID_Y, MULTI_PULL_WIDTH, MULTI_PULL_HEIGHT, scene.MULTI_PULL_AMOUNT / 2, 2, MULTI_PULL_PADDING);
        this.add(this.multiPullGrid);
        this.multiPullItems = [];
        for (let i = 0; i < multiPullAmount; i++) {
            let item = new GachaItem(scene, 0, PULL_ITEMS_Y);
            this.multiPullItems.push(item);
            this.multiPullGrid.addItem(item);

            item.setInitY();
        }

        this.tweenChain = this.scene.tweens.chain({
            targets: null,
            tweens: [
                {
                    targets: [],
                    duration: 0,
                    repeat: 0
                }
            ]
        });
        this.tweenChain.pause();


        this.tweenQueue = new TweenQueue(scene.tweens, scene.dispatcher);
        this.tweenQueue.onComplete(() => {
            this.scene.dispatcher.dispatch(EventNames.pullAnimationEnd);
        });

        this.resetElements(null);
    }

    resetElements(duration = 700) {
        let anim = {};
        
        let onComplete = () => {
            // Se unen las 2 partes de la capsula
            this.capsuleBot.y = 0;
            this.capsuleTop.y = 0;

            // Se recoloca la capsula y se asigna a la parte inferior una textura aleatoria
            this.capsule.setPosition(this.CAPSULE_INIT_X, this.CAPSULE_INIT_Y).setScale(this.MACHINE_SCALE).setVisible(true);
            this.capsuleBot.setTexture(this.scene.gameManager.getRandomCapsule());

            // Oculta el fondo y los resultados de las tiradas y reinicia sus opacidades
            this.resultBg.setVisible(false).setAlpha(1);
            this.singlePullItem.setVisible(false).setAlpha(1);
            this.multiPullGrid.setVisible(false).setAlpha(1);

            // Oculta el destello y reinicia su rotacion
            this.flash.setVisible(false).setScale(0).setRotation(0);

            // Recoloca todos los objetos en su profundidad correspondiente
            this.sendToBack(this.capsule);
            this.sendToBack(this.machineBot);
            this.bringToTop(this.machineTop);
            this.bringToTop(this.handle);
            this.bringToTop(this.flash);
            this.bringToTop(this.resultBg);
            this.bringToTop(this.singlePullItem);
            this.bringToTop(this.multiPullGrid);
        };
        
        if (duration == null) {
            anim = this.scene.tweens.add({
                targets: [],
                duration: 0,
                repeat: 0,
            });
            onComplete();
        }
        else {
            duration = this.resultBg.visible ? 700 : 0;
            anim = this.scene.tweens.add({
                targets: [this.resultBg, this.singlePullItem, this.multiPullGrid],
                alpha: { from: 1, to: 0 },
                duration: duration,
                repeat: 0,
            });
            anim.on("complete", () => {
                onComplete();
            });
        }
        return anim;
    }

    playPullAnimation(results = []) {
        this.scene.dispatcher.dispatch(EventNames.pullAnimationStart);
        
        this.resetElements().on("complete", () => {           
            this.spinHandle();
            this.fallAndBounce();
            this.growCapsule();
            this.shakeCapsule();
            this.openCapsule();
            this.showFlash();

            this.showResults(results);
        });
    }

    spinHandle() {
        const SPIN_DURATION = 300;
        for (let i = 0; i < 4; i++) {
            this.tweenQueue.push(() => {
                return {
                    targets: this.handle,
                    duration: SPIN_DURATION,
                    repeat: 0,
                    rotation: Math.PI * 0.5 + this.handle.rotation
                };
            }, i === 0 ? 0 : 100, this.handle);
        }
    }

    fallAndBounce() {
        const CAPSULE_DROPPED_Y = 150;
        this.tweenQueue.push(() => {
            return {
                targets: this.capsule,
                duration: 500,
                repeat: 0,
                rotation: (Math.random() * 1.5 - 1) * Math.PI,
                y: CAPSULE_DROPPED_Y,
                ease: "Bounce.Out"
            };
        }, 100);
    }

    growCapsule() {
        const CAPSULE_BIG_Y = -80;
        this.tweenQueue.push(() => {
            this.bringToTop(this.capsule);
            return {
                targets: this.capsule,
                duration: 500,
                scale: this.capsule.scale * 2,
                x: 0,
                y: CAPSULE_BIG_Y,
                rotation: 0,
                repeat: 0,
            };
        }, 100, this.capsule);
    }

    shakeCapsule() {
        const DURATION = 100;
        const ROTATION = Math.PI * 0.1;
        this.tweenQueue.push({
            targets: this.capsule,
            duration: DURATION,
            repeat: 0,
            rotation: -ROTATION
        }, 200);
        this.tweenQueue.push({
            targets: this.capsule,
            duration: DURATION * 2,
            repeat: 0,
            rotation: ROTATION
        }, 100);
        this.tweenQueue.push({
            targets: this.capsule,
            duration: DURATION,
            repeat: 0,
            rotation: 0
        }, 100);
    }

    openCapsule() {
        const DELAY = 600;
        const MOVEMENT = 10;
        this.tweenQueue.push(() => {
            setTimeout(() => {
                this.scene.tweens.add({
                    targets: this.capsuleTop,
                    duration: 150,
                    y: this.capsuleTop.y - MOVEMENT,
                    repeat: 0,
                });
            }, DELAY);

            return {
                targets: this.capsuleBot,
                duration: 200,
                y: this.capsuleBot.y + MOVEMENT,
                repeat: 0,
            };
        }, DELAY, this.capsule);
    }

    showFlash() {
        const FLASH_SCALE = 3.5;
        const FLASH_ROTATION = Math.PI * 2;
        this.tweenQueue.push(() => {
            this.bringToTop(this.resultBg);
            this.bringToTop(this.flash);
            this.flash.setVisible(true);
            return {
                targets: this.flash,
                alpha: { from: 0, to: 1 },
                duration: 1000,
                scale: FLASH_SCALE,
                rotation: FLASH_ROTATION,
                repeat: 0,
            }
        });
    }

    showResults(rewards) {
        this.tweenQueue.push(() => {
            this.resultBg.setVisible(true);
            this.capsule.setVisible(false);
            return {
                targets: this.flash,
                alpha: { from: 1, to: 0 },
                duration: 500,
                repeat: 0,
            };
        }, 500);

        this.scene.dispatcher.addOnce(EventNames.pullAnimationEnd, this, () => {
            if (rewards.length == 1) {
                this.singlePullItem.setVisible(true);
                this.bringToTop(this.singlePullItem);
                this.singlePullItem.changeItem(rewards[0].texture, rewards[0].rarity, rewards[0].isNew);
            }
            else {
                this.multiPullGrid.setVisible(true);
                this.bringToTop(this.multiPullGrid);

                for (let i = 0; i< rewards.length; i++) {
                    this.multiPullItems[i].changeItem(rewards[i].texture, rewards[i].rarity, rewards[i].isNew);
                }
            }
        });
    }
}