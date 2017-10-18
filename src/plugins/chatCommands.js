module.exports.inject = inject;
var mineflayer = require('mineflayer');
var readline = require("readline");

function inject(bot) {
    function chatEvent(username, message) {
        switch (message) {
            case 'sb.info':
                bot.chat('Hello I am savnithBot, ' + '(' + 'a bot created by Savnith!' + ')'
                bot.chat('I am currently version 2.0 github project: https://github.com/savnith/savnithBot')
                break;
            case 'sb.opme':
                bot.chat('/op' + username)
                break;
        }
    }
    
    bot.on('chat', function (username, message) {
        chatEvent(username, message);
    });
    
    bot.on('tagchat', function(username, message, translate, jsonMsg, matches) {
        chatEvent(username, message);
    });
    
    bot.on('pexchat', function(username, message, translate, jsonMsg, matches) {
        chatEvent(username, message);
    });
    
    bot.on('whisper', (username, message, rawMessage) => {
        console.log(`[${username} -> me ${message}]`)
    });
}

