const Discord = require("discord.js");
const Warn = require("../../models/warn.js");

module.exports = {
  name: "warn",
  aliases: ["avisar"],
  cooldown: 2,
  category: "moderação",
  description: "Avise um usuário",
  usage: "m!warn <usuário> <razão>",
  run: async (client, message, args) => {
      if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Você precisa da permissão `KICK_MEMBERS` para usar esse comando")

      const user = message.mentions.users.first() || client.users.cache.get(args[0]);
      if(!user) return message.reply("Nenhum usuário foi mencionado");
      if(user.bot) return message.reply("Não mencione bots");
      if(user.id === message.author.id) return message.reply("O cara quer ser avisado KKK")

      if(!message.guild.members.cache.get(user.id)) return message.reply("Este membro não está neste servidor!!!")

      let reason = args.slice(1).join(" ");
      if(!reason) reason = "Sem motivo informado";

      var data1 = new Date();

      var dia = data1.getDate();
      var mes = data1.getMonth();
      var ano4 = data1.getFullYear();
      var hora = data1.getHours();
      var min = data1.getMinutes();
      var seg = data1.getSeconds();
      var str_data = dia + '/' + (mes + 1) + '/' + ano4;
      var str_hora = hora + ':' + min + ':' + seg;
      var data = str_data + ' às ' + str_hora;

      var list = [
       "https://i.imgur.com/GWFaksV.jpg",
       "https://i.imgur.com/RWcPEZp.jpg",
       "https://i.imgur.com/HQA1w2P.jpg",
       "https://i.imgur.com/ockkEoX.jpg",
       "https://i.imgur.com/YW2cuG2.jpg",
       "https://i.imgur.com/QX0IU4B.png",
       "https://i.imgur.com/B6d7BHd.jpg",
       "https://i.imgur.com/MFcF93z.jpg",
       "https://i.imgur.com/IJomzjE.jpg",
       "https://i.imgur.com/SsBmqcN.jpg",
       "https://i.imgur.com/i3EW4He.png",
       "https://i.imgur.com/lJt5lYS.png",
       "https://i.imgur.com/X0BTT0I.png",
       "https://i.imgur.com/vebRVyD.png"
      ];
    
      var rand = list[Math.floor(Math.random() * list.length)];

      const embed = new Discord.MessageEmbed()
      .setTitle("AVISADO")
      .setDescription(`${message.author} avisou ${user}`)
      .setImage(rand)

    Warn.findOne({id: user.id, guildId: message.guild.id}, (err, db) => {
      if(err) console.log(err);
      
        const addUser = new Warn({
          userId: user.id,
          warnerId: message.author.id,
          guildId: message.guild.id,
          reason,
          data 
        });
        addUser.save().then(message.channel.send(embed)).catch(err => console.log(err))
    })
}};
