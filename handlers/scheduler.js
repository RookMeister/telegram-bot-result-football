const { getData } = require('../utils/helpers')
const { dataConversionChampionat } = require('../utils/helpers')
const User = require('../models/user');

let isSend = false;

const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

async function startScheduler(bot) {
  setInterval(async () => {
    const users = await User.find({});
    if (users.length && !isSend) {
      for (const el of users) {
        const data = await getData('championat', { date: 'now', subscriptions: el.subscriptions, check: true, timeZone: Number(el.timeZone) });
        let info = dataConversionChampionat(data);
        info = (info === 'Нет подходящих матчей') ? '' : info;
        if (info && el.onScheduler) {
          await sendMessage(bot.telegram, el.chat_id, info);
          isSend = true;
        } else if (!data) {
          isSend = false;
        }
      };
    }
  }, 5000000);
}

async function sendMessage(ctx, chatId, info) {
  try {
    await timeoutPromise(300);
    console.log('sendMessage',!!info, chatId);
    ctx.sendMessage(chatId, info, {parse_mode: 'html', disable_web_page_preview: true})
  } catch (e) {
    console.error('sendMessage', e);
  }
}

// Export bot
module.exports = { startScheduler }