const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS // Katılma ve ayrılma olaylarını izlemek için
  ],
});



// github(byeco) tarafından yapılmıştır
const token = 'MTA1Mjk4OTQ3NzY0MTAwNzExNA.G9J35A.4B3sGslq1v0TgCiMGMQne9MZi4CQuJG9tnCjKY';
// github(byeco) tarafından yapılmıştır
client.commands = new Collection();
// github(byeco) tarafından yapılmıştır
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}
// github(byeco) tarafından yapılmıştır
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! iyi kullanımlar Github(byeco) - Nostge`);
  
  const commandData = client.commands.map(command => command.data);
  client.application.commands.set(commandData);
  
  setInterval(() => {
    const statusOptions = ['💫 LiliyFy', 'Dostum Bu yetkide olmak çok güzel', 'WoW Bu sunucu harika!','By byeco - nostge']; // Değiştirmek istediğiniz durumları buraya ekleyin
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    client.user.setActivity(randomStatus, { type: 'COMPETING' });
  }, 5000); // Her 5 saniyede bir durumu değiştir
});
// github(byeco) tarafından yapılmıştır
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
  
    if (!command) return;
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
// github(byeco) tarafından yapılmıştır
// JSON dosyasını okuma fonksiyonu
function okuVeriler() {
  try {
      const veri = fs.readFileSync('./Data/gelen-giden.json');
      return JSON.parse(veri);
  } catch (hata) {
      console.error('Veri okuma hatası:', hata);
      return {};
  }
}

// github(byeco) tarafından yapılmıştır
client.on('guildMemberAdd', (member) => {
  const veriler = okuVeriler();
  const sunucuVerisi = veriler.sunucular[member.guild.id];

  if (sunucuVerisi && sunucuVerisi.gelenGidenKanal) {
      const gelenGidenKanal = member.guild.channels.cache.get(sunucuVerisi.gelenGidenKanal);

      if (gelenGidenKanal) {
          const katilmaTarihi = new Date(member.joinedAt);
          const simdi = new Date();
          const fark = Math.abs(simdi - katilmaTarihi);
          const gunFark = Math.ceil(fark / (1000 * 60 * 60 * 24));
          const ayFark = Math.ceil(fark / (1000 * 60 * 60 * 24 * 30));
          const yilFark = Math.ceil(fark / (1000 * 60 * 60 * 24 * 365));

          const hoşgeldinEmbed = new MessageEmbed()
              .setColor('#78f060')
              .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
              .setDescription(`Hoş geldin, ${member.user}! Sunucumuza hoş geldin.`)
              .setThumbnail(member.user.displayAvatarURL())
              .addField('Katılma Tarihi', `Katıldı: ${katilmaTarihi.toLocaleString()} `)
              .setTimestamp();

          gelenGidenKanal.send({ embeds: [hoşgeldinEmbed] });
      }
  }
});
// github(byeco) tarafından yapılmıştır
client.on('guildMemberRemove', (member) => {
  const veriler = okuVeriler();
  const sunucuVerisi = veriler.sunucular[member.guild.id];

  if (sunucuVerisi && sunucuVerisi.gelenGidenKanal) {
      const gelenGidenKanal = member.guild.channels.cache.get(sunucuVerisi.gelenGidenKanal);

      if (gelenGidenKanal) {
          const ayrilmaTarihi = new Date();
          const ayrilmaFark = Math.abs(ayrilmaTarihi - member.joinedAt);
          const ayrilmaGunFark = Math.ceil(ayrilmaFark / (1000 * 60 * 60 * 24));
          const ayrilmaAyFark = Math.ceil(ayrilmaFark / (1000 * 60 * 60 * 24 * 30));
          const ayrilmaYilFark = Math.ceil(ayrilmaFark / (1000 * 60 * 60 * 24 * 365));

          const güleGüleEmbed = new MessageEmbed()
              .setColor('#ff0000')
              .setTitle('<:li:1138793871724265533><:liy:1138793873783664801><:fy:1138793868666613831>')
              .setDescription(`Güle güle, **${member.user.tag}**! Sunucudan ayrıldı.`)
              .setThumbnail(member.user.displayAvatarURL())
              .addField('Ayrılma Tarihi', `Ayrıldı: ${ayrilmaTarihi.toLocaleString()} (${ayrilmaGunFark} gün, ${ayrilmaAyFark} ay, ${ayrilmaYilFark} yıl önce)`)
              .setTimestamp();

          gelenGidenKanal.send({ embeds: [güleGüleEmbed] });
      }
  }
});
// github(byeco) tarafından yapılmıştır
function okuLogVerileri() {
  try {
      const veri = fs.readFileSync('./Data/log.json');
      return JSON.parse(veri);
  } catch (hata) {
      console.error('Log verisi okuma hatası:', hata);
      return {};
  }
}
// github(byeco) tarafından yapılmıştır
// İlgili olayları dinlemek için gerekli kodlar
client.on('messageDelete', async (message) => {
  const logVerileri = okuLogVerileri();
  const sunucuID = message.guild.id;

  if (logVerileri[sunucuID] && logVerileri[sunucuID]['sil-log']) {
      const logEmbed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('Mesaj Silindi')
          .setDescription(`**Silinen Mesaj:** ${message.content}\n**Kanal:** ${message.channel}\n**Kim Tarafından Yazıldı:** ${message.author.tag}\n**Kimin Tarafından Silindi:** ${message.author.tag}`)
          .setTimestamp();

      const logKanalID = logVerileri[sunucuID]['log-kanal'];
      const logKanal = message.guild.channels.cache.get(logKanalID);
      if (logKanal) {
          logKanal.send({ embeds: [logEmbed] });
      }
  }
});
// github(byeco) tarafından yapılmıştır
// Rol işlemleri loglama
client.on('roleCreate', async (role) => {
  const logVerileri = okuLogVerileri();
  const sunucuID = role.guild.id;

  if (logVerileri[sunucuID] && logVerileri[sunucuID]['rol-log']) {
      const logEmbed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('Rol Oluşturuldu')
          .setDescription(`**Rol Adı:** ${role.name}\n**Rol ID:** ${role.id}`)
          .setTimestamp();

      const logKanalID = logVerileri[sunucuID]['log-kanal'];
      const logKanal = role.guild.channels.cache.get(logKanalID);
      if (logKanal) {
          logKanal.send({ embeds: [logEmbed] });
      }
  }
});
// github(byeco) tarafından yapılmıştır
client.on('roleUpdate', async (oldRole, newRole) => {
  const logVerileri = okuLogVerileri();
  const sunucuID = oldRole.guild.id;

  if (logVerileri[sunucuID] && logVerileri[sunucuID]['rol-log']) {
      const logEmbed = new MessageEmbed()
          .setColor('#ffff00')
          .setTitle('Rol Güncellendi')
          .setDescription(`**Eski Rol Adı:** ${oldRole.name}\n**Yeni Rol Adı:** ${newRole.name}\n**Rol ID:** ${newRole.id}`)
          .setTimestamp();

      const logKanalID = logVerileri[sunucuID]['log-kanal'];
      const logKanal = oldRole.guild.channels.cache.get(logKanalID);
      if (logKanal) {
          logKanal.send({ embeds: [logEmbed] });
      }
  }
});
// github(byeco) tarafından yapılmıştır
client.on('roleDelete', async (role) => {
  const logVerileri = okuLogVerileri();
  const sunucuID = role.guild.id;

  if (logVerileri[sunucuID] && logVerileri[sunucuID]['rol-log']) {
      const logEmbed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('Rol Silindi')
          .setDescription(`**Silinen Rol Adı:** ${role.name}\n**Rol ID:** ${role.id}`)
          .setTimestamp();

      const logKanalID = logVerileri[sunucuID]['log-kanal'];
      const logKanal = role.guild.channels.cache.get(logKanalID);
      if (logKanal) {
          logKanal.send({ embeds: [logEmbed] });
      }
  }
});
// github(byeco) tarafından yapılmıştır
// Üye-Rol işlemleri loglama
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  const logVerileri = okuLogVerileri();
  const sunucuID = oldMember.guild.id;

  if (logVerileri[sunucuID] && logVerileri[sunucuID]['uye-rol-log']) {
      const eskiRoller = oldMember.roles.cache;
      const yeniRoller = newMember.roles.cache;

      const eklenenRoller = yeniRoller.filter(role => !eskiRoller.has(role.id));
      const cikarilanRoller = eskiRoller.filter(role => !yeniRoller.has(role.id));

      if (eklenenRoller.size > 0) {
          const logEmbed = new MessageEmbed()
              .setColor('#00ff00')
              .setTitle('Üyeye Rol Eklendi')
              .setDescription(`**Üye:** ${newMember.user.tag}\n**Eklenen Roller:** ${eklenenRoller.map(role => role.name).join(', ')}`)
              .setTimestamp();

          const logKanalID = logVerileri[sunucuID]['log-kanal'];
          const logKanal = oldMember.guild.channels.cache.get(logKanalID);
          if (logKanal) {
              logKanal.send({ embeds: [logEmbed] });
          }
      }

      if (cikarilanRoller.size > 0) {
          const logEmbed = new MessageEmbed()
              .setColor('#ff0000')
              .setTitle('Üyeden Rol Alındı')
              .setDescription(`**Üye:** ${newMember.user.tag}\n**Alınan Roller:** ${cikarilanRoller.map(role => role.name).join(', ')}`)
              .setTimestamp();

          const logKanalID = logVerileri[sunucuID]['log-kanal'];
          const logKanal = oldMember.guild.channels.cache.get(logKanalID);
          if (logKanal) {
              logKanal.send({ embeds: [logEmbed] });
          }
      }
  }
});
// github(byeco) tarafından yapılmıştır
// Kanal işlemleri loglama
client.on('channelCreate', async (channel) => {
  const logVerileri = okuLogVerileri();
  const sunucuID = channel.guild.id;

  if (logVerileri[sunucuID] && logVerileri[sunucuID]['kanal-log']) {
      const logEmbed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('Kanal Oluşturuldu')
          .setDescription(`**Kanal Adı:** ${channel.name}\n**Kanal Türü:** ${channel.type}`)
          .setTimestamp();

      const logKanalID = logVerileri[sunucuID]['log-kanal'];
      const logKanal = channel.guild.channels.cache.get(logKanalID);
      if (logKanal) {
          logKanal.send({ embeds: [logEmbed] });
      }
  }
});
// github(byeco) tarafından yapılmıştır
client.on('channelUpdate', async (oldChannel, newChannel) => {
  const logVerileri = okuLogVerileri();
  const sunucuID = newChannel.guild.id;

  if (logVerileri[sunucuID] && logVerileri[sunucuID]['kanal-log']) {
      const logEmbed = new MessageEmbed()
          .setColor('#ffff00')
          .setTitle('Kanal Güncellendi')
          .setDescription(`**Eski Kanal Adı:** ${oldChannel.name}\n**Yeni Kanal Adı:** ${newChannel.name}\n**Kanal Türü:** ${newChannel.type}`)
          .setTimestamp();

      const logKanalID = logVerileri[sunucuID]['log-kanal'];
      const logKanal = oldChannel.guild.channels.cache.get(logKanalID);
      if (logKanal) {
          logKanal.send({ embeds: [logEmbed] });
      }
  }
});
// github(byeco) tarafından yapılmıştır
client.on('channelDelete', async (channel) => {
  const logVerileri = okuLogVerileri();
  const sunucuID = channel.guild.id;

  if (logVerileri[sunucuID] && logVerileri[sunucuID]['kanal-log']) {
      const logEmbed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('Kanal Silindi')
          .setDescription(`**Silinen Kanal Adı:** ${channel.name}\n**Kanal Türü:** ${channel.type}`)
          .setTimestamp();

      const logKanalID = logVerileri[sunucuID]['log-kanal'];
      const logKanal = channel.guild.channels.cache.get(logKanalID);
      if (logKanal) {
          logKanal.send({ embeds: [logEmbed] });
      }
  }
});


client.login(token);

// github(byeco) tarafından yapılmıştır