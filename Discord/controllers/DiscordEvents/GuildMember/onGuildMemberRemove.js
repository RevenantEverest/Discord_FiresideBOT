const Discord = require('discord.js');

const currencyController = require('../../currencyController');

const logSettingsDB = require('../../../models/GuildModels/guildLogSettingsDB');

const pgp = require('pg-promise')();
const QRE = pgp.errors.QueryResultError;
const qrec = pgp.errors.queryResultErrorCode;

module.exports = async (bot, member) => {
    currencyController.removeCurrencyRecord(bot, member);
    if(member.user.bot) return;

    let audit = await bot.guilds.get(member.guild.id).fetchAuditLogs();
    audit = audit.entries.array()[0];

    logSettingsDB.findByGuildId(member.guild.id)
    .then(settings => {
        if(!settings.enabled) return;

        let embed = new Discord.RichEmbed();

        if(audit.action === "MEMBER_KICK") {
            embed
            .setAuthor(
                `Member Kicked by ${audit.executor.username}#${audit.executor.discriminator}`, 
                `https://cdn.discordapp.com/avatars/${audit.executor.id}/${audit.executor.avatar}.png?size=2048`
            )
            if(audit.reason)
                embed.setDescription(`**Reason**: ${audit.reason}`)
        }
        else embed.setTitle(`Member Leave`)

        embed
        .setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=2048`)
        .setColor(0xff0000)
        .setTitle(`${member.user.username}#${member.user.discriminator}`)
        .setFooter(`ID: ${member.user.id}`)

        bot.channels.get(settings.channel_id).send(embed);
    })
    .catch(err => {
        if(err instanceof QRE && err.code === qrec.noData) return;
        else console.error(err);
    })
};