const Discord = require("discord.js");

const database = require("../../models/user.js");
const Warns = require("../../models/warn.js");

module.exports = {
  name: "database",
  aliases: ["db", "mongo"],
  cooldown: 2,
  category: "Dev",
  description: "Acesso direto à database da Menhera",
  usage: "m!database <comando> <alteração>",

  run: async (client, message, args) => {
  if(message.author.id !== '435228312214962204') return message.reply("Acesso negado")

  const action = args[0];
  const userId = args[1];
  const valor = args[2];
  let embed = new Discord.MessageEmbed();

  switch(action) {
      case 'add':
            if(!userId || !valor) return message.reply("Erro de Sintaxe") 
            add(client, userId, valor, message, embed);
            break;
      case 'remove':
            if(!userId || !valor) return message.reply("Erro de Sintaxe") 
            remove(client, userId, valor, message, embed);
            break;
      case 'set':
            if(!userId || !valor) return message.reply("Erro de Sintaxe") 
            set(client, userId, valor, message, embed);
            break;
      case 'delwarn':
            if(!userId) return message.reply("Erro de Sintaxe")
            delwarn(client, userId, message, embed);
            break;
     case 'find':
            if(!userId) return message.reply("Erro de Sintaxe")
            find(userId, message, embed);
            break;
      default:
          message.channel.send("Utilize m!database <add|remove|set|delwarn|find> <user id> [valor]")
  }

}};

function add(client, userId, valor, message, embed){
    const value = parseInt(valor)
     database.findOne({id: userId}, (err, res) =>{
        if(err) console.log(error)
        if(!res) return message.reply("Usuário não encontrado");
        const valorAntes = res.mamou;
        res.mamou = res.mamou + value;
        
       embed.setColor("#1df05f")
       embed.setDescription(`**Mamadas de ${client.users.cache.get(userId)} alterada de \`${valorAntes}\` para \`${res.mamou}\`**`)
       
       res.save().then(message.channel.send(embed)).catch(erro => message.channel.send(`Ocorreu um erro ao salvar à database\n\`\`\`js\n${erro}\`\`\``));

     })
}

function remove(client, userId, valor, message, embed){
    const value = parseInt(valor)
    database.findOne({id: userId}, (err, res) =>{
       if(err) console.log(error)
       if(!res) return message.reply("Usuário não encontrado");
       const valorAntes = res.mamou;
       res.mamou = res.mamou - value;
       
       embed.setColor("#fc3232")
       embed.setDescription(`**Mamadas de ${client.users.cache.get(userId)} alterada de \`${valorAntes}\` para \`${res.mamou}\`**`)
       
       res.save().then(message.channel.send(embed)).catch(erro => message.channel.send(`Ocorreu um erro ao salvar à database\n\`\`\`js\n${erro}\`\`\``));

    })
}

function set(client, userId, valor, message, embed){
    const value = parseInt(valor)
    database.findOne({id: userId}, (err, res) =>{
       if(err) console.log(error)
       if(!res) return message.reply("Usuário não encontrado");
       const valorAntes = res.mamou;
       res.mamou = value;
       
       embed.setColor("#5cd7e6")
       embed.setDescription(`**Mamadas de ${client.users.cache.get(userId)} setadas de \`${valorAntes}\` para \`${res.mamou}\`**`)
       
       res.save().then(message.channel.send(embed)).catch(erro => message.channel.send(`Ocorreu um erro ao salvar à database\n\`\`\`js\n${erro}\`\`\``));

    })
}

function delwarn(client, warnId, message, embed){

    Warns.findByIdAndDelete({_id: warnId}, (err,res) => {
        if(!res) return message.reply("warn não encontrado");
        embed.setColor('#e2f01b')
        embed.setDescription(`Aviso \`${res._id}\` removido do usuário ${client.users.cache.get(res.userId)} com sucesso`);
        embed.addField("Warn removido:", `**Autor:** ${client.users.cache.get(res.warnerId)} | \`${res.warnerId}\`\n**Motivo:** ${res.reason}\n**Servidor:** ${client.guilds.cache.get(res.guildId).name} | \`${res.guildId}\`\n**Data:** ${res.data}`)
        message.channel.send(embed);
    })
}

function find(userId, message, embed){

    database.findOne({id: userId}, (err, res) => {
        if(err) message.channel.send(`Ocorreu um erro inesperado:\n\`\`\`js\n${err}\`\`\``);
        if(!res) return message.reply("Nenhum usuário encontrado na database com o id " + userId);

        const resId = res.id;
        const resNome = res.nome;
        const resMamadas = res.mamadas || 0;
        const resMamou = res.mamou || 0;
        const resCasado = res.casado || "`Nenhum casamento`";
        const resNota = res.nota || "`Sem Nota`";
        const resData = res.data || "`Sem Data`";
        const resStatus = res.status || "`Sem Status`";

        embed.setColor("#f2baf8")
        embed.addFields([{
            name: "User Id",
            value: `\`${resId}\``,
            inline: true
        },
        {
            name: "User Name",
            value: resNome,
            inline: true
        }],
        [{
            name: "Mamado",
            value: resMamadas,
            inline: true
        },
        {
          name: "Mamou",
          value: resMamou,
          inline: true
        }], [{
          name: "Status",
          value: resStatus,
          inline: true
        },
        {
            name: "Nota",
            value: resNota,
            inline: true
        }],[{
            name: "Casado",
            value: `\`${resCasado}\``,
            inline: true
        },
        {
            name: "Data",
            value: resData,
            inline: true
        }
    ]);

    Warns.countDocuments({userId: userId}, (err, res) => {
        if(err) console.log(err)
        embed.addField("Total Warns", res, true)
        message.channel.send(embed)
        })
    });
}
