import RectTextButton from "../UI/rectTextButton.js";
import { growAnimation } from "../utils/graphics.js";
import BaseScene from "./baseScene.js";
import TweenQueue from "../utils/tweenQueue.js";

export default class Gacha extends BaseScene {
    constructor() {
        super("Gacha");
    }

    create() {
        let bg = this.add.image(0, 0, "shopBg").setOrigin(0, 0);
        bg.setScale(this.CANVAS_WIDTH / bg.displayWidth, this.CANVAS_HEIGHT / bg.displayHeight);

        // TODO: Ajustar estetica/reemplazar los botones con imagenes
        const TEXT_CONFIG = {
            fontSize: 70,
            fill: "#000000",
            fontStyle: "bold",
            fontFamily: "Pacifico-Regular"
        }
        const OFFSET = 20;
        const BUTTON_WIDTH = 300;
        const BUTTON_HEIGHT = 100;
        const BUTTON_X = this.CANVAS_WIDTH - BUTTON_WIDTH * 0.5 - OFFSET;
        const BUTTON_Y = this.CANVAS_HEIGHT - BUTTON_HEIGHT * 0.5 - OFFSET;
        const BUTTON_COLOR = 0xffffff;
        this.MULTI_PULL_AMOUNT = 10;
        this.multiPull = new RectTextButton(this, BUTTON_X, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, `x${this.MULTI_PULL_AMOUNT}`, TEXT_CONFIG, () => { }, "SinglePullButton", 0.5, 0.5, 25, BUTTON_COLOR);
        this.singlePull = new RectTextButton(this, this.multiPull.x - BUTTON_WIDTH - OFFSET, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, "x1", TEXT_CONFIG, () => { }, "SinglePullButton", 0.5, 0.5, 25, BUTTON_COLOR);

        growAnimation(this.singlePull, this.singlePull.list, () => {
            this.pull(1);
        }, false, false, 1.05, true);

        growAnimation(this.multiPull, this.multiPull.list, () => {
            this.pull(this.MULTI_PULL_AMOUNT);
        }, false, false, 1.05, true);

        // TODO: Reemplazar por imagenes finales
        this.machineBot = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "gachaBot").setDepth(0);
        this.capsule = this.add.image(638, 507, "capsule").setDepth(1);
        this.capsuleTop = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "gachaTop").setDepth(1);
        this.handle = this.add.image(557, 572, "handle").setDepth(1);

        this.capsuleTop = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "capsuleTop").setScale(2).setDepth(1);
        this.capsuleBot = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "capsuleBot").setScale(2).setDepth(1);
        this.capsuleTop.setVisible(false);
        this.capsuleBot.setVisible(false);

        this.resultBg = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "gachaBg").setDepth(1);
        this.resultBg.setVisible(false);
        this.flash = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "flash").setScale(0).setDepth(1);
    }

    pull(amount) {
        let rewards = [];
        let hasFour = false;
        
        // TODO: Implementar posibilidades de verdad 
        for (let i = rewards.length; i < amount - 1; i++) {
            let result = Math.floor(Math.random() * (6 - 3) + 3);
            rewards.push(result);

            hasFour |= (result > 3);
        }
        if (amount === this.MULTI_PULL_AMOUNT && !hasFour) {
            rewards.push(4);
        }
        else {
            rewards.push(Math.floor(Math.random() * (6 - 3) + 3));
        }
        console.log(rewards);

        // TODO: Hacer que el jugador obtenga los objetos

        this.playPullAnimation();
    }

    // TODO: Ajustar con graficos finales y mostrar objetos obtenidos
    playPullAnimation() {
        this.resetElements();
        this.singlePull.disableInteractive();
        this.multiPull.disableInteractive();
        
        let queue = new TweenQueue(this.tweens, this.dispatcher);

        let spinAnim = {
            targets: this.handle,
            duration: 300,
            repeat: 0,
            rotation: Math.PI * 0.5
        };

        // Gira la palanca
        for (let i = 0; i < 4; i++) {
            queue.push((handle) => {
                spinAnim.rotation = Math.PI * 0.5 + handle.rotation;
                return spinAnim;
            }, i === 0 ? 0 : 100, this.handle);
        }

        // Cae la bola
        queue.push({
            targets: this.capsule,
            duration: 150,
            repeat: 0,
            y: this.capsule.y + this.capsule.displayHeight
        }, 100);

        // Se agita al caer
        let duration = 50;
        const ROTATION = Math.PI * 0.1;
        queue.push({
            targets: this.capsule,
            duration: duration,
            repeat: 0,
            rotation: -ROTATION
        });
        queue.push({
            targets: this.capsule,
            duration: duration * 2,
            repeat: 0,
            rotation: ROTATION
        });
        queue.push({
            targets: this.capsule,
            duration: 100,
            repeat: 0,
            rotation: 0
        });

        // Se hace grande y se coloca en el centro
        queue.push(() => {
            this.capsule.setDepth(2);
            return {
                targets: this.capsule,
                duration: 500,
                scale: this.capsule.scale * 2,
                x: this.CANVAS_WIDTH / 2,
                y: this.CANVAS_HEIGHT / 2,
                repeat: 0,
            };
        }, 100, this.capsule);

        // Se vuelve a agitar
        duration = 100;
        queue.push({
            targets: this.capsule,
            duration: duration,
            repeat: 0,
            rotation: -ROTATION
        }, 200);
        queue.push({
            targets: this.capsule,
            duration: duration * 2,
            repeat: 0,
            rotation: ROTATION
        });
        queue.push({
            targets: this.capsule,
            duration: duration,
            repeat: 0,
            rotation: 0
        });

        // Se abre
        const DELAY = 600; 
        queue.push(() => {
            // Oculta la bola completa y muestra la partida
            this.capsule.setVisible(false)
            this.capsuleTop.setVisible(true);
            this.capsuleBot.setVisible(true);

            setTimeout(() => {
                this.tweens.add({
                    targets: this.capsuleTop,
                    duration: 150,
                    y: this.capsuleTop.y - 20,
                    repeat: 0,
                });
            }, DELAY);

            return {
                targets: this.capsuleBot,
                duration: 200,
                y: this.capsuleTop.y + 20,
                repeat: 0,
            };
        }, DELAY, this.capsule);

        // Muestra el destello
        queue.push({
            targets: this.flash,
            alpha: { from: 0, to: 1 },
            duration: 700,
            scale: 6,
            repeat: 0,
        });

        // Muestra el fondo y quita el destello
        queue.push(() => {
            this.resultBg.setVisible(true);
            return {
                targets: this.flash,
                alpha: { from: 1, to: 0 },
                duration: 700,
                scale: 0,
                repeat: 0,
            };
        });

        queue.onComplete(()=> {
            super.setInteractive(this.singlePull);
            super.setInteractive(this.multiPull);
        });
    }
    
    resetElements() {
        this.capsule.setPosition(638, 507).setScale(1).setVisible(true).setDepth(0);

        this.capsuleTop.setPosition(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2).setScale(2).setVisible(false);
        this.capsuleBot.setPosition(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2).setScale(2).setVisible(false);

        this.resultBg.setVisible(false);
        this.flash.setScale(0);
    }

}