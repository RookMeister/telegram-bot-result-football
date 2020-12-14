const { getData } = require('../helpers/api')
const { getDataMatches, conversionDataMatches, getInfoForLike } = require('../helpers/matches')
const { findAllUsers } = require('../models/user');

let isSend = false;

const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

async function startScheduler(bot) {
  setInterval(async () => {
    const users = await findAllUsers();
    if (users.length && !isSend) {
      for (const el of users) {
        if (el.onScheduler || el.likeClub.length) {
          const json = await getData('matches', { date: 'prev' });
          let info = null;
          if (el.onScheduler) {
            info = getMatches({json, subscriptions: el.subscribeTournaments, timeZone: Number(el.timeZone), checkEnd: true});
            // info && await sendMessage(bot.telegram, el.chat_id, info);
            // isSend = (info) ? true : false;
          }
          if (el.likeClub.length) {
            info = getInfoForLike({data: json, likeClubs: el.likeClub, timeZone: Number(el.timeZone) })
            info && await sendMessage(bot.telegram, el.chat_id, info);
          }
        }
      };
    }
  }, 5000);
}

function getMatches({json, subscriptions, timeZone, checkEnd}) {
  const data = getDataMatches({data: json, subscriptions, timeZone, checkEnd});
  const info = conversionDataMatches(data);
  return (info === 'Нет подходящих матчей') ? null : info;
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