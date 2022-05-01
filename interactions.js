const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const config = require('./json/config.json');
var json_event = require('./json/event-potm.json');

module.exports = (client, logger) => {
    const guild = client.guilds.cache.get(config.serverId);
    const date = new Date();

    client.on('interactionCreate', interaction => {
        if(interaction.isButton()) {
            if(interaction.customId == "post_prod") {
                const potm_channel = guild.channels.cache.find(ch => ch.id == interaction.channelId);
                const member = guild.members.cache.find(mb => mb.id == interaction.user.id);

                interaction.reply(`<@${member.id}>, veuillez déposer votre prod`);
                
                const jsonDate = `${date.getMonth() + 1}-${date.getFullYear()}`;

                potm_channel.messages.fetch(json_event[jsonDate].id_main_embed).then(msg => {
                    var buttonUnderEmbed = msg.components[0];
                    buttonUnderEmbed.components[0].disabled = true;

                    msg.edit({components: [buttonUnderEmbed]})
                })

                potm_channel.permissionOverwrites.edit(member, {
                    SEND_MESSAGES: true,
                    ATTACH_FILES: true,
                });

                client.on('messageCreate', msg => {
                    if((msg.author.id == member.id) && (msg.channel.id == potm_channel.id) && msg.attachments.size != 0) {
                        if(msg.attachments.toJSON()[0].contentType.indexOf('audio') != -1) {
                            const prodUrl = msg.attachments.toJSON()[0].url;
                            const prods_channel = guild.channels.cache.find(ch => ch.id == config.prods_potm_channel_id);

                            const prodEmbed = {
                                color: '#FF0000',
                                title: 'Nouvelle prod à juger (0/2)',
                                fields: [
                                    {
                                        name: 'Beatmaker',
                                        value: `<@${member.id}>`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Juge',
                                        value: 'Pas noté pour l\'instant',
                                        inline: true,
                                    },
                                    {
                                        name: 'Note',
                                        value: 'Pas noté pour l\'instant',
                                        inline: false,
                                    },
                                    {
                                        name: 'Juge',
                                        value: 'Pas noté pour l\'instant',
                                        inline: true,
                                    },
                                    {
                                        name: 'Note',
                                        value: 'Pas noté pour l\'instant',
                                        inline: false,
                                    }
                                ]
                            };

                            const prodButton = new MessageActionRow().addComponents(
                                new MessageButton()
                                .setCustomId(`vote_${member.id}`)
                                .setLabel("Juger cette prod")
                                .setStyle("PRIMARY")
                            );

                            prods_channel.send({ embeds: [prodEmbed], components: [prodButton]}).then(msg => {
                                prods_channel.send({ files: [prodUrl] }).then(msg2 => {
                                    beatmakerInfo = {
                                        name: (member.displayName),
                                        id: (member.id),
                                        url_prod: (prodUrl),
                                        nbr_de_note: 0,
                                        notes: [],
                                        note_tot: null,
                                        rank: null,
                                        id_juge_embed: (msg.id),
                                        id_prod_msg: (msg2.id),
                                    }

                                    json_event[jsonDate].beatmakers.push(beatmakerInfo);
                                    fs.writeFileSync('./json/event-potm.json', JSON.stringify(json_event, null, 4), e => {if(e) console.log(e)});
                                });
                            });

                            potm_channel.permissionOverwrites.edit(member, {
                                SEND_MESSAGES: false,
                                ATTACH_FILES: false,
                            });

                            setTimeout(() => {
                                potm_channel.bulkDelete(1, true);
                                interaction.deleteReply();

                                potm_channel.messages.fetch(json_event[jsonDate].id_main_embed).then(msg => {
                                    var buttonUnderEmbed = msg.components[0];
                                    buttonUnderEmbed.components[0].disabled = false;
    
                                    msg.edit({components: [buttonUnderEmbed]})
                                });
                            }, 1000 * 5);
                        }
                    }
                });
            }
            else if(interaction.customId.indexOf('vote_') != -1){
                const member_id = interaction.customId.split('_')[1];
                const juge = guild.members.cache.find(mb => mb.id == interaction.user.id);
                const prods_channel = guild.channels.cache.find(ch => ch.id == config.prods_potm_channel_id);

                interaction.reply(`<@${juge.id}>, veuillez donner la note générale pour cette prod sous la forme suivante :\nNote : X/20\nCommentaire : ...`);

                const jsonDate = `${date.getMonth() + 1}-${date.getFullYear()}`;

                json_event[jsonDate].beatmakers.forEach(beatmaker => {
                    if(beatmaker.id == member_id) {
                        prods_channel.messages.fetch(beatmaker.id_juge_embed).then(msg => {
                            const prodButton = msg.components[0]
                            prodButton.components[0].disabled = true;

                            msg.edit({ components: [prodButton] });
                        });
                    }
                });

                prods_channel.permissionOverwrites.edit(juge, {
                    SEND_MESSAGES: true,
                });

                client.on('messageCreate', msg => {
                    if (msg.author.bot) return;

                    if((msg.author.id == juge.id) && (msg.channel.id == prods_channel.id)) {
                        const note = msg.content.split('Note :')[1].split('/')[0].split(" ")[1];
                        const comment = msg.content.split('Commentaire : ')[1];

                        json_event[jsonDate].beatmakers.forEach((beatmaker, i) => {
                            if(beatmaker.id == member_id && beatmaker.nbr_de_note <= 1) {
                                const noteValue = {
                                    note: (note),
                                    comment: (comment),
                                    id_juge: (juge.id),
                                }

                                beatmaker.notes.push(noteValue);
                                fs.writeFileSync('./json/event-potm.json', JSON.stringify(json_event, null, 4), e => {if(e) console.log(e)});
                            
                                prods_channel.messages.fetch(beatmaker.id_juge_embed).then(msg => {
                                    const prodEmbed = {
                                        color: beatmaker.nbr_de_note == 0 ? '#FF8C00' : '#00FF00',
                                        title: beatmaker.nbr_de_note == 0 ? `Nouvelle prod à juger (1/2)` : 'Prod jugée (2/2)',
                                        fields: [
                                            {
                                                name: 'Beatmaker',
                                                value: `<@${member_id}>`,
                                                inline: false,
                                            },
                                            {
                                                name: 'Juge',
                                                value: `<@${beatmaker.notes[0].id_juge}>`,
                                                inline: true,
                                            },
                                            {
                                                name: 'Note',
                                                value: `${beatmaker.notes[0].note}/20`,
                                                inline: true,
                                            },
                                            {
                                                name: 'Juge',
                                                value: beatmaker.nbr_de_note == 0 ? 'Pas noté pour l\'instant' : `<@${beatmaker.notes[1].id_juge}>`,
                                                inline: true,
                                            },
                                            {
                                                name: 'Note',
                                                value: beatmaker.nbr_de_note == 0 ? 'Pas noté pour l\'instant' : `${beatmaker.notes[1].note}/20`,
                                                inline: true,
                                            },
                                        ]
                                    };

                                    json_event[jsonDate].beatmakers[i].nbr_de_note++;
                                    fs.writeFileSync('./json/event-potm.json', JSON.stringify(json_event, null, 4), e => {if(e) console.log(e)});

                                    var prodButton = msg.components[0];
                                    
                                    if(beatmaker.nbr_de_note == 2) {
                                        prodButton.components[0].disabled = true;
                                        msg.edit({ embeds: [prodEmbed], components: [prodButton]});
                                        
                                        json_event[jsonDate].beatmakers[i].note_tot = (parseFloat(beatmaker.notes[0].note) + parseFloat(beatmaker.notes[1].note)) / 2;
                                        const beatmakerNote = {
                                            id: (beatmaker.id),
                                            note: (beatmaker.note_tot),
                                        };
                                        json_event[jsonDate].notes.push(beatmakerNote);

                                        fs.writeFileSync('./json/event-potm.json', JSON.stringify(json_event, null, 4), e => {if(e) console.log(e)});
                                    }
                                    else {
                                        setTimeout(() => {
                                            prodButton.components[0].disabled = false;
                                            msg.edit({ embeds: [prodEmbed], components: [prodButton]});
                                        }, 1000 * 5);
                                    }

                                    prods_channel.permissionOverwrites.edit(juge, {
                                        SEND_MESSAGES: false,
                                    });
                                
                                    setTimeout(() => {
                                        prods_channel.bulkDelete(1, true);
                                        interaction.deleteReply();
                                    }, 1000 * 5);
                                });
                            }
                        });

                    }
                });
                
            }
        };
    })

};