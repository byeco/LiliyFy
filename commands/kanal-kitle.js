const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kanal-kilit')
    .setDescription('Belirtilen kanalı kilitleyerek mesaj gönderimini engeller.')
    .addChannelOption(option => option.setName('kanal').setDescription('Kilitlemek istediğiniz kanalı belirtin').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');

    if (!channel) {
      return interaction.reply('Bir kanal belirtmelisiniz.');
    }

    const isLocked = channel.permissionOverwrites.cache.some(overwrite => {
      return overwrite.deny.has('SEND_MESSAGES');
    });

    if (isLocked) {
      const resultEmbed = new MessageEmbed()
        .setColor('#78f060')
        .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
        .setDescription(`**#${channel.name}** kanalı zaten kilitli.`);

      return interaction.reply({ embeds: [resultEmbed] });
    }

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SEND_MESSAGES: false
    });

    const lockEmbed = new MessageEmbed()
      .setColor('#78f060')
      .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
      .setDescription(`**#${channel.name}** kanalı kilitlendi.`);

    interaction.reply({ embeds: [lockEmbed] });
  },
};
