const Telegraf = require('telegraf');
const Session = require('telegraf/session');
const { findUser } = require('../models/user');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Get bot's username
bot.telegram.getMe().then(info => {
  console.log(info)
  bot.options.username = info.username
}).catch(console.info);

// Bot catch
bot.catch(err => {
  console.log(err, 'bot.catch')
})

// Start bot
function startBot() {
  bot.startPolling()
}

function startMiddelware() {
  bot.use(Session());
  bot.use(async (ctx, next) => {
    const username = ctx.chat.username || ctx.chat.first_name || null;
    const dbuser = await findUser({id: ctx.chat.id, username});
    ctx.session.user = dbuser;
    await next()
  })
}

// Export bot
module.exports = { bot, startBot, startMiddelware }