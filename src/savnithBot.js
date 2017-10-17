/*savnithBot - stable*/

var mineflayer = require('mineflayer');
var readline = require("readline");
var navigatePlugin = require('mineflayer-navigate')(mineflayer);
var fs = require('fs')
var requireIndex = require('requireindex');
var path = require('path')

/* if you don't want to use a password aka offline mode change the 7 to 6 and delete the password part.*/
if (process.argv.length < 4 || process.argv.length > 7) {
    console.log('Usage : node savnithBot.js ip port version username password')
    process.exit(1)
}

const bot = mineflayer.createBot({
    host: process.argv[2],
    port: parseInt(process.argv[3]),
    version: process.argv[4] ? process.argv[4] : '1.12.2',
    username: process.argv[5] ? process.argv[5] : 'savnithBot',
    password: process.argv[6]
})

console.log('savnithBot version: 2.0 creator: Savnith project url: https://github.com/savnith/savnithBot')

bot.chatAddPattern(/^.* <(.*)> (.*)$/, 'tagchat', 'Tag Chat');
bot.chatAddPattern(/^\[.*\] ?([^\]:]*) : (.*)$/, "pexchat", "Pex Chat");
bot.chatAddPattern(/^\[.*?(\w*) -> me \] (.*)$/, "whisper", "Essentials Whisper");

var plugins = requireIndex('./src/plugins');
for (plugin in plugins) {
    if (plugins[plugin].inject != null) {
        plugins[plugin].inject(bot);
    } else {
        console.log(plugin, 'has no inject function.');
    }
}