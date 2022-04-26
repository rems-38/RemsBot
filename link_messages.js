const config = require('./json/config.json');

module.exports = (client, logger) => {
    const guild = client.guilds.cache.get(config.serverId);
    const sanction_channel = guild.channels.cache.get(config.sanction_channel_id);

    client.on('messageCreate', msg => {
        if(msg.channel.id === config.link_channel_id){
            if(!msg.author.bot) {
                if(msg.author.id !== config.ownerId) {
                    if(msg.content.startsWith('http://')) return;
                    if(msg.content.startsWith('https://')) return;

                    msg.channel.bulkDelete(1, true);
                    sanction_channel.send(`TODO : !warn ${msg.author} interdiction de parler dans ${msg.channel}\nMessage : ${msg.content}`);
                    msg.channel.send('Je repète qu\'il est interdit de parler dans ce channel mis à part pour des liens !');
                    setTimeout(function(){msg.channel.bulkDelete(1, true)}, 300000);

                    const date = new Date();
                    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Message dans #liens supprimé.\nContenu : \"${msg.content}\"\nUtilisateur : @${msg.author.tag}\n`);
                    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Message dans #liens supprimé.\nContenu : \"${msg.content}\"\nUtilisateur : @${msg.author.tag}`);
                }
            }
        }
    })

}