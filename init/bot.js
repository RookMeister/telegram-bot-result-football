const Telegraf = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');
const Session = require('telegraf/session');
const { findUser } = require('../models/user');
const { stage } = require('./scene');
const path = require('path')

const i18n = new TelegrafI18n({
  directory: path.resolve(__dirname, '../locales'),
  defaultLanguage: 'ru',
  sessionName: 'session',
  useSession: true,
  // templateData: {
  //   pluralize: I18n.pluralize,
  //   uppercase: (value) => value.toUpperCase()
  // }
})

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
  bot.use(i18n.middleware())
  bot.use(stage.middleware());
  bot.use(async (ctx, next) => {
    const username = ctx.chat.username || ctx.chat.first_name || null;
    const dbuser = await findUser({id: ctx.chat.id, username});
    ctx.session.user = dbuser;
    await next()
  })
}

// Export bot
module.exports = { bot, startBot, startMiddelware }