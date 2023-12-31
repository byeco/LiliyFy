const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'istatistik',
    description: 'Bot istatistiklerini gösterir.',
  },
  async execute(interaction) {
    try {
      const botUser = interaction.client.user;
      const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
      const totalServers = interaction.client.guilds.cache.size;
      const ping = Math.round(interaction.client.ws.ping);
      const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      const uptime = process.uptime();
      const version = '1.0.0';
      const commandCount = interaction.client.commands.size;
      const userCount = totalMembers;
      const serverCount = totalServers;
      const botCreatedAt = botUser.createdAt.toDateString();
      const os = process.platform;
      const cpu = require('os').cpus()[0].model;
      const discordjsVersion = require('discord.js').version;
      const nodejsVersion = process.version;

      const botInfoEmbed = new MessageEmbed()
      .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
        .setDescription('<:nostge:1113537166610538596> Nostge Şirketi Tarafından Yapılmıştır')
        .addFields(
          { name: '• Sistem Verileri', value: `-Botun pingi: \`${ping}\` Ms\n-Bellek Kullanımı: \`${memoryUsage}\` MB\n-Uptime Süresi: \`${formatUptime(uptime)}\`\n-Kullanılan Sürüm: \`${version}\``, inline: false },
          { name: '• Bot Verileri', value: `-Komut Sayısı: \`${commandCount}\`\n-Kullanan Kullanıcı: \`${userCount}\`\n-Kaç Sunucuda: \`${serverCount}\`\n-Botun Kuruluşu: \`${botCreatedAt}\``, inline: false },
          { name: '• İşlemci Verileri', value: `-İşletim Sistemi: \`${os}\`\n-İşlemci: \`${cpu}\`\n-Discord.js Sürümü: \`${discordjsVersion}\`\n-Node.js Sürümü: \`${nodejsVersion}\``, inline: false }
        )
        .setColor('#78f060')
        .setThumbnail(botUser.displayAvatarURL({ dynamic: true }));

      interaction.reply({ embeds: [botInfoEmbed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true });
    }
  },
};

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemain = seconds % 60;
  return `${hours} saat, ${minutes} dakika, ${secondsRemain} saniye`;
}
