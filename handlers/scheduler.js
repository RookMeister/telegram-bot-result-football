const { getData } = require('../helpers/api')
const { getDataMatches, conversionDataMatches, getInfoForLike } = require('../helpers/matches')
const { findAllUsers } = require('../models/user');
const { deleteKBInline } = require('../helpers/keyboards');

const { UserModel } = require('../models/user');

const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

async function startScheduler(bot) {
  setInterval(async () => {
    const users = await findAllUsers();
    if (users.length) {
      for (let [i, user] of users.entries()) {
        if (user.onScheduler || user.likeClub.length) {
          const json = await getData('matches', { date: 'now' });
          if (user.onScheduler) {
            const info = getMatches({json, subscriptions: user.subscribeTournaments, timeZone: Number(user.timeZone), checkEnd: true});
            info && !user.isSendMatches && await sendMessage(bot.telegram, user.chat_id, info);
            const data = info ? { isSendMatches: true } : { isSendMatches: false };
            if (user.isSendMatches !== data.isSendMatches) {
              await UserModel.findOneAndUpdate({chat_id: user.chat_id}, { $set: data }, function (err, data) {
                if (err) return console.log(err);
              });
            }
          }
          if (user.likeClub.length) {
            const info = getInfoForLike({data: json, likeClubs: user.likeClub, timeZone: Number(user.timeZone)})
            const nowDate = new Date();
            nowDate.setHours(nowDate.getHours() + Number(user.timeZone))
            const condition = (nowDate.getHours()) === 10 ? true : (info && info.includes('Результат')) ? true : false;
            condition && !user.isSendLikeClub && await sendMessage(bot.telegram, user.chat_id, info);
            const data = condition ? { isSendLikeClub: true } : { isSendLikeClub: false };
            if (user.isSendLikeClub !== data.isSendLikeClub) {
              await UserModel.findOneAndUpdate({chat_id: user.chat_id}, { $set: data }, function (err, data) {
                if (err) return console.log(err);
              });
            }
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
    const options = deleteKBInline;
    options.disable_web_page_preview = true;
    options.parse_mode = 'html';
    console.log('sendMessage',!!info, chatId);
    ctx.sendMessage(chatId, info, options)
  } catch (e) {
    console.error('sendMessage', e);
  }
}

// Export bot
module.exports = { startScheduler }