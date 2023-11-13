const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

// Veritabanı dosyası
const databasePath = './Data/uyarı.json';

// Veritabanını oku veya oluştur
let database = {};
try {
  database = JSON.parse(fs.readFileSync(databasePath, 'utf-8'));
} catch (error) {
  console.error('Veritabanı okunamadı veya oluşturulamadı:', error);
}

const MAX_WARNINGS = 3; // Maksimum uyarı sayısı
const BAN_THRESHOLD = 3; // Atılma eşiği

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uyar')
    .setDescription('Kullanıcıya uyarı verir.')
    .addUserOption(option => option.setName('kullanici').setDescription('Uyarı verilecek kullanıcı').setRequired(true))
    .addStringOption(option => option.setName('sebep').setDescription('Uyarı sebebi').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanici');
    const reason = interaction.options.getString('sebep');

    if (!user) {
      return interaction.reply('Uyarı vermek için bir kullanıcı belirtmelisiniz.');
    }

    if (user.bot) {
      return interaction.reply('Botlara uyarı verilemez.');
    }

    // Veritabanından kullanıcının uyarı sayısını al
    const userWarningsCount = database[user.id] || 0;

    // Kullanıcının uyarı sayısını artırma veya başlatma
    if (userWarningsCount >= MAX_WARNINGS) {
      // Eğer uyarı sayısı atılma eşiğini geçerse
      user.ban({ reason: 'Çok fazla uyarı aldı.' }); // Kullanıcıyı at
      return interaction.reply(`${user.tag} kullanıcısı çok fazla uyarı aldığı için atıldı.`);
    }

    // Veritabanını güncelle
    database[user.id] = userWarningsCount + 1;
    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

    const embed = new MessageEmbed()
      .setColor('#78f060')
      .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
      .setDescription(`**Uyarılan Kullanıcı:** ${user}\n**Uyarı Sebebi:** ${reason}\n**Moderatör:** ${interaction.user.tag}`)
      .setTimestamp();

    // Uyarıyı log kanalına gönderme
    const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'uyari-log');
    if (logChannel) {
      logChannel.send({ embeds: [embed] });
    }


    interaction.reply({ embeds: [embed] });
// Kullanıcıya DM mesajı gönderme
    try {
      const dmEmbed = new MessageEmbed()
        .setColor('#78f060')
        .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
        .setDescription(`**Uyarı Sebebi:** ${reason}\n**Moderatör:** ${interaction.user.tag}`)
        .setTimestamp();

      await user.send({ embeds: [dmEmbed] });
    } catch (error) {
      return console.error(`DM mesajı gönderilemedi: ${error}`);
    }
  },
};