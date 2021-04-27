const Discord = require(`discord.js`);
const config = require('./config.json');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const prefix = config.prefix;

client.on('ready', () => {
    console.log(`EXO ON! Con ${client.users.cache.size} usuarios, en ${client.channels.cache.size} canales de ${client.guilds.cache.size} servers.`);
    client.user.setStatus("Online")

    client.on("message", async message => 
    {
        if (message.author.bot) return;
        if (!message.guild) return;
  
        if (message.content.startsWith(prefix)) 
        {
            const args = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/);

            const command = args.shift().toLowerCase();

            if (command === "announce") 
            {
                let perms = message.member.hasPermission("MANAGE_GUILD");

                if (!perms)
                {
                    return;
                } 
                
                const questions = [ "**Especifique titulo**.","**Especifique texto**."]
                let title;
                let autor = message.author;
                let announcement
                for (let i = 0; i < questions.length; i++) 
                {
                    const question = questions[i];
                    message.channel.send(question);

                    let ms = await message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1, time: 60000, errors: ['time'] });
                    const msg = ms.array()[0]
                    if(msg.content.toLowerCase() === "cancel" ) return message.chanel.send(":x: Cancelled");
                    if (i == 0) title = msg.content;
                    else announcement = msg.content;
                }
                message.channel.bulkDelete(5);

                let colors = ["FFF000", "532FA7", "53ECFF"]

                let final_color = colors[Math.floor(colors.length * Math.random())];

                let embed = new Discord.MessageEmbed()
	            .setThumbnail(client.user.avatarURL())
                .setTitle(title)
                .setDescription(announcement)
                .setFooter("ExoPlugins - MQS", message.author.displayAvatarURL)                
                .setColor(final_color)
                
                message.channel.send(embed) 
            }

            if(command === `avatar`) 
            {
                let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
                
                const avatar = new Discord.MessageEmbed()
                .setImage(user.displayAvatarURL({dynamic: true, size : 1024 }))
                .setColor("RANDOM")
                .setFooter(`Asked by: ${message.member.displayName}`);

                message.channel.send(avatar)
            }

            if (command === "bottalk" )
            {	
                let talk = args.slice(0).join(" ") 
                
                if (talk == "everyone" || talk == "here")
                {
                    return message.channel.send(`${message.member.displayName} you cannot use everyone or here lol`)
                }
      
                message.channel.send(talk)
                message.channel.bulkDelete(1);
            }


            if (command === "message" )
            {
                let authhor = message.author;

                let talk = args.slice(0).join(" ")

                const embed = new Discord.MessageEmbed()
	            .setAuthor(message.author.tag)
                .setThumbnail(message.author.avatarURL)
	            .setColor("RANDOM")
                .setDescription(talk)

                message.channel.send(embed)
                message.channel.bulkDelete(1);
            }
            
            if (command === "survey" )
            {           
                    const embed = new Discord.MessageEmbed() 
                   .setTitle('Survey:')
                   .setThumbnail(client.user.avatarURL())
                   .setDescription('**'+args.join(' ')+'**\n▔▔▔▔▔▔▔▔▔▔▔')
                   .addField('Option 1', '👍 Yes')
                   .addField('Option 2', '👎 No')
                   .setColor("YELLOW")
                   .setTimestamp()
             
                    message.channel.send(embed) 
                    .then(m => 
                    {
                        m.react("👍");
                        m.react("👎");
                    });
            }
        }
    });
})

	
client.login(config.token);
