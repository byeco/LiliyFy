const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanıcı-bilgi')
    .setDescription('Belirtilen kullanıcının bilgilerini gösterir')
    .addUserOption(option => option.setName('user').setDescription('Bilgilerini görüntülemek istediğiniz kullanıcı').setRequired(true))
    .addBooleanOption(option => option.setName('gizli').setDescription('Kullanıcının bilgilerini gizli göster').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const isPrivate = interaction.options.getBoolean('gizli');

    const member = interaction.guild.members.cache.get(user.id);

    const roles = member.roles.cache
      .filter(role => role.id !== interaction.guild.id)
      .map(role => `<@&${role.id}>`)
      .join(', ');

    const embed = new MessageEmbed()
      .setColor('#78f060')
      .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
      .addField('Kullanıcı Adı', user.tag)
      .addField('Kullanıcı ID', user.id)
      .addField('Hesap Oluşturulma Tarihi', user.createdAt.toUTCString())
      .addField('Sunucuya Katılım Tarihi', member.joinedAt.toUTCString())
      .addField('Sunucudaki Rolleri', roles || 'Everyone Dışında rol yok')
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 })); // Kullanıcının profil fotoğrafı sağ tarafta gösterilecek

    await interaction.reply({ embeds: [embed], ephemeral: isPrivate });
  },
};
