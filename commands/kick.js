const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bir kullanıcıyı sunucudan atma')
    .addUserOption(option => option.setName('user').setDescription('Atılacak kullanıcı').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Atılma nedeni').setRequired(false)),
  async execute(interaction) {
    const userToKick = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Gerekçe belirtilmedi';

    if (!interaction.guild.me.permissions.has('KICK_MEMBERS')) {
      return interaction.reply({ content: 'Üyeleri atma iznim yok.', ephemeral: true });
    }

    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply({ content: 'Üyeleri atma izniniz yok.', ephemeral: true });
    }

    if (userToKick.id === interaction.user.id) {
      return interaction.reply({ content: 'Kendinizi atamazsınız.', ephemeral: true });
    }

    if (userToKick.id === interaction.guild.ownerId) {
      return interaction.reply({ content: 'Sunucu sahibini atamazsınız.', ephemeral: true });
    }

    try {
      const kickedUser = await interaction.guild.members.kick(userToKick, reason);

      const embed = new MessageEmbed()
        .setColor('#78f060') // Renk kodu
        .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
        .setDescription(`**${userToKick.tag}** Sunucudan Atıldı`)
        .addField('**Atan Kişi:** ', interaction.user.tag)
        .addField('**Atılma Sebebi:** ', reason);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Kullanıcı atılırken bir hata oluştu.', ephemeral: true });
    }
  },
};
