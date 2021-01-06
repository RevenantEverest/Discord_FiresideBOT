const Discord = require('discord.js');
const character = require('../utils/test').character;
const enemies = require('../utils/test').enemies;

module.exports.run = async (PREFIX, message, args, server, bot, options, userstate) => {
    
};

module.exports.config = {
    name: 'fight',
    d_name: 'Fight',
    aliases: [],
    category: 'Acirhia',
    desc: 'Begin a random encounter for an enemy in the current area',
    example: 'fight'
};