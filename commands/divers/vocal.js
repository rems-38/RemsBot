const Discord = require('discord.js');

const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    if(args[0] == "create"){
        // ping les gérant des collabs pour la création des salons

        args.shift();
        var pre_array_pseudo = [];

        args.forEach(pseudo => {
            if(pseudo.startsWith('<@')){
                pre_array_pseudo.push(pseudo);
        }});

        const guild = client.guilds.cache.get(config.serverId);

        const nbr = Math.floor(Math.random() * 200);
        const channel_name = `#${nbr} - Collab`;

        var array_pseudo = []
        pre_array_pseudo.forEach(pseudo => {
            if(pseudo.indexOf("!") !== -1 || pseudo.indexOf("&") !== -1) {
                pseudo = pseudo.slice(3, -1);
            } else {
                pseudo = pseudo.slice(2, -1);
            }
            array_pseudo.push(pseudo);
        })

        if(!array_pseudo[1]) return cmd.reply('Il faut entrer 2 pseudos (séparé par un espace)');
        if(array_pseudo[2]) return cmd.reply('Seulement 2 pseudos sont accepté, pour un rajouter plus, tapez');

        guild.channels.create(channel_name, {
            type: 'voice',
            parent: config.collab_category_id,
            permissionOverwrites: [
                {
                    id: config.everyone_role_id,
                    allow: [],
                    deny: [
                        "MANAGE_CHANNELS",
                        "CREATE_INSTANT_INVITE",
                        "PRIORITY_SPEAKER",
                        "STREAM",
                        "VIEW_CHANNEL",
                        "CONNECT",
                        "SPEAK",
                        "MUTE_MEMBERS",
                        "DEAFEN_MEMBERS",
                        "MOVE_MEMBERS",
                        "USE_VAD",
                        "MANAGE_ROLES"
                    ],
                },
                {
                    id: config.member_role_id,
                    allow: [],
                    deny: [
                        "MANAGE_CHANNELS",
                        "CREATE_INSTANT_INVITE",
                        "PRIORITY_SPEAKER",
                        "STREAM",
                        "VIEW_CHANNEL",
                        "CONNECT",
                        "SPEAK",
                        "MUTE_MEMBERS",
                        "DEAFEN_MEMBERS",
                        "MOVE_MEMBERS",
                        "USE_VAD",
                        "MANAGE_ROLES"
                    ],
                },
                {
                    id: config.admins_role_id,
                    allow: [
                        "PRIORITY_SPEAKER",
                        "STREAM",
                        "VIEW_CHANNEL",
                        "CONNECT",
                        "SPEAK",
                        "MUTE_MEMBERS",
                        "DEAFEN_MEMBERS",
                        "MOVE_MEMBERS",
                        "USE_VAD"
                    ],
                    deny: [
                        "MANAGE_CHANNELS",
                        "CREATE_INSTANT_INVITE",
                        "MANAGE_ROLES"
                    ]
                },
                {
                    id: config.gerantdisc_role_id,
                    allow: [
                        "MANAGE_CHANNELS",
                        "CREATE_INSTANT_INVITE",
                        "VIEW_CHANNEL",
                        "MANAGE_ROLES"
                    ],
                    deny: [
                        "PRIORITY_SPEAKER",
                        "STREAM",
                        "CONNECT",
                        "SPEAK",
                        "MUTE_MEMBERS",
                        "DEAFEN_MEMBERS",
                        "MOVE_MEMBERS",
                        "USE_VAD"
                    ]
                },
                {
                    id: config.fonda_role_id,
                    allow: [
                        "MANAGE_CHANNELS",
                        "CREATE_INSTANT_INVITE",
                        "PRIORITY_SPEAKER",
                        "STREAM",
                        "VIEW_CHANNEL",
                        "CONNECT",
                        "SPEAK",
                        "MUTE_MEMBERS",
                        "DEAFEN_MEMBERS",
                        "MOVE_MEMBERS",
                        "USE_VAD",
                        "MANAGE_ROLES"
                    ],
                    deny: []
                },
                {
                    id: array_pseudo[0],
                    allow: [
                        "STREAM",
                        "VIEW_CHANNEL",
                        "CONNECT",
                        "SPEAK",
                        "USE_VAD"
                    ],
                    deny: [
                        "MANAGE_CHANNELS",
                        "CREATE_INSTANT_INVITE",
                        "PRIORITY_SPEAKER",
                        "MUTE_MEMBERS",
                        "DEAFEN_MEMBERS",
                        "MOVE_MEMBERS",
                        "MANAGE_ROLES"
                    ]
                },
                {
                    id: array_pseudo[1],
                    allow: [
                        "STREAM",
                        "VIEW_CHANNEL",
                        "CONNECT",
                        "SPEAK",
                        "USE_VAD"
                    ],
                    deny: [
                        "MANAGE_CHANNELS",
                        "CREATE_INSTANT_INVITE",
                        "PRIORITY_SPEAKER",
                        "MUTE_MEMBERS",
                        "DEAFEN_MEMBERS",
                        "MOVE_MEMBERS",
                        "MANAGE_ROLES"
                    ]
                }
            ]
        });

        cmd.channel.send(`Le channel \`${channel_name}\` a bien été crée`);

        // Faire un truc plus auto/opti (ex si 3 membres ---> pb !!!)
        
    } else if(args[0] == "update") {

        args.shift();
        if(!Number.isInteger(parseInt(args[0]))) return cmd.reply('Vous devez entrez le numéro de votre channel après le mot \`update\` !');
        if(!args[1].startsWith('<@')) return cmd.reply('Un pseudo est requis après le numéro du channel !');
        if(args[2]) return cmd.reply('Trop d\'arguments');

        var member_id = ""
        if(args[1].indexOf("!") !== -1 || args[1].indexOf("&") !== -1) {
            member_id = args[1].slice(3, -1);
        } else {
            member_id = args[1].slice(2, -1);
        }

        const guild = client.guilds.cache.get(config.serverId);

        const channel_name = `#${args[0]} - Collab`;
        const collab_channel = guild.channels.cache.filter(tip => tip.type === "voice").find(channel => channel.name === channel_name);

        const member = guild.members.cache.find(membre => membre.id === member_id);

        collab_channel.updateOverwrite(member, {
            STREAM: true,
            VIEW_CHANNEL : true,
            CONNECT : true,
            SPEAK : true,
            USE_VAD : true,
            MANAGE_CHANNELS : false,
            CREATE_INSTANT_INVITE : false,
            PRIORITY_SPEAKER : false,
            MUTE_MEMBERS : false,
            DEAFEN_MEMBERS : false,
            MOVE_MEMBERS : false,
            MANAGE_ROLES : false
        })

        cmd.channel.send(`Permission ajouté à @${member.user.username}#${member.user.discriminator}`);

    } else if(args[0] == "delete") {

        args.shift();
        if(!Number.isInteger(parseInt(args[0]))) return cmd.reply('Vous devez entrer le numéro du channel à supprimer');
        if(args[1]) return cmd.reply('Vous avez entré trop d\'arguments');

        const guild = client.guilds.cache.get(config.serverId);

        const channel_name = `#${args[0]} - Collab`;
        const collab_channel = guild.channels.cache.filter(tip => tip.type === "voice").find(channel => channel.name === channel_name);

        collab_channel.delete();

        cmd.channel.send(`Le channel \`${channel_name}\` à bien été supprimé !`);

    } else return cmd.reply(`Erreur dans l\'option que vous avez entré, tapez \`${config.prefix}help vocal\``)

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}vocal exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}vocal exécuter par @${cmd.author.tag}`);

}

module.exports.help = {
    name : 'vocal',
    aliases : ['vocal', 'voc', 'audio'],
    category : 'divers',
    description : 'Créer des salons vocaux pour les collabs',
    usage : 'create @pseudo1 @pseudo2\n\t\tupdate <n°> @pseudo\n\t\tdelete <n°>',
    forAdmin : false,
    args : true
}