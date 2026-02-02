import Client from "./client.js";
import EventNames from "../utils/eventNames.js";

export default class ClientGenerator {
    constructor(scene, x, y) {
        this.scene = scene;

        this.x = x;
        this.y = y;
        this.gm = scene.gameManager;
        this.dispatcher = scene.dispatcher;

        this.maxClients = 1;
        this.spawnInterval = 5000;
        this.spacingX = -300;

        this.activeClients = [];
        this.timer = null;

        this.dispatcher.add(EventNames.maskSubmitted, this, this._onMaskSubmitted.bind(this));
    }

    start() {
        if (this.timer) return;
        this.timer = this.scene.time.addEvent({
            delay: this.spawnInterval,
            callback: this.spawnIfNeeded,
            callbackScope: this,
            loop: true
        });
        this.spawnIfNeeded();
    }

    stop() {
        if (this.timer) {
            this.timer.remove(false);
            this.timer = null;
        }
    }

    spawnIfNeeded() {
        if (this.activeClients.length < this.maxClients) {
            this.spawnClient();
        }
    }

    spawnClient(requestedMask = null) {
        const idx = this.activeClients.length;
        const cx = this.x + idx * this.spacingX;
        const client = new Client(this.scene, cx, this.y, requestedMask);
        this.activeClients.push(client);
        this.dispatcher.dispatch(EventNames.clientAdded, { client });
        return client;
    }

    _onMaskSubmitted(params) {
        this.tryServe(params.mask);
    }

    tryServe(mask) {
        if (this.activeClients.length === 0) return;
        const client = this.activeClients[0];
        const num = client.countMaskMatches(mask);
        client.serve(num===4);
        this.dispatcher.dispatch(EventNames.clientServed, { client, success: num });
        this.activeClients.shift();
        this._repositionClients();
        this.spawnIfNeeded();
    }

    _repositionClients() {
        this.activeClients.forEach((client, i) => {
            const newX = this.x + i * this.spacingX;
            this.scene.tweens.add({
                targets: client,
                x: newX,
                duration: 200
            });
        });
    }

    clear() {
        this.activeClients.forEach(c => c.destroy(true));
        this.activeClients = [];
    }
}
