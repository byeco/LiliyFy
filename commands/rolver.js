const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rol-ver')
    .setDescription('Kullanıcıya belirli bir rolü verir')
    .addUserOption(option => option.setName('user').setDescription('Role verilecek kullanıcı').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Verilecek rolü seçin').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) {
      return interaction.reply({ content: 'Rolleri yönetme iznim yok.', ephemeral: true });
    }

    if (!interaction.member.permissions.has('MANAGE_ROLES')) {
      return interaction.reply({ content: 'Rolleri yönetme izniniz yok.', ephemeral: true });
    }

    try {
      await user.roles.add(role);

      const embed = new MessageEmbed()
        .setColor('#78f060')
        .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
        .addField('Rol', role.name, true)
        .addField('Kullanıcı', user.user.tag, true);
        

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Rol verirken bir hata oluştu.', ephemeral: true });
    }
  },
};
