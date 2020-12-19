const fs = require("fs");

class Hints {
    constructor(omegga, config, store) {
        this.omegga = omegga;
        this.config = config;
        this.store = store;
    }

    displayHint() {
        const hint = this.hints[this.hintIndex];
        
        if (this.config.prefix != "")
            this.omegga.broadcast(`${this.config.prefix} ${hint}`);
        else
            this.omegga.broadcast(hint);

        this.hintIndex = (this.hintIndex + 1) % this.hints.length;
    }

    async init() {
        this.hints = JSON.parse(await fs.promises.readFile(this.config["hint-file"]));
        this.hintIndex = 0;

        this.interval = setInterval(() => this.displayHint(), this.config["display-interval"] * 1000);
    }

    async stop() {
        clearInterval(this.interval);
    }
}

module.exports = Hints;
