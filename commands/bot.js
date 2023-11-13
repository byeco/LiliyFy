const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'bot',
        description: 'Bot komutunu gösterir',
    },
    execute(interaction) {
        const botAvatarURL = interaction.client.user.displayAvatarURL(); // Botun avatar URL'si

        const embed = new MessageEmbed()
            .setColor('#78f060')
            .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
            .setDescription('Merhaba ben lilify ve sizin moderasyon botunuzum')
            .addField('/istatistik', 'Botun istatistiklerini gösterir.')
            .addField('/oy-ver', 'oy-vermeniz için embed atar.')
            .addField('/ping', 'Botun ping\'ni gösterir')
            .setThumbnail(botAvatarURL)
            .setFooter({ text: 'LiliFy - Bir Moddan daha fazlası' });

        interaction.reply({ embeds: [embed] });
    },
};
