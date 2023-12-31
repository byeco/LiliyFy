const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: {
        name: 'kedi-foto',
        description: 'Rastgele bir kedi fotoğrafı gönderir.',
    },
    async execute(interaction) {
        const botAvatarURL = interaction.client.user.avatarURL();
        try {
            // Top.gg API ile oylama durumunu kontrol et
            const botID = '1052989477641007114';
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNTI5ODk0Nzc2NDEwMDcxMTQiLCJib3QiOnRydWUsImlhdCI6MTY5MTY5MjgyMn0.o0Mw9pSVKve4iz0JfH4D8lf7Uckt-mCVtSn8MNTXCBY';
            const userID = interaction.user.id;
            const checkURL = `https://top.gg/api/bots/${botID}/check?userId=${userID}`;

            const checkResponse = await fetch(checkURL, {
                headers: {
                    Authorization: token,
                },
            });

            const checkData = await checkResponse.json();

            if (checkData.voted === 1) {
                // Eğer oy vermişse kedi fotoğrafı gönder
                const response = await fetch('https://api.thecatapi.com/v1/images/search');
                const data = await response.json();

                const embed = new MessageEmbed()
                    .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
                    .setDescription('🐱 İşte sana rastgele bir kedi fotoğrafı:')
                    .setImage(data[0].url)
                    .setColor('#78f060');

                await interaction.reply({ embeds: [embed] });
            } else {
                // Eğer oy vermemişse mesaj gönder
                const oylazim = new MessageEmbed()
                .setTitle("<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>")
                .setDescription("Bu komutu kullanabilmen için botumuza Top.gg üzerinden oy vermelisin. [OY VER](https://top.gg/bot/1052989477641007114/vote)")
                .setThumbnail(botAvatarURL)
                .setColor('#78f060');

                await interaction.reply({ embeds: [oylazim] });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Bir hata oluştu.', ephemeral: true });
        }
    },
};
