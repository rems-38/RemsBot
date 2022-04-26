const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    if(args[1]) return cmd.reply('Veuillez n\'entrez qu\'un seul pseudo à la fois');
    if(!isNaN(args[0])) return cmd.reply('N\'entrez pas de nombre');
    
    const userToUnmute = cmd.mentions.members.first();
    if(!userToUnmute) return cmd.reply('Ce pseudo n\'existe pas, veuillez réessayer');

    const roleMute = cmd.guild.roles.cache.find(role => role.name === 'Muted');
    if(!roleMute) return cmd.reply('Erreur interne');
    
    if(!userToUnmute.roles.cache.some(role => role === roleMute)) return cmd.reply(`${userToUnmute} n'est pas mute !`);
    
    userToUnmute.roles.remove(roleMute.id).catch(e => console.log(e.message));
    cmd.reply(`Role ${roleMute.name} enlevé à ${userToUnmute}`);

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}unmute exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}unmute exécuter par @${cmd.author.tag}`)
};

module.exports.help = {
    name : 'unmute',
    aliases : ['unmute'],
    category : 'admin',
    description : 'Redonne la possibilité à un membre de parler',
    usage : '<@user_to_unmute>',
    forAdmin : true,
    args : true
};