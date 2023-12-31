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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uyarısil')
    .setDescription('Kullanıcının uyarılarını sıfırlar.')
    .addUserOption(option => option.setName('kullanici').setDescription('Uyarısı sıfırlanacak kullanıcı').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanici');

    if (!user) {
      return interaction.reply('Uyarıları sıfırlamak için bir kullanıcı belirtmelisiniz.');
    }

    // Veritabanından kullanıcının uyarı sayısını sıfırla
    if (database[user.id]) {
      database[user.id] = 0;
      fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
    }

    const embed = new MessageEmbed()
      .setColor('#78f060')
      .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
      .setDescription(`**Uyarıları sıfırlanan Kullanıcı:** ${user}\n**Moderatör:** ${interaction.user.tag}`)
      .setTimestamp();

    // Log kanalına gönderme
    const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'uyari-log');
    if (logChannel) {
      logChannel.send({ embeds: [embed] });
    }

    interaction.reply({ embeds: [embed] });
  },
};
