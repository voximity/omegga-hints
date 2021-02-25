const fs = require("fs");

class Hints {
    constructor(omegga, config, store) {
        this.omegga = omegga;
        this.config = config;
        this.store = store;
    }

    async reloadHints() {
        const source = await fs.promises.readFile(this.config["file"]);
        this.hints = source.toString().split("\n").map((h) => h.trim()).filter((h) => h != "");
    }

    async writeHints() {
        let finalContent = "";
        this.hints.forEach((h) => finalContent += h + "\n");
        await fs.promises.writeFile(this.config["file"], finalContent.trim());
    }

    displayHint() {
        this.hintIndex = this.hintIndex % this.hints.length;
        const hint = this.hints[this.hintIndex];
        
        if (this.config.prefix != "")
            this.omegga.broadcast(`${this.config.prefix} ${hint}`);
        else
            this.omegga.broadcast(hint);

        this.hintIndex += 1;
    }

    isUserAuthed(sender) {
        return this.omegga.getPlayer(sender).isHost() || this.config.authorized.some((p) => p.name === sender);
    }

    async init() {
        this.hints = [];
        await this.reloadHints();
        this.hintIndex = 0;

        this.interval = setInterval(() => this.displayHint(), this.config["display-interval"] * 1000);

        this.omegga.on("cmd:hints", async (sender, command, ...args) => {
            if (!this.isUserAuthed(sender)) return;

            if (command == "" || command == null) {
                // no command specified, show a list of hints
                this.hints.forEach((h, i) => {
                    this.omegga.whisper(sender, `<color="aaa">(#${i + 1})</> ${h}`);
                });
            } else if (command == "add") {
                this.hints.push(args.join(" "));
                await this.writeHints();
                this.omegga.whisper(sender, "Added hint, totalling " + this.hints.length + " hints.")
            } else if (command == "remove" || command == "delete") {
                const ind = parseInt(args[0]) - 1;
                if (ind >= this.hints.length || ind < 0) {
                    this.omegga.whisper(sender, "Invalid hint.");
                    return;
                }
                this.hints.splice(ind, 1);
                await this.writeHints();
                this.omegga.whisper(sender, "Removed hint, totalling " + this.hints.length + " hints.");
            } else if (command == "reload") {
                await this.reloadHints();
                this.omegga.whisper(sender, "Reloaded hints, totalling " + this.hints.length + " hints.");
            } else if (command == "edit") {
                const [index, ...contentUnjoined] = args;
                const ind = parseInt(index) - 1;
                if (ind >= this.hints.length || ind < 0) {
                    this.omegga.whisper(sender, "Invalid hint.");
                    return;
                }
                this.hints[ind] = contentUnjoined.join(" ");
                await this.writeHints();
                this.omegga.whisper(sender, "Edited hint.");
            } else {
                this.omegga.whisper(sender, `Invalid command \"${command}\".`);
            }
        });

        return {"registeredCommands": ["hints"]};
    }

    async stop() {
        clearInterval(this.interval);
    }
}

module.exports = Hints;
