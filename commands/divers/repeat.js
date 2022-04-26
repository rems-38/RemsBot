const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    var user_message = "";
    for(let i = 0; i < args.length; i++){
        user_message += args[i] + " ";
    };
    cmd.reply(`a dit : ${user_message}`);

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}repeat exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}repeat exécuter par @${cmd.author.tag}`);
};

module.exports.help = {
    name : 'repeat',
    aliases : ['repeat', 'say'],
    category : 'divers',
    description : 'Répéter ce que l\'user a dit',
    usage : '<votre message>',
    forAdmin : false,
    args : true
};