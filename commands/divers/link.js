const { MessageEmbed } = require('discord.js');
const config = require('../../json/config.json');
const fs = require('fs')
var logger = fs.createWriteStream('./logs.txt', {flags : 'a'});

module.exports.run = (client, cmd, args) => {
    if (!args[0]) {
        const embed = new MessageEmbed()
        .setTitle('Suivez Rem\'s 38 !')
        .setThumbnail('https://rems38-carnetdelecture.alwaysdata.net/images/link_(for_RemsBot).png')
        .setDescription(`Voici la liste de toutes les plateformes où vous pouvez retrouver Rem\'s 38 !`)
        .addField('<:willow:906536996724437002>', '[Tous les liens](https://wlo.link/@rems38)', true)
        .addField('<:youtube:824305300168769536>', '[YouTube](https://youtube.com/c/Rems38)', true)
        .addField('<:discord:824305193251504209>', '[Discord](https://discord.gg/mYp6nwN)', true)
        .addField('<:twitch:824305286687752223>', '[Twitch](https://twitch.tv/rems_38)', true)
        .addField('<:paypal:824305247669321728>', '[Don PayPal](https://www.paypal.com/donate?hosted_button_id=Z9UV2EUQPB2JA)', true)
        .addField('<:streamlabs:906537711316373514>', '[Don StreamLabs](https://streamlabs.com/rems38)', true)
        .addField('<:instagram:824305222083543060>', '[Instagram](https://instagram.com/rems38_ytb)', true)
        .addField('<:facebook:824305207075799081>', '[Facebook](https://facebook.com/rems38.ytb)', true)
        .addField('<:github:906534912100827207>', '[GitHub](https://github.com/rems-38/)', true)
        .addField('<:keakr:824305234070863897>', '[KEAKR](https://keakr.com/profile/rem-s-beat-i)', true)
        .addField('<:soundcloud:824305273794461737>', '[SoundCloud](https://soundcloud.com/rems-beat)', true)
        .addField('<:peertube:824305257994649660>', '[PeerTube](https://tube.nocturlab.fr/video-channels/rems_38/videos)', true)
        .addField('<:dailymotion:824305172003684412>', '[Dailymotion](https://dailymotion.com/dm_2fe47548ff099c96137e004e7351b698)', true)
        .setFooter({text: 'Suivez-le de partout !!!'});

        // Pour obtenir les infos des emojis comme ceci, aller dans Discord et taper "\:nom_emoji:" puis envoyez le message !

        cmd.channel.send({ embeds: [embed] });

    } else {
        if (args[1]) return cmd.reply("Un seul site à la fois merci !");

        const embed = new MessageEmbed()
        .setTitle('Suivez Rem\'s 38 !')
        .setThumbnail('https://rems38-carnetdelecture.alwaysdata.net/images/link_(for_RemsBot).png')
        .setFooter({text: 'Suivez-le de partout !!!'});

        const site = args[0].toLowerCase();

        if (site === "all") embed.setDescription('Plateforme désirée : **All**').addField('Partagez cette page, il y a tous mes liens !', '<:willow:906536996724437002> [Tous mes liens](https://wlo.link/@rems38)')
        if (site === "youtube") embed.setDescription('Platforme désirée : **YouTube**').addField('Allez vous abonner !', '<:youtube:824305300168769536> [YouTube](https://youtube.com/c/Rems38)');
        if (site === "discord") embed.setDescription('Plateforme désirée : **Discord**').addField('Partagez ce Discord !', '<:discord:824305193251504209> [Discord](https://discord.gg/mYp6nwN)');
        if (site === "twitch") embed.setDescription('Plateforme désirée : **Twitch**').addField('Allez vous abonner !', '<:twitch:824305286687752223> [Twitch](https://twitch.tv/rems_38)');
        if (site === "paypal") embed.setDescription('Plateforme désirée : **Don Paypal**').addField('Merci pour le (futur) don !', '<:paypal:824305247669321728> [Don PayPal](https://www.paypal.com/donate/?hosted_button_id=WVDF9HJGQXLRU)');
        if (site === "streamlabs") embed.setDescription('Plateforme désirée : **Don StreamLabs**').addField('Pour les dons quand je suis en **LIVE**', '<:streamlabs:906537711316373514> [Don StreamLabs](https://streamlabs.com/rems38)')
        if (site === "instagram") embed.setDescription('Plateforme désirée : **Instagram**').addField('Allez me follow !', '<:instagram:824305222083543060> [Instagram](https://instagram.com/rems38_ytb)');
        if (site === "facebook") embed.setDescription('Plateforme désirée : **Facebook**').addField('Allez me follow !', '<:facebook:824305207075799081> [Facebook](https://facebook.com/rems38.ytb)');
        if (site === "github") embed.setDescription('Plateforme désirée : **Github**').addField('Suivez mes projets de code !', '<:github:906534912100827207> [GitHub](https://github.com/rems-38/)')
        if (site === "keakr") embed.setDescription('Plateforme désirée : **Keakr**').addField('Si t\'achète un de mes beats, t\'es le sang !', '<:keakr:824305234070863897> [KEAKR](https://keakr.com/profile/rem-s-beat-i)');
        if (site === "soundcloud") embed.setDescription('Plateforme désirée : **SoundCloud**').addField('Suis moi : t\'auras mes beats en avant-première !', '<:soundcloud:824305273794461737> ', '[SoundCloud](https://soundcloud.com/rems-beat)');
        if (site === "peertube") embed.setDescription('Plateforme désirée : **Peertube**').addField('On est là pour les cracks hein !', '<:peertube:824305257994649660> [PeerTube](https://tube.nocturlab.fr/video-channels/rems_38/videos)');
        if (site === "dailymotion") embed.setDescription('Plateforme désirée : **Dailymotion**').addField('Pose pas de questions', '<:dailymotion:824305172003684412> [Dailymotion](https://dailymotion.com/dm_2fe47548ff099c96137e004e7351b698)');

        cmd.channel.send({ embeds: [embed] });
    }

    const date = new Date();
    logger.write(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}link exécuter par @${cmd.author.tag}\n`);
    console.log(`[${date.toLocaleDateString()} ${date.toTimeString().split(' ')[0]}] Commande ${config.prefix}link exécuter par @${cmd.author.tag}`);
};

module.exports.help = {
    name: 'link',
    aliases: ['link', 'lien'],
    category: 'divers',
    description: 'Permet de lister tous les liens concernant **Rem\'s 38**',
    usage: '<site>',
    forAdmin : false,
    args: true
};
