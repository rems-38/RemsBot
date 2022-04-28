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
                    //     id_juge: null,
                    //     comment: null,
                    //     rank: null
                    // }
                ]
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
                .setStyle('PRIMARY'),
            );

            channel.send({ embeds: [PotMEmbed], components: [buttonUnderEmbed] }).then(msg => {
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

                    var len = 0;
                    beatmakerID.forEach(beatmaker => {len += 1});

                    PotMEmbed.fields[1].value = `${timeLeft[0]}d ${timeLeft[1]}h ${timeLeft[2]}m ${timeLeft[3]}s`;
                    PotMEmbed.fields[2].name = `Participants (${len}) :`;
                    if(len == 0) PotMEmbed.fields[2].value = 'Aucun participant à afficher'
                    else PotMEmbed.fields[2].value = beatmakerID.join(' ');

                    msg.edit({ embeds: [PotMEmbed] });
                }, 1000 * second);
            });

            // logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : Start par @${cmd.author.tag}\n`);
            // console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : Start par @${cmd.author.tag}`);

        }
        // else if(args[1] == "next") {
        //     channel.updateOverwrite(member_role, {
        //         VIEW_CHANNEL: false
        //     });
        //     channel.updateOverwrite(juge_role, {
        //         VIEW_CHANNEL: true
        //     });

        //     cmd.reply('Event PotM go to next part !')
        //     logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : Next par @${cmd.author.tag}\n`);
        //     console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : Next par @${cmd.author.tag}`);
        // }
        // else if(args[1] == "stop"){
        //     channel.updateOverwrite(member_role, {
        //         VIEW_CHANNEL: false
        //     });
        //     channel.updateOverwrite(juge_role, {
        //         VIEW_CHANNEL: false
        //     });

        //     cmd.reply('Event PotM stopped !')
        //     logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : Stop par @${cmd.author.tag}\n`);
        //     console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Event PotM : Stop par @${cmd.author.tag}`);

        // }
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