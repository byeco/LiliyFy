const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun ping\'ini gösterir'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    
    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;
    
    interaction.editReply(`**Bot Gecikme Süresi:** ${latency}Ms\n**API Gecikmesi:** ${apiLatency}Ms`);
  },
};
