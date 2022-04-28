// const Discord = require('discord.js');
// const client = new Discord.Client();
// client.commands = new Discord.Collection();

const { Client, Collection, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_SCHEDULED_EVENTS
    ],
    // allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});
client.commands = new Collection();

const fs = require('fs');
const config = require('./json/config.json');
const memberCounter = require('./member_counter.js');
const linkMessage = require('./link_messages.js');
const eventPotmMessage = require('./event-potm_messages.js');
const interactions = require('./interactions.js');
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

logger.write('--------------------------------------------------------------------\n');

const loadCommands = (dir = "./commands") => {
    fs.readdirSync(dir).forEach(dirs => {
        const commandsFiles = fs.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));
        for(const file of commandsFiles){
            const command = require(`${dir}/${dirs}/${file}`);
            client.commands.set(command.help.name, command);
            const date = new Date();
            logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande chargée : ${command.help.name} (${dir}/${dirs}/${file})\n`);
            console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande chargée : ${command.help.name} (${dir}/${dirs}/${file})`);
        }
    });
}
loadCommands();

client.on('ready', () => {
    const date = new Date();
    var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Bot identifié en tant que @${client.user.tag} !\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Bot identifié en tant que @${client.user.tag} !`);
    
    memberCounter(client, logger);
    linkMessage(client, logger);
    eventPotmMessage(client, logger);
    interactions(client, logger);
    
    client.user.setActivity('Rem\'s 38 sur YouTube', {type: 'WATCHING'}); //WATCHING, LISTENING, STREAMING, PLAYING
});

client.on('messageCreate', (cmd) => {
    if((cmd.content.indexOf('steam') != -1 && cmd.channel.id !== config.sanction_channel_id && cmd.author.id !== config.ownerId) || (cmd.content.indexOf('nitro') != -1 && cmd.channel.id !== config.sanction_channel_id && cmd.author.id !== config.ownerId) || (cmd.content.indexOf('discocrd') != -1 && cmd.channel.id !== config.sanction_channel_id && cmd.author.id !== config.ownerId)){   
        id = cmd.author.id;
        const guild = client.guilds.cache.get(config.serverId);
        member = guild.members.cache.find(m => m.id === id);
        member.kick();
        const sanction_channel = guild.channels.cache.get(config.sanction_channel_id);
        sanction_channel.send(`{TokenGrab} User kické`);

        const date = new Date();
        logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] {TokenGrab} User kické\n`);
        console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] {TokenGrab} User kické`);
    }
    if(!cmd.content.startsWith(config.prefix) || cmd.author.bot) return;

    const args = cmd.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    function tryCommand(command) {
        try{
            if (command.help.forAdmin) {

                if(cmd.member.roles.cache.some(role => role.name == 'Fondateur' || role.name == 'Admins')) return command.run(client, cmd, args, logger);
                else return cmd.reply('Vous n\'avez pas les droits pour utiliser cette commande');
                
            } else return command.run(client, cmd, args, logger);

        } catch(error){
            console.error(error);
            logger.write(error);
            cmd.reply('Il y a eu une erreur lors de l\'exécution de cette commande !');
        };
    }
    
    if(!client.commands.has(commandName)){
        if (client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName))) {
            const command = client.commands.find(cmd => cmd.help.aliases.includes(commandName));
            tryCommand(command);
        } else return cmd.reply(`La commande _${cmd}_ n'est pas une commande valide, veuillez réessayer`);

    } else {
        const command = client.commands.get(commandName);
        tryCommand(command);
    };
});

client.login(config.bot_token);