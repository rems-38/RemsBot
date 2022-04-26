const Discord = require('discord.js');
const notes_recap = require('../../json/helper.json');

const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    if(!args[0].startsWith('<@')) return cmd.reply('Valeur incorrecte. Attendu : pseudo');
    if(args[1]) return cmd.reply('Un seul pseudo à la fois');

    id = args[0].replace('<', '').replace('@', '').replace('!', '').replace('&', '').replace('>', '');

    if(!notes_recap[id]) return cmd.reply('L\'utilisateur n\'a pas encore de note !');
    
    average = notes_recap[id][0].moyenne;
    note_number = Object.values(notes_recap[id][0].notes).length;

    pseudo = cmd.mentions.members.first().user.username;

    const embedAnswer = new Discord.MessageEmbed()
        .setTitle(`Info sur ${pseudo}`)
        .addField('Moyenne', average, true)
        .addField('Nombre de notes', note_number, true);

    cmd.channel.send(embedAnswer);

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}helperinfo exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}helperinfo exécuter par @${cmd.author.tag}`);
};

module.exports.help = {
    name : 'helperinfo',
    aliases : ['helperinfo'],
    category : 'divers',
    description : 'Permet d\'afficher des informations concernant un helpeur',
    usage : '@pseudo_helper',
    forAdmin : false,
    args : true
};