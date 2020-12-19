# omegga-hints

This is an Omegga plugin that adds interval-based hints to your server.
You can configure a list of messages to be sent on an interval.

## Installation

`cd plugins`

`git clone git://github.com/voximity/omegga-hints.git`

To set up a list of hints to be used, first choose what you would like to name your file of hints.
By default, the plugin is configured to use the file `hints.txt` created in the plugin folder.

Create the file `hints.txt` in the plugin folder, or place it somewhere else. You will have to change
the file field in the config if you choose to do this.

To add hints to the text file, just use a line for every hint:

```
You're reading a hint right now!
This is another hint.
And maybe another one right here.
That's all for my hints. Now back to the first one!
```
