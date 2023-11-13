const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kanal-aç')
    .setDescription('Kilitli olan bir kanalın kilidini açar.')
    .addChannelOption(option => option.setName('kanal').setDescription('Kilidi açmak istediğiniz kanalı belirtin').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');

    if (!channel) {
      return interaction.reply('Bir kanal belirtmelisiniz.');
    }

    const isLocked = channel.permissionOverwrites.cache.some(overwrite => {
      return overwrite.deny.has('SEND_MESSAGES');
    });

    if (!isLocked) {
      const resultEmbed = new MessageEmbed()
        .setColor('#78f060')
        .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
        .setDescription(`**#${channel.name}** kanalının kilidi zaten açık.`);

      return interaction.reply({ embeds: [resultEmbed] });
    }

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SEND_MESSAGES: null
    });

    const unlockEmbed = new MessageEmbed()
      .setColor('#78f060')
      .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
      .setDescription(`**#${channel.name}** kanalının kilidi açıldı.`);

    interaction.reply({ embeds: [unlockEmbed] });
  },
};
