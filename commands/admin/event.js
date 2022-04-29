const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../json/config.json');
const fs = require('fs');
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'})
var json_event = require('../../json/event-potm.json');

// const inbox = require('inbox');

// var client = inbox.createConnection(false, 'imap.gmail.com', {
//     secureConnection : true,
//     auth : {
//         user: config.beatbattle_mail,
//         pass: config.beatbattle_passwd
//     }
// });

// client.connect();

// https://github.com/ress/inbox

// console.log(client._checkForNewMail);
// console.log(client._checkNewMail);

// client.on("connect", () => {
//     console.log("Connecté à Gmail");

//     while(client._checkForNewMail == false) {
//         console.log("Waiting for new mail...");
//     };
//     console.log("New mail found!");
// });

// client.on("new", (message) => {
//     console.log("Nouveau Mail !");
//     console.log(message);
// });

const second = 5;

module.exports.run = (client, cmd, args) => {
    // if(args[2]) return cmd.reply('Deux arguments max : le nom de l\'event et l\'ation à effectuer');

    const date = new Date();
    const guild = client.guilds.cache.get(config.serverId);

    // Event Prod Of The Month
    if(args[0] == 'potm') {
        const channel = guild.channels.cache.find(ch => ch.id === config.event_potm_channel_id);
        const member_role = guild.roles.cache.find(rl => rl.id === config.member_role_id);
        const juge_role = guild.roles.cache.find(rl => rl.id === config.juge_role_id);

        if(args[1] == 'start'){
            // channel.updateOverwrite(member_role, {
            //     VIEW_CHANNEL: true,
            // });

            // Gestion du temps
            if(!args[2]) return cmd.reply('Veuillez préciser le temps de l\'event');

            if(args[2].indexOf('s') != -1) {
                timeLeft = [0, 0, 0, args[2].split('s')[0]];
            }
            else if(args[2].indexOf('m') != -1) {
                timeLeft = [0, 0, args[2].split('m')[0], 0];
            }
            else if(args[2].indexOf('h') != -1) {
                timeLeft = [0, args[2].split('h')[0], 0, 0];
            }
            else if(args[2].indexOf('d') != -1) {
                timeLeft = [args[2].split('d')[0], 0, 0, 0];
            }
            else timeLeft = [0, 0, 0, 0];
            
            // Creation du JSON
            const jsonDate = `${date.getMonth() + 1}-${date.getFullYear()}`;
            let corps = {
                winner: null,
                beatmakers: [
                    // {
                    //     name: null,
                    //     id: null,
                    //     url_prod: null,
                    //     note: null,
                    //     comment: null,
                    //     id_juge: null,
                    //     rank: null,
                    //     id_juge_embed: null,
                    //     id_prod_msg: null,
                    // }
                ],
                notes: [
                    // {
                    //     id: null,
                    //     note: null,
                    // }
                ], 
                id_main_embed : null,
            };
            json_event[jsonDate] = corps;
            fs.writeFileSync("./json/event-potm.json", JSON.stringify(json_event, null, 4), e => {if(e) console.log(e)});

            const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];;

            var beatmakerID = [];
            
            const PotMEmbed = {
                color: "#FFFFFF",
                title: 'Event Prod Of The Month',
                description: `Et c'est parti, on lance notre event mensuel Prod Of The Month pour ce mois de ${months[date.getMonth()]}!\nToutes les infos sont sur le flyer présent ci-dessous.\nLe fonctionnement `,
                // image: {
                //     url: cmd.attachments.first().url,
                // },
                fields: [
                    {
                        name: 'Récompense :',
                        value: `Le grade ${guild.roles.cache.find(r => r.id == config['1stbeatmaker_role_id'])} (ce grade sera conservé pendant 1 mois par le vainqueur)`,
                    },
                    {
                        name: 'Temps restant :',
                        value: `${timeLeft[0]}d ${timeLeft[1]}h ${timeLeft[2]}m ${timeLeft[3]}s`,
                    },
                    {
                        name:  'Participants (0) :',
                        value: 'Aucun participant à afficher',
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Bonne chance à tous !',
                },
            };

            const buttonUnderEmbed = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId('post_prod')
                .setLabel('Déposer ma prod')
                .setStyle('PRIMARY')
            );

            channel.send({ embeds: [PotMEmbed], components: [buttonUnderEmbed] }).then(msg => {
                json_event[jsonDate].id_main_embed = msg.id;
                fs.writeFileSync("./json/event-potm.json", JSON.stringify(json_event, null, 4), e => {if(e) console.log(e)});
                
                interval = setInterval(() => {
                    if(timeLeft[3] > 0) {
                        timeLeft[3] -= second;
                    }
                    else if(timeLeft[3] == 0) {
                        if(timeLeft[2] > 0) {
                            timeLeft[2] -= 1;
                            timeLeft[3] = 60 - second;
                        }
                        else if(timeLeft[2] == 0) {
                            if(timeLeft[1] > 0) {
                                timeLeft[1] -= 1;
                                timeLeft[2] = 59;
                                timeLeft[3] = 60 - second;
                            }
                            else if(timeLeft[1] == 0) {
                                if(timeLeft[0] > 0) {
                                    timeLeft[0] -= 1;
                                    timeLeft[1] = 23;
                                    timeLeft[2] = 59;
                                    timeLeft[3] = 60 - second;
                                }
                                else if(timeLeft[0] == 0) {
                                    clearInterval(interval);
                                    
                                    PotMEmbed.title = 'Event Prod Of The Month (terminé)';
                                    buttonUnderEmbed.components[0].disabled = true;
                                }
                            }
                        }
                    }

                    var len = 0;
                    json_event[jsonDate].beatmakers.forEach(beatmaker => {
                        beatmakerID.push(`<@${beatmaker.id}>`);
                        len += 1;
                    })

                    PotMEmbed.fields[1].value = `${timeLeft[0]}d ${timeLeft[1]}h ${timeLeft[2]}m ${timeLeft[3]}s`;
                    PotMEmbed.fields[2].name = `Participants (${len}) :`;
                    if(len == 0) PotMEmbed.fields[2].value = 'Aucun participant à afficher'
                    else {
                        // Dégeulasse mais sinon le PotMEmbed.fields[2].value = beatmakerID.join(' '); faisait un append
                        beatmakerID.forEach(beatmaker => {
                            if(PotMEmbed.fields[2].value == 'Aucun participant à afficher' && PotMEmbed.fields[2].value.indexOf(beatmaker) == -1) {
                                PotMEmbed.fields[2].value = beatmaker;
                            }
                            else if(PotMEmbed.fields[2].value != 'Aucun participant à afficher' && PotMEmbed.fields[2].value.indexOf(beatmaker) == -1) {
                                PotMEmbed.fields[2].value += beatmaker
                            }
                        });
                    };

                    msg.edit({ embeds: [PotMEmbed], components: [buttonUnderEmbed] });
                }, 1000 * second);
            });

            // logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : Start par @${cmd.author.tag}\n`);
            // console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : Start par @${cmd.author.tag}`);

        }

        else if(args[1] == 'reload') {
            const jsonDate = `${date.getMonth() + 1}-${date.getFullYear()}`;

            channel.messages.fetch(json_event[jsonDate].id_main_embed).then(msg => {
                var PotMEmbed = msg.embeds[0];
                var button = msg.components[0];

                const time = PotMEmbed.fields[1].value;
                const timeLeft = [time.split('d')[0], time.split('d ')[1].split('h')[0], time.split('h ')[1].split('m')[0], time.split('m ')[1].split('s')[0]];

                button.components[0].disabled = false;
                PotMEmbed.title = 'Event Prod Of The Month';
                
                interval = setInterval(() => {
                    if(timeLeft[3] > 0) {
                        timeLeft[3] -= second;
                    }
                    else if(timeLeft[3] == 0) {
                        if(timeLeft[2] > 0) {
                            timeLeft[2] -= 1;
                            timeLeft[3] = 60 - second;
                        }
                        else if(timeLeft[2] == 0) {
                            if(timeLeft[1] > 0) {
                                timeLeft[1] -= 1;
                                timeLeft[2] = 59;
                                timeLeft[3] = 60 - second;
                            }
                            else if(timeLeft[1] == 0) {
                                if(timeLeft[0] > 0) {
                                    timeLeft[0] -= 1;
                                    timeLeft[1] = 23;
                                    timeLeft[2] = 59;
                                    timeLeft[3] = 60 - second;
                                }
                                else if(timeLeft[0] == 0) {
                                    clearInterval(interval);

                                    PotMEmbed.title = 'Event Prod Of The Month (terminé)';
                                    button.components[0].disabled = true;
                                }
                            }
                        }
                    }

                    var len = 0;
                    json_event[jsonDate].beatmakers.forEach(beatmaker => {
                        beatmakerID.push(`<@${beatmaker.id}>`);
                        len += 1;
                    })

                    PotMEmbed.fields[1].value = `${timeLeft[0]}d ${timeLeft[1]}h ${timeLeft[2]}m ${timeLeft[3]}s`;
                    PotMEmbed.fields[2].name = `Participants (${len}) :`;
                    if(len == 0) PotMEmbed.fields[2].value = 'Aucun participant à afficher'
                    else {
                        // Dégeulasse mais sinon le PotMEmbed.fields[2].value = beatmakerID.join(' '); faisait un append
                        beatmakerID.forEach(beatmaker => {
                            if(PotMEmbed.fields[2].value == 'Aucun participant à afficher' && PotMEmbed.fields[2].value.indexOf(beatmaker) == -1) {
                                PotMEmbed.fields[2].value = beatmaker;
                            }
                            else if(PotMEmbed.fields[2].value != 'Aucun participant à afficher' && PotMEmbed.fields[2].value.indexOf(beatmaker) == -1) {
                                PotMEmbed.fields[2].value += beatmaker
                            }
                        });
                    };

                    msg.edit({ embeds: [PotMEmbed], components: [button]});
                }, 1000 * second);
            });
        }

        else if(args[1] == 'settime') {
            if(!args[2]) cmd.reply('Veuillez préciser le temps à remettre');

            const jsonDate = `${date.getMonth() + 1}-${date.getFullYear()}`;

            channel.messages.fetch(json_event[jsonDate].id_main_embed).then(msg => {
                var PotMEmbed = msg.embeds[0];

                const timeLeft = [args[2].split('d')[0], args[2].split('d')[1].split('h')[0], args[2].split('h')[1].split('m')[0], args[2].split('m')[1].split('s')[0]];
                PotMEmbed.fields[1].value = `${timeLeft[0]}d ${timeLeft[1]}h ${timeLeft[2]}m ${timeLeft[3]}s`;

                msg.edit({ embeds: [PotMEmbed] });
            });
        }

        else if(args[1] == 'stop') {
            const jsonDate = `${date.getMonth() + 1}-${date.getFullYear()}`;

            channel.messages.fetch(json_event[jsonDate].id_main_embed).then(msg => {
                var PotMEmbed = msg.embeds[0];
                var button = msg.components[0];

                PotMEmbed.title = 'Event Prod Of The Month (terminé)';
                PotMEmbed.fields[1].value = '0d 0h 0m 0s';
                button.components[0].disabled = true;

                msg.edit({ embeds: [PotMEmbed], components: [button] });
            });
        }

        else if(args[1] == 'scoreboard') {
            // faire tous les calculs de rank pour rapport à json_event[jsonDate].notes
            // remplir json_event[jsonDate].winner

            const scoreEmbed = {
                color: '#FFFFFF',
                title: 'Scoreboard Prod Of The Month',
                description: 'Voici les résultats de l\'event qui vient de se terminer !\nVous avez ici un petit apercu des 5 premiers mais pour si vous n\'êtes pas dans la tête de liste ou que vous souhaitez voir également vos commentaires, je vous invite à cliquer sur le bouton ci-dessous qui vous redirigera vers une page internet qui contient vos résultats (il suffit juste de s\'identifier avec votre compte Discord pour accéder à vos résultats)'
            }

            const linkButton = new MessageActionRow().addComponents(
                new MessageButton()
                .setStyle('LINK')
            )
        }

        else cmd.reply('Action inattendue, veuillez réessayer et si le problème persiste, contacter un administrateur');

    } 

    // Event BeatBattle
    else if(args[0] == "bb") {
        const channel = guild.channels.cache.find(ch => ch.id === config.beatbattle_channel_id);
        const member_role = guild.roles.cache.find(rl => rl.id === config.member_role_id);

        if(args[1] == 'start'){
            // channel.updateOverwrite(member_role, {
            //     VIEW_CHANNEL: true
            // });

            // Gestion du temps
            if(!args[2]) return cmd.reply('Veuillez préciser le temps de l\'event');
            
            if(args[2].indexOf('s') != -1) {
                timeLeft = [0, 0, 0, args[2].split('s')[0]];
            }
            else if(args[2].indexOf('m') != -1) {
                timeLeft = [0, 0, args[2].split('m')[0], 0];
            }
            else if(args[2].indexOf('h') != -1) {
                timeLeft = [0, args[2].split('h')[0], 0, 0];
            }
            else if(args[2].indexOf('d') != -1) {
                timeLeft = [args[2].split('d')[0], 0, 0, 0];
            }
            else timeLeft = [0, 0, 0, 0];

            // TODO : à chaque fois qu'on reçoit un mail, on prend le nom du beatmaker, on trouve son ID et on modifie l'embedMessage

            var beatmakerName = [];
            var beatmakerID = [];

            // beatmakerName.forEach(beatmaker => {
            //     beatmakerID.push(guild.members.cache.find(user => user.displayName == beatmaker))
            // })

            const BeatBattleEmbed = {
                color: "#66db7c",
                title: 'Event BeatBattle',
                description: 'Et c\'est reparti pour un nouveau BeatBattle !\nComme d\'hab toutes les infos sont disponibles sur le flyer ci-dessous.\nCe salon est bien évidemment fait pour vous tenir au courant de l\'avancé de l\'évènement grâce à ce message avec le temps restant, les personnes ayant participées etc...\nVous devez donc envoyer votre prod par email à [cette adresse](mailto:beatbattlerems@gmail.com) (beatbattlerems@gmail.com) sous forme d\'un fichier (pas de lien ou autre).\nEt il nous faut aussi impérativement votre pseudo Discord, sans votre hashtag (il faut absolument que cela soit présent sous cette forme : <<.VotreNomDiscord.>> (c\'est important pour le bot) et il faut faire attention à ne pas avoir de caractères peu commum dans le pseudo)\nVeillez à vous rendre disponible pour pas qu\'on vous court après si vous avez gagné !\nJ\'oublie pas mon petit disclaimer : quand vous nous envoyer votre prod, vous acceptez que l\'on puisse l\'utiliser librement.',
                // image: {
                //     url: cmd.attachments.first().url,
                // },
                fields: [
                    {
                        name: 'Temps restant :',
                        value: `${timeLeft[0]}d ${timeLeft[1]}h ${timeLeft[2]}m ${timeLeft[3]}s`,
                    },
                    {
                        name: 'Participants (0) :',
                        value: 'Aucun participant à afficher',
                        // value:  `${beatmakerID.join(', ')}`,
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Bonne chance à tous !',
                },
            };

            channel.send({ embeds: [BeatBattleEmbed] }).then(msg => {
                interval = setInterval(() => {
                    if(timeLeft[3] > 0) {
                        timeLeft[3] -= second;
                    }
                    else if(timeLeft[3] == 0) {
                        if(timeLeft[2] > 0) {
                            timeLeft[2] -= 1;
                            timeLeft[3] = 60 - second;
                        }
                        else if(timeLeft[2] == 0) {
                            if(timeLeft[1] > 0) {
                                timeLeft[1] -= 1;
                                timeLeft[2] = 59;
                                timeLeft[3] = 60 - second;
                            }
                            else if(timeLeft[1] == 0) {
                                if(timeLeft[0] > 0) {
                                    timeLeft[0] -= 1;
                                    timeLeft[1] = 23;
                                    timeLeft[2] = 59;
                                    timeLeft[3] = 60 - second;
                                }
                                else if(timeLeft[0] == 0) {
                                    channel.send('Le temps est écoulé !');
                                    clearInterval(interval);
                                }
                            }
                        }
                    }

                    len = 0;
                    beatmakerName.forEach(beatmaker => {len += 1});

                    BeatBattleEmbed.fields[0].value = `${timeLeft[0]}d ${timeLeft[1]}h ${timeLeft[2]}m ${timeLeft[3]}s`;
                    BeatBattleEmbed.fields[1].name = `Participants (${len}) :`;

                    msg.edit({ embeds: [BeatBattleEmbed] });
                }, 1000 * second);
            });

        }

    } 

    // Event RapConcept
    else if(args[0] == "rc") {
        const channel = guild.channels.cache.find(ch => ch.id === config.rapconcept_channel_id);
        const member_role = guild.roles.cache.find(rl => rl.id === config.member_role_id);

    }

    else cmd.reply('Event inconnu, veuillez contacter un administrateur pour l\'ajouter');

    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}event exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}event exécuter par @${cmd.author.tag}`);
};

module.exports.help = {
    name : 'event',
    aliases : ['event'],
    category : 'admin',
    description : 'Permet de démarrer/gérer/stopper les events',
    usage : '<event_name> <action>',
    forAdmin : true,
    args : true
};