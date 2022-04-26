const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) =>{
    if(isNaN(args[0]) || parseInt(args[0]) <= 0) return cmd.reply('Entrez seulement un nombre');

    if(args[1]) return cmd.reply('Seul un nombre doit être entrez, pas plusieurs');

    if(parseInt(args[0]) <= 100 ){
        cmd.channel.bulkDelete(parseInt(args[0]) + 1, true);
        const date = new Date();
        logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}clear exécuter par @${cmd.author.tag}\n`);
        console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}clear exécuter par @${cmd.author.tag}`);
    } else {
        cmd.reply(`Vous ne pouvez supprimer que 100 messages à la fois`)
    };
};

module.exports.help = {
    name : 'clear',
    aliases : ['clear'],
    category : 'admin',
    description : 'Supprimer des messages du tchat courant',
    usage : '<nbr_msg>',
    forAdmin : true,
    args : true
};