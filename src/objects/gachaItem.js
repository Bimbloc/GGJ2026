import AnimatedContainer from "../UI/animatedContainer.js";
import { createCircleTexture } from "../utils/graphics.js";

export default class GachaItem extends AnimatedContainer {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.MIN_STARS = scene.REWARDS_MIN_STARS;
        this.MAX_STARS = scene.REWARDS_MAX_STARS;

        const BG_ID = "GachaResultBg"
        const BG_RADIUS = 120;
        const BG_COLOR = 0xf7f7ee;

        createCircleTexture(scene, BG_ID, BG_RADIUS, BG_COLOR, 1, 0, BG_COLOR);

        this.ITEM_SCALE = 0.8; 
        this.itemBg = scene.add.image(0, 0, BG_ID);
        this.itemImg = scene.add.image(0, 0, "");
        this.add(this.itemBg);
        this.add(this.itemImg).setScale(this.ITEM_SCALE);
        
        this.STAR_Y = 100;
        this.STAR_SCALE = 0.3;
        this.STARS_OFFSET = 10;
        this.stars = [];
        for (let i = 0; i < this.MAX_STARS; i++) {
            let star = scene.add.image(0, 0, "star").setScale(this.STAR_SCALE);
            this.add(star);
            this.stars.push(star);
        }

        this.NOTIFICATION_POS = 90;
        this.NOTIFICATION_SCALE = 0.4;
        this.notification = scene.add.image(this.NOTIFICATION_POS, -this.NOTIFICATION_POS, "notification").setScale(this.NOTIFICATION_SCALE);
        this.add(this.notification);

        this.resetElements();
    }

    setInitY() {
        this.tweenChain = this.scene.tweens.chain({
            targets: null,
            tweens: [
                {
                    targets: this,
                    y: { from: this.y - this.STARS_OFFSET, to: this.y },
                    alpha: 1,
                    duration: 500,
                    repeat: 0,
                    ease: "Sine.easeOut"
                },
                {
                    targets: this.stars,
                    alpha: 1,
                    rotation: { from: -Math.PI / 2, to: 0 },
                    scale: { from: 0, to: this.STAR_SCALE },
                    duration: 500,
                    repeat: 0,
                    ease: "Sine.easeOut"
                },
                {
                    targets: this.notification,
                    scale: { from: this.NOTIFICATION_SCALE * 1.1, to: this.NOTIFICATION_SCALE },
                    alpha: 1,
                    duration: 500,
                    repeat: 0
                },
                {
                    targets: this.notification,
                    scale: { from: this.NOTIFICATION_SCALE, to: this.NOTIFICATION_SCALE * 1.1 },
                    duration: 600,
                    repeat: -1,
                    yoyo: true,
                }
            ]
        });
        this.tweenChain.pause();
    }

    resetElements() {
        this.setAlpha(0);
        this.notification.setAlpha(0);
        this.notification.setVisible(false);

        this.stars.forEach((star) => {
            star.setPosition(0, this.STAR_Y);
            star.setVisible(false);
            star.setAlpha(0);
        });
    }

    changeItem(textureId, rarity, isNew) {
        this.itemImg.setTexture(`${textureId}_preview`);

        this.resetElements();

        rarity = Phaser.Math.Clamp(rarity, this.MIN_STARS, this.MAX_STARS);

        for (let i = 0; i < rarity; i++) {
            let multiplier = (i % 2 == 0) ? 1 : -1;
            let star = this.stars[i];
            if (rarity % 2 == 0) {
                star.x = (1 + Math.floor(i / 2)) * ((star.displayWidth + this.STARS_OFFSET) * multiplier) - (((star.displayWidth + this.STARS_OFFSET) / 2) * multiplier);
            }
            else {
                star.x = Math.ceil(i / 2) * ((star.displayWidth + this.STARS_OFFSET) * multiplier);
            }
            star.setVisible(true);
        }

        this.notification.setVisible(isNew);
        
        this.tweenChain.restart();
    }
}