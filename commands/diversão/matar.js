const Discord = require("discord.js");
const db = require("../../models/user.js");

module.exports = {
  name: "matar",
  aliases: ["mate", "mata", "kill"],
  cooldown: 2,
  category: "diversão",
  description: "Mate aquele que você não suporta mais",
  usage: "m!matar <@menção>",
  run: async (client, message, args) => {
  //links de assassinatos
  var list = [
    "https://i.imgur.com/teca6na.gif",
    "https://i.imgur.com/XaqZPBf.gif",
    "https://i.imgur.com/Kj331EJ.gif",
    "https://i.imgur.com/kzW8Lpc.gif",
    "https://i.imgur.com/b9byUSu.gif",
    "https://i.imgur.com/gsFgkDh.gif"
  ];

  var rand = list[Math.floor(Math.random() * list.length)];
  let user = message.mentions.users.first();
  let avatar = message.author.displayAvatarURL({ format: "png" });

  if (!user) {
    return message.reply("Se tu não matar ninguém, tu não comete crimes. STONKS");
  }

  if (user === message.author) {
    return message.reply("Ai, eu não gosto de suicídio...");
  }

  if (user.bot) {
    //links de robos
    var ro = [
      "https://i.imgur.com/tv9wQai.gif",
      "https://i.imgur.com/X9uUyEB.gif",
      "https://i.imgur.com/rtsjxWQ.gif"
    ];

    var Rrand = ro[Math.floor(Math.random() * ro.length)];

    const Rembed = new Discord.MessageEmbed()
      .setTitle("Desligar")
      .setColor("#000000")
      .setDescription(`*Robôs não podem ser mortos, mas podem ser desligados...* \n ${message.author} Desligou o bot ${user}`)
      .setImage(Rrand)
      .setThumbnail(avatar)
      .setAuthor(message.author.tag, avatar);

    return message.channel.send(Rembed);
  }

  const embed = new Discord.MessageEmbed()
    .setTitle("Matar")
    .setColor("#000000")
    .setDescription(`${message.author} M A T O U ${user}`)
    .setImage(rand)
    .setThumbnail(avatar)
    .setAuthor(message.author.tag, avatar);

   message.channel.send(embed);

   db.findOne({id: user.id}, (err, res) => {
     if(err) console.log(err);
     if(!res){
       const newUser = new db({
         id: user.id,
         nome: user.username,
         mamadas: 0,
         mamou: 0,
         status: "Morto"
       })
       newUser.save().catch(err => console.log(err));
     } else {
       res.status = "Morto";
       res.save().catch(err => console.log(err))
     }
   })

}};
