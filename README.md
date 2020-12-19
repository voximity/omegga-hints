# omegga-hints

This is an Omegga plugin that adds interval-based hints to your server.
You can configure a list of messages to be sent on an interval.

## Installation

`cd plugins`

`git clone git://github.com/voximity/omegga-hints.git`

To set up a list of hints to be used, first choose what you would like to name your file of hints.
By default, the plugin is configured to use the file `hints.json` created in the plugin folder.

Create the file `hints.json` in the plugin folder, or place it somewhere else. You will have to change
the file field in the config, though.

To add hints to the json file, follow the following format:

```json
[
    "This is a hint",
    "This is another hint.",
    "As you can see",
    "They are all surrounded by quotes",
    "And separated by commas.",
    "Everything must be within those square brackets.",
    "Feel free to copy this into your hints.json file.",
    "The last hint in the list does not need to have a comma, though"
]
```