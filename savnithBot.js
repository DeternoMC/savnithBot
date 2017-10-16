/*savnithBot - stable*/

var mineflayer = require('mineflayer');
var readline = require("readline");
var navigatePlugin = require('mineflayer-navigate')(mineflayer);
var fs = require('fs')

/* if you don't want to use a password aka offline mode change the 7 to 6 and delete the password part.*/
if (process.argv.length < 4 || process.argv.length > 6) {
    console.log('Usage : node savnithBot.js ip port version username password')
    process.exit(1)
}

const bot = mineflayer.createBot({
    host: process.argv[2],
    port: parseInt(process.argv[3]),
    version: process.argv[4],
    username: process.argv[5] ? process.argv[5] : 'savnithBot'
})

console.log('SavnithBot version: 1.0 created by: Savnith Github Repo: https://github.com/savnith/savnithBot.git')

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.setPrompt('Command > ');
rl.prompt();

var p = "sb.";
var follow = false
var foloutId = undefined
var attoutId = undefined
navigatePlugin(bot);

function chatEvent(username, message) {
    if (message == (p + 'info')) {
        bot.chat('Hello I am savnithBot, version 1.0. I have a few commands a few chat cmds are, sb.8ball and also sb.opme!')
    }
    if (message.startsWith(p + '8ball')) {
        var answers = [
            'Yes', 'No', 'Most likely.', 'Maybe', 'There is a good chance.', 'Most likely not'
        ];
        var answer = answers[Math.floor(Math.random() * answers.length)];
        bot.chat(answer);
    }
    if (message == (p + 'opme')) {
        bot.chat('/op ' + username)
    }
}

bot.on('chat', function (username, message) {
    chatEvent(username, message);
});


rl.on('line', function (consolecmd) {
    if (consolecmd.startsWith('say ')) {
        bot.chat(consolecmd.substring(4))
        console.log("Message sent ingame.")
    }
    if (consolecmd == 'stop'){
       bot.navigate.stop()
       bot.clearControlStates()
    if (follow === true) {
      follow = false
      clearInterval(foloutId)
      clearInterval(attoutId)
      bot.chat("Stopping task.")
    }
  }
  if (consolecmd.startsWith('follow ')){
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
  if (consolecmd.startsWith('kill ')){
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
      bot.chat("/"+cmdtoexec)
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
bot.on('entityGone', function(entity) {
    if (entity === global.target) {
      console.log("Player out of range.")
      bot.navigate.stop();
    }
});

bot.on('whisper', (username, message, rawMessage) => {
  console.log(`I received a message from ${username}: ${message}`)
})

bot.on('death', () => {
  bot.chat('im dead :P')
})

bot.on('kicked', (reason) => {
  console.log(`You cannot join because of: ${reason}`)
})

bot.on('login', function () {
    bot.chat('Hello, I am a BOT created by Savnith.')
});
