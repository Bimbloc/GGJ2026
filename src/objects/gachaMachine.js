import TweenQueue from "../utils/tweenQueue.js";

export default class GachaMachine extends Phaser.GameObjects.Container {
    constructor(scene, x = 0, y = 0, multiPullAmount) {
        super(scene, x, y);
        scene.add.existing(this);

        this.scene = scene;
        this.MACHINE_SCALE = 1.2;

        this.machineBot = scene.add.image(0, 0, "gachaBot").setScale(this.MACHINE_SCALE);
        this.machineTop = scene.add.image(0, 0, "gachaTop").setScale(this.MACHINE_SCALE);
        this.handle = scene.add.image(-100 / 2, 285 / 2, "handle").setScale(this.MACHINE_SCALE);
        this.add(this.machineBot);
        this.add(this.machineTop);
        this.add(this.handle);

        this.CAPSULE_VARIANTS = scene.gameManager.blackboard.get("capsules");
        this.CAPSULE_INIT_X = 50;
        this.CAPSULE_INIT_Y = 70;
        this.capsule = scene.add.container(0, 0);
        this.capsuleTop = scene.add.image(0, 0, "capsuleTop");
        this.capsuleBot = scene.add.image(0, 0, "");
        this.capsule.add(this.capsuleTop);
        this.capsule.add(this.capsuleBot);
        this.add(this.capsule);

        this.flash = scene.add.image(0, -70, "flash").setScale(0);
        this.resultBg = scene.add.image(0, 0, "gachaBg");
        this.add(this.flash);
        this.add(this.resultBg);

        // TODO: Crear multiPullAmount objetos para mostrar los resultados de las tiradas
        
        this.resetElements();

        this.tweenQueue = new TweenQueue(scene.tweens, scene.dispatcher);
    }

    resetElements() {
        this.capsuleBot.y = 0;
        this.capsuleTop.y = 0;
        this.capsule.setPosition(this.CAPSULE_INIT_X, this.CAPSULE_INIT_Y).setScale(this.MACHINE_SCALE).setVisible(true);
        this.capsule.setPosition(this.CAPSULE_INIT_X, this.CAPSULE_INIT_Y).setScale(this.MACHINE_SCALE).setVisible(true);
        this.capsuleBot.setTexture(this.CAPSULE_VARIANTS[Math.floor(Math.random() * this.CAPSULE_VARIANTS.length)]);

        this.resultBg.setVisible(false);
        this.flash.setVisible(false).setScale(0).setRotation(0);

        this.sendToBack(this.capsule);
        this.sendToBack(this.machineBot);
        this.bringToTop(this.machineTop);
        this.bringToTop(this.handle);
        this.bringToTop(this.flash);
        this.bringToTop(this.resultBg);
    }

    playPullAnimation(results = []) {
        this.resetElements();

        this.spinHandle();
        this.fallAndBounce();
        this.growCapsule();
        this.shakeCapsule();
        this.openCapsule();
        this.showFlash();

        // TODO: Actualizar objetos obtenidos por los objetos de los resultados 
        
        this.showResults(results);

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

    showResults(results) {
        this.tweenQueue.push(() => {
            this.resultBg.setVisible(true);
            return {
                targets: this.flash,
                alpha: { from: 1, to: 0 },
                duration: 700,
                repeat: 0,
            };
        }, 500);

        // TODO: Mostrar animacion de los objetos

        this.tweenQueue.onComplete(() => {
            this.scene.dispatcher.dispatch("pullAnimationEnded");
        });
    }
}