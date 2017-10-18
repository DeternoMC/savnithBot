module.exports.inject = inject;

function inject(bot) {
    bot.on('death', () => {
        bot.chat('Your bot has died!')
    });
    
    bot.on('kicked', (reason) => {
        console.log(reason.toString())
    });
    
    bot.on('login', function () {
        bot.chat('Hello, I am a BOT created by Savnith v1.1.')
    });
}
