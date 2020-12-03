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
  console.log(err, 'bot.catch')
})

// Start bot
function startBot() {
  bot.startPolling()
}

function startMiddelware() {
  bot.use(Session());
  bot.use(async (ctx, next) => {
    await User.findOne({chat_id: ctx.chat.id}, async function (err, data) {
      if (err) return console.log(err);
      if (data) {
        if (!data.username) {
          data.username = ctx.chat.username || ctx.chat.first_name || null;
          await data.save(function(err) {
            if(err) return console.log('startMiddelware', err);
          })
        };
        if (!data.subscribeTournaments) {
          await data.save(function(err) {
            if(err) return console.log('startMiddelware', err);
          })
        };
        ctx.session.user = data;
      } else {
        const user = new User({
          username: ctx.chat.username || ctx.chat.first_name || null,
          chat_id: ctx.chat.id,
        });
        await user.save(function(err) {
          if(err) return console.log('startMiddelware', err);
          console.log(`Сохранен пользователь ${ctx.chat}`);
          ctx.session.user = user;
        })
      }
    });
    await next()
  })
}

// Export bot
module.exports = { bot, startBot, startMiddelware }