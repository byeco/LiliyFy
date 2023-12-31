const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

// JSON dosyasını okuma fonksiyonu
function okuLogVerileri() {
    try {
        const veri = fs.readFileSync('./Data/log.json');
        return JSON.parse(veri);
    } catch (hata) {
        console.error('Veri okuma hatası:', hata);
        return {};
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-ayarla')
        .setDescription('Logları ayarlar')
        .addBooleanOption(option =>
            option.setName('sil-log')
                .setDescription('Silinen mesajları logla')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('rol-log')
                .setDescription('Rol işlemlerini logla')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('kanal-log')
                .setDescription('Kanal işlemlerini logla')
                .setRequired(false))
        .addChannelOption(option =>
            option.setName('log-kanal')
                .setDescription('Logların gönderileceği kanalı seç')
                .setRequired(false)),

    async execute(interaction) {
        const sunucuID = interaction.guild.id;
        const logVerileri = okuLogVerileri();

        // Sunucu verilerini güncelle
        if (!logVerileri[sunucuID]) {
            logVerileri[sunucuID] = {};
        }

        // Slash komutundan gelen seçenekleri oku
        const silLog = interaction.options.getBoolean('sil-log');
        const rolLog = interaction.options.getBoolean('rol-log');
        const kanalLog = interaction.options.getBoolean('kanal-log');
        const logKanal = interaction.options.getChannel('log-kanal'); // Yeni seçenek

        // Seçeneklere göre log ayarlarını güncelle
        if (silLog !== null) {
            logVerileri[sunucuID]['sil-log'] = silLog;
        }
        if (rolLog !== null) {
            logVerileri[sunucuID]['rol-log'] = rolLog;
        }
        if (kanalLog !== null) {
            logVerileri[sunucuID]['kanal-log'] = kanalLog;
        }
        if (logKanal !== null) { // Yeni seçenek
            logVerileri[sunucuID]['log-kanal'] = logKanal.id;
        }

        // Verileri kaydet
        fs.writeFileSync('./Data/log.json', JSON.stringify(logVerileri, null, 4));

        const embed = new MessageEmbed()
            .setColor('#78f060')
            .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
            .setDescription(`Log ayarları başarıyla güncellendi.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
