const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'yardım',
        description: 'yardım komutunu gösterir',
    },
    execute(interaction) {
        const botAvatarURL = interaction.client.user.displayAvatarURL(); // Botun avatar URL'si

        const embed = new MessageEmbed()
            .setColor('#78f060')
            .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
            .setDescription('Merhaba ben lilify ve sizin moderasyon botunuzum')
            .addField('/moderasyon', 'Moderasyon komutlarını gösterir')
            .addField('/eğlence', 'Eğlence komutlarını gösterir.')
            .addField('/bot', 'Bot komutlarını gösterir')
            .addField(' ',' ')
            .addField('Beklememek için', 'Komutların bazılarında oy verme sistemi var o yüzden önceden oy vererek beklemeye bilirsiniz **/oy-ver**')
            .setThumbnail(botAvatarURL)
            .setFooter({ text: 'LiliFy - Bir Moddan daha fazlası' });

        interaction.reply({ embeds: [embed] });
    },
};
