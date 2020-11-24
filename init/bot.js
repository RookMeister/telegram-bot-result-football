const Telegraf = require('telegraf');
const Session = require('telegraf/session');
const User = require('../models/user');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Get bot's username
bot.telegram.getMe().then(info => {
  console.log(info)
  bot.options.username = info.username
}).catch(console.info);

// Bot catch
bot.catch(err => {
  console.log(err)
  report(bot, err, 'bot.catch')
})

// Start bot
function startBot() {
  bot.startPolling()
}

function startMiddelware() {
  bot.use(Session());
  bot.use(async (ctx, next) => {
    const user = await User.findOne({chat_id: ctx.chat.id}).exec();
    ctx.session.user = user;
    await next()
  })
}

// Export bot
module.exports = { bot, startBot, startMiddelware }