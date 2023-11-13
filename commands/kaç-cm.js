const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: {
        name: 'kaç-cm',
        description: 'Malatafının kaç cm olduğunu söyler',
        options: [
            {
                name: 'kisi',
                description: 'Hangi kişinin malatafına bakmak istiyorsun (çok meraklısın sanırım :D)',
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

        let description = `**${user.username}** adlı kişinin malatafı kaç cm: ${lovePercentage}`;

        if (lovePercentage === 100) {
            description += '\n<:hmm:1139580793233100851> Dostum ne yaptında bu kadar uzatabildin bizde tavsiye ver\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956>';
        } else if (lovePercentage >= 90) {
            description += '\n<:hmm:1139580793233100851> WoW biraz daha uzarmış ya besle sen yılanı\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807>';
        } else if (lovePercentage >= 70) {
            description += '\n<:hmm:1139580793233100851> Bence biraz uzun sahibine bağışlasın\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
        } else if (lovePercentage >= 50) {
            description += '\n<:nice:1139584779575115876> Ortada bir uzunluk iyidir\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
        } else if (lovePercentage >= 30) {
            description += '\n<:eh:1139584363596611724> Biraz daha yakınlaşmanız gerekebilir.\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
        } else if (lovePercentage >= 10) {
            description += '\n<:eh:1139584363596611724> Yani idare eder\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
        } else {
            description += '\n<:eh:1139584363596611724> Ow dostum hiç ilgilenmiyormusun neden bu kadar kısa?\n<:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
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
