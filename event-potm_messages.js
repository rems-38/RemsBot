const config = require('./json/config.json');
const fs = require('fs');
const json_event = require('./json/event-potm.json');

module.exports = (client, logger) => {
    const guild = client.guilds.cache.get(config.serverId);

    client.on('messageCreate', msg => {
        if(msg.channel.id === config.event_potm_channel_id) {
            if(!msg.author.bot){
                if(msg.author.id !== config.ownerId) {
                    if(!msg.member.roles.cache.some(role => role.id === config.juge_role_id)) {
                        if(msg.content === ''){
                            if(msg.attachments) {
                                if(!json_event[msg.author.id]) {
                                    json_event[msg.author.id] = [{
                                        nbr_prod : 1
                                    }]
                                }
                                else if(json_event[msg.author.id]) {
                                    if(json_event[msg.author.id][0].nbr_prod === 1) {
                                        json_event[msg.author.id][0].nbr_prod = 2;
                                    }
                                    else if(json_event[msg.author.id][0].nbr_prod === 2) {
                                        msg.channel.bulkDelete(1, true);
                                        msg.reply('Vous avez déjà envoyé vos 2 prods !');
                                        setTimeout(function(){msg.channel.bulkDelete(1, true)}, 5000)
                                    }
                                }

                                fs.writeFile('./json/event-potm.json', JSON.stringify(json_event, null, 4), e => {if(e) console.log(e)});

                                const date = new Date();
                                logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : @${msg.author.tag} a envoyé une prod\n`);
                                console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : @${msg.author.tag} a envoyé une prod`);

                            } else msg.channel.bulkDelete(1, true);

                        } else msg.channel.bulkDelete(1, true);

                    }

                }

            }

        }
    })
}

