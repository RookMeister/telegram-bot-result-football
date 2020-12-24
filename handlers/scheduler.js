const { getData } = require('../helpers/api')
const { getDataMatches, conversionDataMatches, getInfoForLike } = require('../helpers/matches')
const { findAllUsers } = require('../models/user');




const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

async function startScheduler(bot) {
  const users = await findAllUsers();
  const isSend = Array(users.length).fill(false);
  const isSendClubs = Array(users.length).fill(false);

  setInterval(async () => {
    const users = await findAllUsers();
    if (users.length) {
      for (let [i, el] of users.entries()) {
        if (el.onScheduler || el.likeClub.length) {
          const json = await getData('matches', { date: 'now' });
          if (el.onScheduler) {
            const info = getMatches({data: json, subscriptions: el.subscribeTournaments, timeZone: Number(el.timeZone), checkEnd: true});
            info && !isSend[i] && await sendMessage(bot.telegram, el.chat_id, info);
            isSend[i] = (info) ? true : false;
          }
          if (el.likeClub.length) {
            const info = getInfoForLike({data: json, likeClubs: el.likeClub, timeZone: Number(el.timeZone)})
            const condition = info && info.includes('приблизительно через 10');
            condition && !isSendClubs[i] && await sendMessage(bot.telegram, el.chat_id, info);
            isSendClubs[i] = (condition) ? true : false;
          }
        }
      };
    }
  }, 60000);
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