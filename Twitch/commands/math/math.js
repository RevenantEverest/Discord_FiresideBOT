function RNG(num) {
  return Math.floor(Math.random() * num);
}

module.exports = {
  randomMath(channel, userstate, message, args, self, bot) {
    if(!args[1] || !args[2]) return bot.say(channel, "Need 2 numbers for math");
    if(RNG(3) === 1) return bot.say(channel, `${args[1]} + ${args[2]} = ${(parseInt(args[1], 10) + parseInt(args[2], 10))}`);
    if(RNG(3) === 2) return bot.say(channel, `${args[1]} * ${args[2]} = ${(parseInt(args[1], 10) * parseInt(args[2], 10))}`);
    if(RNG(3) === 3) return bot.say(channel, `${args[1]} / ${args[2]} = ${(parseInt(args[1], 10) / parseInt(args[2], 10))}`);
  }
}