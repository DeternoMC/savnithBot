module.exports.inject = inject;
var readline = require("readline");
var navigatePlugin = require('mineflayer-navigate')(mineflayer);
var mineflayer = require('mineflayer');

function inject(bot) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.setPrompt('Command > ');
    rl.prompt();

    var follow = false
    var foloutId = undefined
    var attoutId = undefined
    navigatePlugin(bot);

    rl.on('line', function (consolecmd) {
        if (consolecmd.startsWith('say ')) {
            bot.chat(consolecmd.substring(4))
            console.log("Message sent ingame.")
        }
        if (consolecmd == 'stop') {
            bot.navigate.stop()
            bot.clearControlStates()
            if (follow === true) {
                follow = false
                clearInterval(foloutId)
                clearInterval(attoutId)
                bot.chat("Stopping task.")
            }
        }
        if (consolecmd.startsWith('follow ')) {
            follow = true
            var plnam = (consolecmd.substring(7)).trim()
            global.target = bot.players[plnam].entity;
            if (global.target != null) {
                foloutId = setInterval(followTarget, 1000);
                bot.chat("Started following " + plnam)
            } else {
                console.log("Could not find player.")
            }
        }
        if (consolecmd.startsWith('kill ')) {
            follow = true
            var plnam = (consolecmd.substring(5)).trim()
            global.target = bot.players[plnam].entity;
            if (global.target != null) {
                foloutId = setInterval(followTarget, 1000);
                attoutId = setInterval(attackTarget, 500);
                bot.chat("Attempting to kill " + plnam + "!")
            } else {
                console.log("Could not find player.")
            }
        }
        if (consolecmd.startsWith("cmd ")) {
            var cmdtoexec = (consolecmd.substring(4)).trim()
            if (cmdtoexec != null) {
                bot.chat("/" + cmdtoexec)
                console.log("Command Executed.")
            } else {
                console.log("You need to specify a command")
            }
        }
        rl.prompt();
    });

    function followTarget() {
        var path = bot.navigate.findPathSync(global.target.position, {
            timeout: 999,
            endRadius: 1,
        });
        bot.navigate.walk(path.path)
    }

    function attackTarget() {
        bot.attack(global.target)
    }
    bot.on('entityGone', function (entity) {
        if (entity === global.target) {
            console.log("Player out of range.")
            bot.navigate.stop();
        }
    });
}
