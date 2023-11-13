const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Bir kullanıcının yasağını kaldırır')
    .addUserOption(option => option.setName('user').setDescription('Yasağı kaldırılacak kullanıcıyı belirtin').setRequired(true)),
  async execute(interaction) {
    const userToUnban = interaction.options.getUser('user');

    // Kullanıcının yönetici iznine sahip olduğunu kontrol edin
    if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      return interaction.reply({ content: 'Kullanıcıları yasaklama iznine sahip değilsiniz.', ephemeral: true });
    }

    try {
      const bans = await interaction.guild.bans.fetch();

      if (!bans.has(userToUnban.id)) {
        return interaction.reply({ content: `${userToUnban.tag} kullanıcısı zaten yasaklı değil.`, ephemeral: true });
      }

      await interaction.guild.bans.remove(userToUnban);

      const embed = new MessageEmbed()
        .setColor('#78f060') // Başarılı işlem rengi
        .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
        .setDescription(`**${userToUnban.tag}** kullanıcısının yasağı kaldırıldı.`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Kullanıcının yasağı kaldırılırken bir hata oluştu.', ephemeral: true });
    }
  },
};
