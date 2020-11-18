const { getData } = require('../utils/helpers')
const { dataConversionChampionat } = require('../utils/helpers')
const User = require('../models/user');

async function startScheduler(bot) {
  let isSend = false;
  setInterval(async () => {
    const users = await User.find({});
    if (users.length) {
      users.forEach(async (el) => {
        const data = await getData('championat', { date: 'now', check: true });
        let info = dataConversionChampionat(data, el.subscriptions);
        info = (info === 'Нет подходящих матчей') ? '' : info;
        if (info && !isSend) {
          sendMessage(bot.telegram, el.chat_id, info);
          isSend = true;
        } else if (!info) {
          isSend = false;
        }
      });
    }
  }, 600000);
}


async function sendMessage(ctx, chatId, info) {
  try {
    ctx.sendMessage(chatId, info, {parse_mode: 'html'})
  } catch (e) {
    console.error(e);
  }
}

// Export bot
module.exports = { startScheduler }