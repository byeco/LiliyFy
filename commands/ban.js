const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir kullanıcıyı sunucudan yasaklama')
    .addUserOption(option => option.setName('user').setDescription('Yasaklanacak kullanıcı').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Yasağın nedeni').setRequired(false)),
  async execute(interaction) {
    const userToBan = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Gerekçe belirtilmedi';

    if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({ content: 'Üyeleri yasaklama iznim yok.', ephemeral: true });
    }

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({ content: 'Üyeleri yasaklama izniniz yok.', ephemeral: true });
    }

    if (userToBan.id === interaction.user.id) {
      return interaction.reply({ content: 'Kendinizi yasaklayamazsınız.', ephemeral: true });
    }

    if (userToBan.id === interaction.guild.ownerId) {
      return interaction.reply({ content: 'Sunucu sahibini yasaklayamazsınız.', ephemeral: true });
    }

    try {
      const bannedUser = await interaction.guild.members.ban(userToBan, { reason });

      const embed = new MessageEmbed()
        .setColor('#78f060') // Renk kodu
        .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
        .setDescription(`**${userToBan.tag}** Sunucudan Banlandı`)
        .addField('**Banlayan Kişi:**', interaction.user.tag)
        .addField('**Banlanma Sebebi:**', reason);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Kullanıcı yasaklanırken bir hata oluştu.', ephemeral: true });
    }
  },
};
