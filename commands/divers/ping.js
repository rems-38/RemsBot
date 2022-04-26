const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd) => {
    cmd.channel.send(`Pong !`);
    
    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}ping exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}ping exécuter par @${cmd.author.tag}`);
};

module.exports.help = {
    name: 'ping',
    aliases: ['ping'],
    category: 'divers',
    description: 'Renvoi pong !',
    usage: '',
    forAdmin : false,
    args: false
};
