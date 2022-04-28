const config = require('./json/config.json');

module.exports = (client, logger) => {
    const guild = client.guilds.cahce.get(config.serverId);

    client.on('interactionCreate', interaction => {
        if(interaction.isButton()) {
            if(interaction.customId == "post_prod") {
                const potm_channel = guild.potm_channel.cache.find(ch => ch.id == interaction.channelId);
                const member = guild.members.cache.find(mb => mb.id == interaction.user.id);

                interaction.reply(`<@${member.id}>, veuillez déposer votre prod`);

                potm_channel.permissionOverwrites.edit(member, {
                    SEND_MESSAGES: true,
                    ATTACH_FILES: true,
                });

                client.on('messageCreate', msg => {
                    if((msg.author.id == member.id) && (msg.channel.id == potm_channel.id) && msg.attachments) {
                        if(msg.attachments.toJSON()[0].contentType.indexOf('audio') != -1) {
                            const prodUrl = msg.attachments.toJSON()[0].url;
                            
                            const prods_channel = guild.channels.cache.find(ch => ch.id == config.prods_potm_channel_id);
                            prods_channel.send({ content: `Voici la prod de <@${member.id}>`, files: [prodUrl] });

                            potm_channel.permissionOverwrites.edit(member, {
                                SEND_MESSAGES: false,
                                ATTACH_FILES: false,
                            });

                            beatmakerID.push(`<@${member.id}>`);
                            potm_channel.bulkDelete(1, true);
                            interaction.deleteReply();
                        }
                    }
                });
            }
        };
    })

};