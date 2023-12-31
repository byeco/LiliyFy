const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'sunucu-bilgi',
    description: 'Sunucu bilgilerini gösterir.',
  },
  async execute(interaction) {
    try {
      const serverOwner = interaction.guild.ownerId ? (await interaction.guild.members.fetch(interaction.guild.ownerId)).user.tag : 'Bilgi Yok';

      const serverInfoEmbed = new MessageEmbed()
        .setTitle(interaction.guild.name + ' Sunucu Bilgileri')
        .addFields(
          { name: 'Sunucu Sahibi', value: serverOwner, inline: false },
          { name: 'Üye Sayısı', value: interaction.guild.memberCount.toString() || 'Bilgi Yok', inline: false },
          { name: 'Bot Sayısı', value: interaction.guild.members.cache.filter(member => member.user.bot).size.toString() || 'Bilgi Yok', inline: false },
          { name: 'Emoji Sayısı', value: interaction.guild.emojis.cache.size.toString() || 'Bilgi Yok', inline: false },
          { name: 'Boost Sayısı', value: interaction.guild.premiumSubscriptionCount.toString() || 'Bilgi Yok', inline: false },
          { name: 'Kanal Sayısı', value: interaction.guild.channels.cache.size.toString() || 'Bilgi Yok', inline: false },
          { name: 'Oluşturulma Tarihi', value: interaction.guild.createdAt.toDateString() || 'Bilgi Yok', inline: false },
        )
        .setColor('#78f060')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || '');

      interaction.reply({ embeds: [serverInfoEmbed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true });
    }
  },
};
