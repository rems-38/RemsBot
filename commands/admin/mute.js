const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    if(args[1]) return cmd.reply('Veuillez n\'entrez qu\'un seul pseudo à la fois');
    if(!isNaN(args[0])) return cmd.reply('N\'entrez pas de nombre');
    
    const userToMute = cmd.mentions.members.first();
    if(!userToMute) return cmd.reply('Ce pseudo n\'existe pas, veuillez réessayer');

    const roleMute = cmd.guild.roles.cache.find(role => role.name === 'Muted');
    if(!roleMute) return cmd.reply('Erreur interne');
    
    if(userToMute.roles.cache.some(role => role === roleMute)) return cmd.reply(`${userToMute} a déjà ce role !`);

    userToMute.roles.add(roleMute.id).catch(e => console.log(e.message));
    cmd.reply(`Role ${roleMute.name} bien ajouté à ${userToMute}`);

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}mute exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}mute exécuter par @${cmd.author.tag}`)
};

module.exports.help = {
    name : 'mute',
    aliases : ['mute'],
    category : 'admin',
    description : 'Empêche un membre de parler',
    usage : '<@user_to_mute>',
    forAdmin : true,
    args : true
};