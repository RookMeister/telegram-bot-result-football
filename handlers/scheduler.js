const { getData } = require('../helpers/api')
const { getDataMatches, conversionDataMatches } = require('../helpers/matches')
const { findAllUsers } = require('../models/user');

let isSend = false;

const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

async function startScheduler(bot) {
  setInterval(async () => {
    const users = await findAllUsers();
    if (users.length && !isSend) {
      for (const el of users) {
        if (el.onScheduler) {
          const json = await getData('matches', { date: 'now' });
          const data = getDataMatches({data: json, subscriptions: el.subscribeTournaments, timeZone: Number(el.timeZone), checkEnd: true});
          let info = conversionDataMatches(data);
          info = (info === 'Нет подходящих матчей') ? '' : info;
          if (info) {
            await sendMessage(bot.telegram, el.chat_id, info);
            isSend = true;
          } else if (!data) {
            isSend = false;
          }
        }
      };
    }
  }, 60000);
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