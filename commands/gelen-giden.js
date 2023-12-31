const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');

// JSON dosyasını okuma fonksiyonu
function okuVeriler() {
    try {
        const veri = fs.readFileSync('./Data/gelen-giden.json');
        return JSON.parse(veri);
    } catch (hata) {
        console.error('Veri okuma hatası:', hata);
        return {};
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gelen-giden')
        .setDescription('Gelen-giden mesajlarını açar veya kapatır')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Gelen-giden mesajlarının atılacağı kanalı belirler')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('acikmi')
                .setDescription('Gelen-giden mesajlarını aç veya kapat')
                .setRequired(false)),

    async execute(interaction) {
        const kanal = interaction.options.getChannel('kanal');
        const sunucuID = interaction.guild.id;
        const acikmi = interaction.options.getBoolean('acikmi');
        const veriler = okuVeriler();

        // Kullanıcının yetkisini kontrol et
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            await interaction.reply('Bu komutu kullanmak için gerekli yetkiye sahip değilsiniz.');
            return;
        }

        if (acikmi === true) {
            // Gelen-giden mesajlarını aç
            if (!veriler.sunucular[sunucuID]) {
                veriler.sunucular[sunucuID] = {};
            }

            if (kanal) {
                veriler.sunucular[sunucuID].gelenGidenKanal = kanal.id;
            }

            const embed = new MessageEmbed()
                .setColor('#78f060')
                .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
                .setDescription(`Gelen-giden mesajları bu kanala atılacak: ${kanal}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else if (acikmi === false) {
            // Gelen-giden mesajlarını kapat
            if (veriler.sunucular[sunucuID]) {
                delete veriler.sunucular[sunucuID].gelenGidenKanal;

                const embed = new MessageEmbed()
                    .setColor('#78f060')
                    .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
                    .setDescription('Gelen-giden mesajları artık atılmayacak.')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            }
        } else {
            // Geçerli bir açma veya kapatma durumu belirtilmemiş
            await interaction.reply('Geçerli bir açma veya kapatma durumu belirtmelisiniz.');
        }

        // Verileri kaydet
        fs.writeFileSync('./Data/gelen-giden.json', JSON.stringify(veriler, null, 4));
    },
};
