export default class TweenQueue {
    constructor(tweensObj) {
        this.queue = [];
        this.running = false;
        this.tweens = tweensObj;
        this.completeCallbacks = [];
    }

    push(tweenInfo, timeout) {
        this.queue.push({tweenInfo, timeout, args: Array.from(arguments).slice(2)});

        this.next();
    }

    // Don't call this method :)
    next() {
        if(this.running) return;
        if(this.queue.length === 0) {
            this.completeCallbacks.forEach(callback => {
                callback();
            });
            return;
        }

        this.running = true;
        const info = this.queue.shift();
        if(typeof(info.tweenInfo) === "function") info.tweenInfo = info.tweenInfo.apply(this, info.args);
        if(info.timeout) {
            setTimeout(() => {
                let tween = this.tweens.add(info.tweenInfo);
                tween.on("complete", () => { this.running = false; this.next(); });
            }, info.timeout);
        } else {
            let tween = this.tweens.add(info.tweenInfo);
            tween.on("complete", () => { this.running = false; this.next(); });
        }
    }

    onComplete(func) {
        this.completeCallbacks.push(func);
    }
}
