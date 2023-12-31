const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: {
        name: 'sevme-oranı',
        description: 'Bir kişiyi ne kadar sevdiğinizi ölçer.',
        options: [
            {
                name: 'kisi',
                description: 'Sevgi oranını ölçmek istediğiniz kişi.',
                type: 'USER',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const user = interaction.options.getUser('kisi');
        const hasVoted = await checkUserVote(interaction.user.id);

        const botAvatarURL = interaction.client.user.avatarURL();

        const oylazim = new MessageEmbed()
            .setTitle("<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>")
            .setDescription("Bu komutu kullanabilmen için botumuza Top.gg üzerinden oy vermelisin. [OY VER](https://top.gg/bot/1052989477641007114/vote)")
            .setThumbnail(botAvatarURL)
            .setColor('#78f060');

        if (!hasVoted) {
            return interaction.reply({ embeds: [oylazim] });
        }

        const lovePercentage = Math.floor(Math.random() * 101); // 0-100 arası rastgele bir sayı

        let description = `Senin ve **${user.username}**'un sevgi oranı: ${lovePercentage}% ❤️`;

        if (lovePercentage === 100) {
            description += '\nİkiniz de birbirinizi en çok seven çiftsiniz!';
        } else if (lovePercentage >= 90) {
            description += '\nHarika bir uyumunuz var gibi görünüyor!';
        } else if (lovePercentage >= 70) {
            description += '\nEh, aranız iyi gibi duruyor.';
        } else if (lovePercentage >= 50) {
            description += '\nOrtalama bir ilişkiniz var gibi gözüküyor.';
        } else if (lovePercentage >= 30) {
            description += '\nBiraz daha yakınlaşmanız gerekebilir.';
        } else if (lovePercentage >= 10) {
            description += '\nBu ilişki pek iyi gitmiyor gibi görünüyor.';
        } else {
            description += '\nSanırım biraz uzak durmalısınız.';
        }


        const embed = new MessageEmbed()
            .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
            .setDescription(description)
            .setColor('#78f060');

        interaction.reply({ embeds: [embed] });
    },
};

async function checkUserVote(userId) {
    const url = `https://top.gg/api/bots/1052989477641007114/check?userId=${userId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNTI5ODk0Nzc2NDEwMDcxMTQiLCJib3QiOnRydWUsImlhdCI6MTY5MTY5MjgyMn0.o0Mw9pSVKve4iz0JfH4D8lf7Uckt-mCVtSn8MNTXCBY" // Top.gg API anahtarınızı buraya ekleyin
            }
        });

        return response.data["voted"] === 1;
    } catch (error) {
        console.error(error);
        return false;
    }
}
