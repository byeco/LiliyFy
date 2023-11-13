const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'oy-ver',
        description: 'Botumuza oy verme komutu.',
    },
    async execute(interaction) {
        const botAvatarURL = interaction.client.user.avatarURL();

        const oyVerEmbed = new MessageEmbed()
            .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
            .setDescription('Botumuza oy vermek için aşağıdaki buttona tıklayabilirsiniz:')
            .setThumbnail(botAvatarURL)
            .setColor('#78f060');

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Oy Ver')
                    .setStyle('LINK')
                    .setURL('https://top.gg/bot/1052989477641007114/vote')
            );

        await interaction.reply({ embeds: [oyVerEmbed], components: [row] });
    },
};
