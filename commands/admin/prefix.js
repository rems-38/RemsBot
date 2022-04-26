const fs = require('fs');
const config = require('../../json/config.json');
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    if(!args[0]) {
        cmd.channel.send(`Le prefix actuel est : \`${config.prefix}\`\nPour le modifier, tapez \`${config.prefix}prefix set\``);
    } else {
        if (args[2]) return cmd.reply('Trop d\'arguments');
        if (args[0] === "set") {

            if (!args[1]) return cmd.reply('Vous devez entrer un nouveau prefix !');

            config.prefix = args[1];
            fs.writeFile("./json/config.json", JSON.stringify(config), e => {if(e) console.log(e)});
            cmd.react("✅");
        
        } else return cmd.reply('Erreur lors de l\'exécution de cette commande');
    }

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}prefix exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}prefix exécuter par @${cmd.author.tag}`);
};

module.exports.help = {
    name: 'prefix',
    aliases: ['prefix'],
    category: 'admin',
    description: 'Permet d\'afficher le prefix courant et de le modifier',
    usage: 'change',
    forAdmin : true,
    args: true
};