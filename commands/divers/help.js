const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const cmdDirectory = fs.readdirSync('./commands');

const config = require('../../json/config.json');
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    if (!args[0]) {
        embed = new MessageEmbed()
        .setColor('#36393F')
        .addField('Liste des commandes', `Une liste de toutes les catégories disponibles et leurs commandes.\nPour plus d\'infos sur une commande en particulier, tapez \`${config.prefix}help <command_name>\`.`)
        
        for (category of cmdDirectory) {
            embed.addField(
                `${category}`,
                `- ${client.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => cmd.help.name).join('\n- ')}`
            );
        }

        cmd.channel.send({ embeds: [embed] });
    } else {
        if (args[1]) return cmd.reply('Une seule commande à la fois');

        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0]));
        
        embed = new MessageEmbed()
        .setColor('#36393F')
        .setTitle(`\`${command.help.name}\``)
        .addField('Description', `${command.help.description}`)
        .addField('Usage', command.help.usage ? `\`${config.prefix}${command.help.name} ${command.help.usage}\`` : `\`${config.prefix}${command.help.name}\``);

        if (command.help.aliases.length > 1) embed.addField('Alias', `${command.help.aliases.join(', ')}`);

        cmd.channel.send({ embeds: [embed] });
    }

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}help exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}help exécuter par @${cmd.author.tag}`);
};

module.exports.help = {
    name : 'help',
    aliases : ['help'],
    category : 'divers',
    description : 'Affiche les commandes d\'help',
    usage : '<command_name>',
    forAdmin : false,
    args : true
};