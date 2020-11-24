const { getData } = require('../utils/helpers')
const { dataConversionChampionat } = require('../utils/helpers')
const User = require('../models/user');

let isSend = false;

async function startScheduler(bot) {
  setInterval(async () => {
    const users = await User.find({});
    if (users.length && !isSend) {
      users.forEach(async (el) => {
        const data = await getData('championat', { date: 'now', subscriptions: el.subscriptions, check: true });
        let info = dataConversionChampionat(data);
        info = (info === 'Нет подходящих матчей') ? '' : info;
        if (info && el.onScheduler) {
          sendMessage(bot.telegram, el.chat_id, info);
          isSend = true;
        } else if (!data) {
          isSend = false;
        }
      });
    }
  }, 600000);
}


async function sendMessage(ctx, chatId, info) {
  try {
    console.log('sendMessage',!!info, chatId);
    ctx.sendMessage(chatId, info, {parse_mode: 'html'})
  } catch (e) {
    console.error(e);
  }
}

// Export bot
module.exports = { startScheduler }