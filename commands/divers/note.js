const Discord = require('discord.js');
const fs = require('fs');
const notes_recap = require('../../json/helper.json');

const config = require('../../json/config.json');
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    if(args[2]) return cmd.reply("Trop d'options ! (2 max : user + note)");
    if(!args[0].startsWith('<@')) return cmd.reply("Entrez un utilisateur en premier !");
    if(args[1].startsWith('<@')) return cmd.reply("Entrez une note en deuxième, pas un utilisateur");
    if(!(args[1] == 0) && !(args[1] == 1) && !(args[1] == 2) && !(args[1] == 3) && !(args[1] == 4) && !(args[1] == 5)) return cmd.reply("La note doit être comprise entre 0 et 5 !");
    
    const member_helper = cmd.mentions.members.first();

    const role_helper_fl = cmd.guild.roles.cache.find(role => role.name === "Helper FL");
    const role_helper_compo = cmd.guild.roles.cache.find(role => role.name === "Helper Compo");

    var roleFind = "";
    for (var i = 0; i <= member_helper._roles.length; i++){
        if(role_helper_fl.id === member_helper._roles[i]){
            roleFind = "True";
            break;
        }
        else if(role_helper_compo.id === member_helper._roles[i]){
            roleFind = "True";
            break;
        }
        else{
            roleFind = "False";
        }
    };

    if(roleFind === "True"){
        
        if(!notes_recap[member_helper.id]){
            notes_recap[member_helper.id] = [{
                moyenne : null,
                notes : {}
            }];
        }

        const member_helped_id = cmd.author.id;

        let date_ob = new Date();
        const after = (
            "_" + date_ob.getDate() +
            "." + date_ob.getMonth() + 1 +
            "." + date_ob.getFullYear() +
            "-" + date_ob.getHours() +
            ":" + date_ob.getMinutes() +
            ":" + date_ob.getSeconds()
        );
        const full_member_helped = member_helped_id + after;

        const mark = args[1];

        notes_recap[member_helper.id][0].notes[full_member_helped] = "";
        notes_recap[member_helper.id][0].notes[full_member_helped] = mark;

        all_notes = Object.values(notes_recap[member_helper.id][0].notes);

        mark_sum = parseInt(0);
        for(var i = 0; i < all_notes.length; i++) {
            mark_sum += parseInt(all_notes[i]);
        }
        average = mark_sum / all_notes.length;

        notes_recap[member_helper.id][0].moyenne = average;

        fs.writeFile("./json/helper.json", JSON.stringify(notes_recap, null, 4), e => {if(e) console.log(e)});

        cmd.react("✅");

        const date = new Date();
        logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}note exécuter par @${cmd.author.tag}\n`);
        console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}note exécuter par @${cmd.author.tag}`);
    }
    else cmd.reply(`${member_helper} n'est pas un Helpeur !`);

};

module.exports.help = {
    name : 'note',
    aliases : ['note'],
    category : 'divers',
    description : 'Permet de noter les helpeurs',
    usage : '@pseudo_helper note',
    forAdmin : false,
    args : true
};