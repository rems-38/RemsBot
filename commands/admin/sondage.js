const Discord = require('discord.js');

const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    // supprimer la commande
    cmd.channel.bulkDelete(1, true);

    // listes des 10 nombres en emoji
    const emojiList = [
        '\u0031\u20E3',
        '\u0032\u20E3',
        '\u0033\u20E3',
        '\u0034\u20E3',
        '\u0035\u20E3',
        '\u0036\u20E3',
        '\u0037\u20E3',
        '\u0038\u20E3',
        '\u0039\u20E3',
        '\uD83D\uDD1F'
    ];
    
    // on va mettre tous les arguments dans une seul var de txt
    arg_txt = "";
    args.forEach(arg => {
        arg_txt += `${arg} `;
    });

    // on sépare cette var là où il y a des " (bien y penser dans la commande)
    arg_txt = arg_txt.split('"');

    // dans la liste on supprime tous les vides
    let i = 0
    arg_txt.forEach(arg => {
        if(arg == ' ' || arg == ''){
            arg_txt.splice(i, 1);
        }
        i++
    })

    // on va séparer le premier élement de la liste car c'est le titre du sondage
    titre = arg_txt[0];
    // et on va mettre le reste en tant qu'options
    pre_options = arg_txt.splice(0, 1);
    options = arg_txt;

    if(options.lenght < 2) return;

    // on prépare la description de l'embed
    let text = 'Pour répondre, veuillez réagir avec l\'émoji correspondant.\n\n';
    let j = 0
    var emojiListF = []; 
    // pour chacune des options on va voir à quel emoji ça correspond et on va l'ajouter à la
    // variable de texte et on va mettre les emojis utilisés dans une autre list (pour les reacts)
    for (const option of options) {
        const emoji = emojiList.splice(0, 1);
        emojiListF[j] = emoji[0];
        text += `${emoji} : \`${option}\`\n\n`;
        j++;
    }

    // on crée l'embed
    const sondageEmbed = new Discord.MessageEmbed()
        .setTitle(titre)
        .setDescription(text)
        .setFooter(`Sondage créer par @${cmd.author.tag}`);

    // on envoi l'embed et après on réagis avec les émojis dans la nouvelle list
    cmd.channel.send(sondageEmbed).then(msg => {
        emojiListF.forEach(emojii => msg.react(emojii));
    })

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}sondage exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}sondage exécuter par @${cmd.author.tag}`)
};

module.exports.help = {
    name : 'sondage',
    aliases : ['sondage'],
    category : 'admin',
    description : 'Créer des sondages avec des réactions (10 maximum)',
    usage : '\"<question>\" \"<answer>\" \"<answer>\" \"<answer>\" ...',
    forAdmin : true,
    args : true
};
