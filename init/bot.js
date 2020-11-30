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
    const userOld = await User.findOne({chat_id: ctx.chat.id}).exec();
    if (userOld) {
      if (!userOld.username) {
        userOld.username = ctx.chat.username || ctx.chat.first_name || null;
        await userOld.save(function(err) {
          if(err) return console.log(err);
        })
      }
      ctx.session.user = userOld;
    } else {
      const user = new User({
        username: ctx.chat.username || ctx.chat.first_name || null,
        chat_id: ctx.chat.id,
      });
      await user.save(function(err) {
        if(err) return console.log(err);
        console.log(`Сохранен пользователь ${ctx.chat}`);
        ctx.session.user = user;
      })
    }
    await next()
  })
}

// Export bot
module.exports = { bot, startBot, startMiddelware }