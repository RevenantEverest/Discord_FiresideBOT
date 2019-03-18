const config = require('../../config/config');
const Discord = require('discord.js');
const logger = require('../services/loggerServices');

const guildsController = require('./guildsController');
const currencyController = require('./currencyController');
const activityController = require('./activityController');
const ticketsController = require('./ticketsController');

const guildsDB = require('../../models/GuildModels/guildsDB');

const BackUpCommands = require('../commands/BackUpCommands');

let PREFIX = '';
const services = {};


/*
    On Ready
*/
services.handleOnReady = async (bot) => {
    guildsController.checkGuilds(bot)
    activityController.handleActivity(bot);
    setInterval(() => {
        config.Discord_Options.users = 0;
        bot.guilds.array().forEach(el => config.Discord_Options.users += el.memberCount);
    }, 5000);
};

/*
    On Guild Create
*/
services.handleOnGuildCreate = async (bot, guild) => {
    guildsController.saveGuild(bot, guild);

    let embed = new Discord.RichEmbed();
    const channels = guild.channels.array();
    let welcome = { general: null, channels: null };

    embed
    .setColor(0x00ff00)
    .addField(
        'Thank you for adding FiresideBOT', 
        'Learn what you can do with `?help` command\n\n' +
        `If you're experiencing any issue please use our [Support Server](https://discord.gg/TqKHVUa)\n\n` +
        `And if FiresideBOT isn't meeting your expectations or you want to just leave a kind message you can tell us with the ` + "`?feedback` command"
    )
    .setTitle('Thank you for adding FiresideBOT')

    for(let i = 0; i < channels.length; i++) {
        if(channels[i].type !== 'text') continue;
        if(/^.*general.*$/i.test(channels[i].name)) {
            if(!welcome.general || channels[i].position < welcome.general.position)
                welcome.general = channels[i];
        }    
        else if(!welcome.channels || channels[i].position < welcome.channels.position)
            welcome.channels = channels[i];
    }

    welcome.general ? bot.channels.get(welcome.general.id).send(embed) : bot.channels.get(welcome.channels.id).send(embed);
};

/*
    On Guild Delete
*/
services.handleOnGuildDelete = async (bot, guild) => guildsController.removeGuild(bot, guild);

/*
    On Message
*/
services.handleOnMessage = async (bot, message) => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return ticketsController.handleTicket(bot, message);
    currencyController.handleCurrency(message);
        
    guildsDB.findPrefix(message.guild.id)
        .then(prefix => {
            PREFIX = prefix.prefix;

            BackUpCommands(PREFIX, message);

            if(!message.content.startsWith(PREFIX)) return;
            if(!config.servers.map(el => el.id).includes(message.guild.id)) config.servers.push({ 
                id: message.guild.id,
                queue: {
                    isPlaying: false,
                    isPaused: false,
                    queueInfo: [],
                    currentSongInfo: {},
                    currentSongEmbed: [],
                    genres: [],
                    options: {
                        volume: '50',
                        loop: false,
                        recommendations: false,
                        voteToSkip: false
                    }
                }
            });

            let args = message.content.substring(PREFIX.length).split(" ");
            let server = config.servers[config.servers.map(el => el.id).indexOf(message.guild.id)];
            let options = config.Discord_Options;

            let commandfile = bot.commands.get(args[0].toLowerCase()) || bot.commands.get(bot.aliases.get(args[0].toLowerCase()));
            if(commandfile) {
                commandfile.run(PREFIX, message, args, server, bot, options);
                if(process.env.ENVIRONMENT === "DEV") return;
                logger.commandLogger({ 
                    command: commandfile.config.d_name.toString(), args: args.join(" "), message: '', user_id: message.author.id, guild_id: message.guild.id
                });
            }
            
        })
        .catch(err => console.error(err));
};

/*
    On Member Add
*/
services.handleOnMemberAdd = async (bot, member) => {

};

/*
    On Member Update
*/
services.handleOnMemberUpdate = async (bot, oldMember, newMember) => {
    let data = {
        guild_id: oldMember.guild.id,
        oldMember: { user: oldMember.user, roles: oldMember._roles, nickname: oldMember.nickname },
        newMember: { user: newMember.user, roles: newMember._roles, nickname: newMember.nickname }
    };
    

    // console.log(data);
};

/*
    On Member Remove
*/
services.handleOnMemberRemove = async (bot, memeber) => {

};

/*
    On Error
*/
services.handleOnError = async (bot, err) => {
    if(process.env.ENVIRONMENT === "DEV") return;

    let embed = new Discord.RichEmbed();
    embed.setColor(0xff0000).setTitle("CLIENT ERROR").setFooter(await getDate());

    bot.channels.get("543862697742172179").send(embed);
};

module.exports = services;