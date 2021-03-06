const Discord = require("discord.js");

const Warn = require("../../models/warn.js")

module.exports = {
  name: "avisos",
  aliases: ["warns", "warnslist", "punishmentlist"],
  cooldown: 2,
  category: "moderação",
  description: "Veja quantos warns uma pessoa tem",
  usage: "m!avisos <usuario>",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Você precisa da permissão `MANAGE_MESSAGES` para utilizar este comando");

    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if(!user) return message.reply("Nenhum usuário encontrado");
    if(user.bot) return message.reply("Bots são muito legais para receberem avisos");
    if(!message.guild.members.cache.get(user.id)) return message.reply("Este membro não está neste servidor!!!")

    //listas

    var noWarn = [
        "https://i.imgur.com/pwMKAPd.png",
        "https://i.imgur.com/d8cgWvS.png",
        "https://i.imgur.com/aVXTWSA.jpg",
        "https://i.imgur.com/bUuehyU.jpg",
        "https://i.imgur.com/4FfgL7h.png"
    ];

    var warned = [
        "https://i.imgur.com/vS46DHp.png",
        "https://i.imgur.com/ziNWVxo.jpg",
        "https://i.imgur.com/ZVQh20v.jpg",
        "https://i.imgur.com/oPTIn2Z.jpg",
        "https://i.imgur.com/2kxswoS.png",
        "https://i.imgur.com/FEEjyY3.png"
    ];

    let rand;

    let embed = new Discord.MessageEmbed()
    .setTitle(`Avisos de ${user.tag}`)

    Warn.find({userId: user.id, guildId: message.guild.id}).sort([['data', 'ascending']]).exec((err, db) => {
        if(err) console.log(err);

        if(!db || db.length < 1){
            embed.setDescription(`${user} não possui avisos neste servidor`);
             rand = noWarn[Math.floor(Math.random() * noWarn.length)];
        } else {
            rand = warned[Math.floor(Math.random() * warned.length)];
        }

        for(i = 0; i < db.length; i++){
            embed.addField(`Aviso #${i + 1}`, `**Avisado por:** ${client.users.cache.get(db[i].warnerId)}\n**Razão:** ${db[i].reason}\n**Data:** ${db[i].data}\n**WarnID:** \`${db[i]._id}\``);
        }
        embed.setImage(rand);
        //const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack;
        //if(embed.length > 6000) embed.fields.slice(0, embed.length === 6000);
        message.channel.send(embed);
    })
  }};
