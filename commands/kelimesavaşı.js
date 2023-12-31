const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: {
        name: 'kelime-savaşı',
        description: 'Kelime savaşı başlatır.',
        options: [
            {
                name: 'kisi',
                description: 'Kelime savaşı isteğini göndermek istediğiniz kişi.',
                type: 'USER',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const user = interaction.user;
        const opponent = interaction.options.getUser('kisi');
        const botAvatarURL = interaction.client.user.avatarURL();

        const oylazim = new MessageEmbed()
            .setTitle("<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>")
            .setDescription("Bu komutu kullanabilmen için botumuza Top.gg üzerinden oy vermelisin. [OY VER](https://top.gg/bot/1052989477641007114/vote)")
            .setThumbnail(botAvatarURL)
            .setColor('#78f060');

        const url = `https://top.gg/api/bots/1052989477641007114/check?userId=${interaction.user.id}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNTI5ODk0Nzc2NDEwMDcxMTQiLCJib3QiOnRydWUsImlhdCI6MTY5MTY5MjgyMn0.o0Mw9pSVKve4iz0JfH4D8lf7Uckt-mCVtSn8MNTXCBY"
                }
            });

            if (response.data["voted"] !== 1) {
                return interaction.reply({ embeds: [oylazim] });
            }

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('accept')
                        .setLabel('Kabul Et')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('reject')
                        .setLabel('Reddet')
                        .setStyle('DANGER')
                );

            await interaction.reply({ content: `${opponent}, kelime savaşı isteğini kabul ediyor musun?`, components: [row] });

            const filter = i => i.user.id === opponent.id && (i.customId === 'accept' || i.customId === 'reject');
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

            collector.on('collect', async i => {
                if (i.customId === 'accept') {
                    await i.update({ content: 'Savaş kabul edildi! 3... 2... 1... Kelimenizi yazın!', components: [] });

                    const words = ['moment', 'oyun', 'discord', 'bot', 'eğlence']; // Kelime listesi
                    const word = words[Math.floor(Math.random() * words.length)]; // Rastgele bir kelime seçilebilir
                    await interaction.followUp(`Savaş başlıyor! İlk kelime: **${word}**`);

                    const filterWord = m => (m.author.id === user.id || m.author.id === opponent.id) && m.content.toLowerCase() === word.toLowerCase() && m.content.toLowerCase() !== 'kelime'; // Burada kelimeyi kontrol ediyoruz
                    const wordCollector = interaction.channel.createMessageCollector({
                        filter: filterWord,
                        time: 15000,
                    });

                    wordCollector.on('collect', async m => {
                        await m.delete();
                        if (m.author.id === user.id) {
                            await interaction.followUp(`Tebrikler, ${user}! Kelimeyi doğru yazdınız ve kazandınız.`);
                            wordCollector.stop();
                        } else if (m.author.id === opponent.id) {
                            await interaction.followUp(`Tebrikler, ${opponent}! Kelimeyi doğru yazdınız ve kazandınız.`);
                            wordCollector.stop();
                        }
                    });

                    wordCollector.on('end', collected => {
                        if (collected.size === 0) {
                            interaction.followUp(`Üzgünüm, süre doldu ve kimse kelimeyi doğru yazamadı.`);
                        }
                    });
                } else if (i.customId === 'reject') {
                    await i.update(`${opponent}, savaşı reddettiniz.`);
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp(`${opponent}, savaş isteğinizi kabul etmedi.`);
                }
            });

        } catch (error) {
            console.error(error);
            interaction.reply('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    },
};
