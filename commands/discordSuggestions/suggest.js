const Command = require('../../structures/Command');
const config = require('../../config.json');
const Discord = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'suggest discord',
        aliases: ["sd", "sugd"],
        description: `Suggest anything for the discord!`,
        category: 'Suggestions',
        cooldown: 20,
        botPermission: ["ADD_REACTIONS"]
      });
    }

    async run(message, args) {

      console.log(`Discord Suggestion Ran. From user ${message.author.tag}`)

      let channel;
      if(config.discord_channel_id){
        channel = await message.guild.channels.cache.get(config.discord_channel_id)
      } else channel = await message.guild.channels.cache.find(c => c.name == "suggestions" && c.type == "text");

      if(!channel){
      return message.channel.send(`${message.client.emoji.fail} | I could not find the suggestion channel in the current guild.`)
      };

      const suggestion = args.slice(0).join(" ")
      if(!suggestion){
        return message.channel.send(`${message.client.emoji.fail} | You need to type s!sug [Your suggestion]`)
      };

      const embed = new Discord.MessageEmbed()
      .setThumbnail(message.author.avatarURL())
      .setDescription(`**Submitter**\n ${message.author.tag} \n\n**Suggestion**\n ${suggestion}`)
      .setFooter(`Suggested by ${message.author.id}`)
      .setTimestamp()
    
      channel.send(embed)
      .then((s)=>{

      s.react('✅')
      s.react('❌')

      })
      .catch(()=>{
        return message.reply(`${message.client.emoji.fail} | Could not send a message to the suggestion Channel.`)
      });
      
      message.delete();
      return message.channel.send(`${message.client.emoji.success} | Successfuly sent your suggestion to ${channel}`)
      .then((s)=>{
        s.delete({timeout: 5000})
      })


      }
};

