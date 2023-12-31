const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'eğlence',
        description: 'Eğlence komutunu gösterir',
    },
    async execute(interaction) {
        const botAvatarURL = interaction.client.user.displayAvatarURL();

        const pages = [
            {
                title: '<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>',
                description: 'Eğlence komutlar **#1Sayfa**',
                commands: [
                    { name: '/kedi-foto', value: 'Kedi fotorafları atar' },
                    { name: '/espiri', value: 'Bazı komik olarak düşündüğümüz espiriler' },
                    { name: '/sevme-oranı', value: 'Etiketlediğiniz kişiyle sevgi oranınıza bakar' },
                    { name: '/kelime-savaşı', value: 'ilk belirlenen kelimeyi yazan kazanır' },
                    { name: '/köpek-foto', value: 'Köpek fotorafları atar' },
                    { name: '/kaç-cm', value: 'malatafınızın kaç cm olduğunu söyler' }
                    // ... Diğer komutlar
                ]
            },
            {
                title: '<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>',
                description: 'Eğlence komutlar **#2Sayfa**',
                commands: [
                    { name: '/yakında', value: 'yakında' },
                    { name: '/yakında', value: 'yakında' },
                    { name: '/yakında', value: 'yakında' },
                    { name: '/yakında', value: 'yakında' },
                    { name: '/yakında', value: 'yakında' },
                    { name: '/yakında', value: 'yakında' },
                ]
            },
            
            // Diğer sayfalar buraya eklenebilir
        ];

        let currentPage = 0;


        
        const embed = new MessageEmbed()
            .setColor('#78f060')
            .setThumbnail(botAvatarURL)
            .setTitle(pages[currentPage].title)
            .setDescription(pages[currentPage].description)
            .setFooter({ text: 'LiliyFy - Bu mesajın butonları bir süre sonra kapanır.' });

        for (const command of pages[currentPage].commands) {
            embed.addField(command.name, command.value);
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous_page')
                    .setLabel('Önceki Sayfa')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('next_page')
                    .setLabel('Sonraki Sayfa')
                    .setStyle('SUCCESS')
            );

        const reply = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const filter = (i) => {
            i.deferUpdate();
            return ['previous_page', 'next_page'].includes(i.customId) && i.user.id === interaction.user.id;
        };

        const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'previous_page') {
                currentPage = (currentPage - 1 + pages.length) % pages.length;
            } else if (i.customId === 'next_page') {
                currentPage = (currentPage + 1) % pages.length;
            }

            embed.setTitle(pages[currentPage].title)
                .setDescription(pages[currentPage].description)
                .spliceFields(0, embed.fields.length);

            for (const command of pages[currentPage].commands) {
                embed.addField(command.name, command.value);
            }

            row.components[0].setDisabled(currentPage === 0);
            row.components[1].setDisabled(currentPage === pages.length - 1);

            try {
                await reply.edit({ embeds: [embed], components: [row] });
            } catch (error) {
                console.error("Error updating interaction:", error);
            }
        });

        collector.on('end', () => {
            row.components.forEach(button => button.setDisabled(true));
            reply.edit({ components: [row] }).catch(console.error);
        });
    },
};
