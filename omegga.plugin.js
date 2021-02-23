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
        await fs.promises.writeFile(this.config["file"], fileContent.trim());
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
        return this.config.authorized.some((p) => p.name === sender.name);
    }

    async init() {
        this.hints = [];
        await this.reloadHints();
        this.hintIndex = 0;

        this.interval = setInterval(() => this.displayHint(), this.config["display-interval"] * 1000);

        this.omegga.on("cmd:hints", async (sender, command, ...args) => {
            if (!isUserAuthed(sender)) return;

            if (command == "" || command == null) {
                // no command specified, show a list of hints
                this.hints.forEach((h, i) => {
                    this.omegga.whisper(sender, `<color="aaa">(#${i + 1})</> ${h}`);
                });
            } else if (command == "add") {
                this.hints.push(args.join(" "));
                await this.writeHints();
                this.omegga.whisper("Added hint, totalling " + this.hints.length + " hints.")
            } else if (command == "remove" || command == "delete") {
                this.hints.splice(parseInt(args[0]) - 1, 1);
                await this.writeHints();
                this.omegga.whisper("Removed hint, totalling " + this.hints.length + " hints.");
            } else if (command == "reload") {
                await this.reloadHints();
                this.omegga.whisper("Reloaded hints, totalling " + this.hints.length + " hints.");
            } else if (command == "edit") {
                const [index, ...contentUnjoined] = args;
                this.hints[parseInt(index) - 1] = contentUnjoined.join(" ");
                await this.writeHints();
                this.omegga.whisper("Edited hint.");
            }
        });

        return {"registeredCommands": ["hints"]};
    }

    async stop() {
        clearInterval(this.interval);
    }
}

module.exports = Hints;
