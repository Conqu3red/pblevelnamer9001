//dependencies
const Discord = require('discord.js');
const { Client, Intents } = Discord;
const { token } = require('./config.json');
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);
const client = new Client({ intents: myIntents });
const functions = require("./functions");

//level images : TODO

//Holds the world names for PB1 and PB2
const pb1_world_names = ["Alpine Meadows", "Desert Winds", "Snow Drift", "Ancient Ruins", "80s Fun Land", "Zen Gardens", "Tropical Paradise", "Area 52"];
const pb2_world_names = ["Pine Mountains", "Glowing Gorge", "Tranquil Oasis", "Sanguine Gulch", "Serenity Valley", "Steamtown", "N/A", "N/A"];


console.log('Bot started...')
client.once('ready', () => {
    console.log('Bot is now online.')
});


//creates the help embed
const helpEmbed = new Discord.MessageEmbed()
.setColor('#f26711')
.setTitle('Poly Bridge Level Namer Help')
.setThumbnail('https://i.imgur.com/vz8gnvi.jpg')
.setDescription("Detects level numbers and provides level names.")
.addFields(
    { name: 'Level Syntax', value: 'World-Level (e.g. 1-01, 1-1, 1-01c, 1-1c)' },
    { name: 'Info', value: 'The bot does not require a prefix and will detect any level number in a message.' }
)
.setTimestamp()
.setFooter('Made by Masonator, ham, ashduino101, and Conqu3red', 'https://i.imgur.com/vz8gnvi.jpg');


//checks for messages
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    //sends help embed
    if(message.content.startsWith("?help")){
        message.channel.send({ embeds: [helpEmbed] });
        return;
    }
    
    for (const match of functions.removeLinks(message.content).matchAll(/\b([0-9]{1,2})-([0-9]{1,2})([Cc]?)\b/g)){
        // Loop through all potential candidates for level names, stop if one is found that is valid
        let short_name = new functions.ShortName(match[0]);
        var matching_pb2_levels = functions.pb2_levels.filter(level => level["short_name"].isSame(short_name));
        var matching_pb1_levels = functions.pb1_levels.filter(level => level["short_name"].isSame(short_name));
        
        if (matching_pb2_levels.length == 0 && matching_pb1_levels.length == 0) continue;
        
        let rv = `Level Names for \`${short_name}\`\n`;
        
        if (matching_pb1_levels.length > 0 && !short_name.is_challenge_level){
            rv += `PB1: ${pb1_world_names[short_name.world - 1]} ~ ${matching_pb1_levels[0]["name"]}\n`;
        }
        if (matching_pb2_levels.length > 0){
            rv += `PB2: ${pb2_world_names[short_name.world - 1]} ~ ${matching_pb2_levels[0]["name"]}`;
            if (short_name.is_challenge_level)
                rv += `\nChallenge: ${matching_pb2_levels[0]["challenge_description"]}`;
        }
        message.channel.send(rv);
        return;
    }
})

// logs in the bot (must be last)
client.login(token)
