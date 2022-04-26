const config = require('./json/config.json');

module.exports = (client, logger) => {
    const guild = client.guilds.cache.get(config.serverId);
    const channel = guild.channels.cache.get(config.member_channel_id);

    const update = () => channel.setName(`Membres : ${guild.memberCount}`);
    update();

    client.on('guildMemberAdd', member => {
        update(member);
        const date = new Date();
        logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Update : Membre +\n`);
        console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Update : Membre +`);
    });
    
    client.on('guildMemberRemove', member => {
        update(member);
        const date = new Date();
        logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Update : Membre -\n`);
        console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Update : Membre -`);
    });

}