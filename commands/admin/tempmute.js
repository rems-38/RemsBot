const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) =>{
    if(args[2]) return cmd.reply('Veuillez entrez seulement un pseudo et un temps');
    if(!isNaN(args[0])) return cmd.reply('Entrez un pseudo en premier');

    const userToMute = cmd.mentions.users.first();
    if(!userToMute) return cmd.reply('Ce pseudo n\'existe pas, veuillez réessayer');

    const roleMute = cmd.guild.roles.cache.find(role => role.name === 'Muted');
    if(!roleMute) return cmd.reply('Erreur interne');
    
    if(userToMute.guild.roles.cache.some(role => role === roleMute)) return cmd.reply(`${userToMute} a déjà ce role !`);
    // if(userToMute.id.roles.cache.some(role => role === roleMute)) return cmd.reply(`${userToMute} a déjà ce role !`);
    
    let tps = 0
    var reply = "";
    if(args[1].indexOf('s') < -1){
        arg = args[1].split('s');
        reply = "secondes";
        tps = arg[0] * 60000; // pour des secondes en ms
    }else if(args[1].indexOf('m') < -1){
        arg = args[1].split('m');
        reply = "minutes";
        tps = arg[0] * 60000; // pour des minutes en ms
    } else if(args[1].indexOf('h') < -1){
        arg = args[1].split('h');
        reply = "heures";
        tps = arg[0] * 3600000; // pour des heures en ms
    } else if(args[1].indexOf('d') < -1){
        arg = args[1].split('d');
        reply = "jours";
        tps = arg[0] * 86400000; // pour des jours en ms 
    } else if(args[1].indexOf('M') < -1){
        arg = args[1].split('M');
        reply = "mois";
        tps = arg[0] * 2629800000; // pour des mois en ms
    } else return cmd.reply('Temps du mute incorrect, entrez "5s" pour 5 secondes, "5m" pour 5 minutes, "5h" pour 5 heures, "5d" pour 5 jours, "5M" pour 5 mois.');

    if(tps === 0) return cmd.reply('Erreur interne');
    if(reply === "") return cmd.reply('Erreur interne');

    userToMute.roles.add(roleMute.id).catch(e => console.log(e.message));
    cmd.reply(`Role ${roleMute.name} bien ajouté à ${userToMute} pour ${arg[0]} ${reply}`);

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}tempmute exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}tempmute exécuter par @${cmd.author.tag}`);

    setTimeout(() => {
        userToMute.roles.remove(roleMute.id, 'Le tempmute vous a été enlevé').catch(e => console.log(e.message));
    }, tps);

    const date2 = new Date();
    logger.write(`[${date2.toLocaleDateString()} ${date2.toTimeString().split(' ')[0]}] Tempmute enlevé à @${cmd.author.tag}\n`);
    console.log(`[${date2.toLocaleDateString()} ${date2.toTimeString().split(' ')[0]}] Tempmute enlevé à @${userToMute.tag}`);
};

module.exports.help = {
    name : 'tempmute',
    aliases : ['tempmute'],
    category : 'admin',
    description : 'Empêche un membre de parler pendant un temps donné',
    usage : '<@user_to_mute> <time>',
    forAdmin : true,
    args : true
};