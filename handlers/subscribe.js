const User = require('../models/user');
const { subscribeAnswerKeyBoardInline, unSubscribeAnswerKeyBoardInline } = require('../utils/keyBoards');

function setupSubscribe(bot) {
  bot.action('✔Подписаться', (ctx) => isSubscribe(ctx, true));
  bot.action('✖Отписаться', (ctx) => isSubscribe(ctx));
}

async function isSubscribe(ctx, isSubscribe = false) {
  let string = 'Ты всегда можешь подписаться';
  let keyboard = '';
  let info = '';
  if (isSubscribe) {
    info = 'Вы подписались';
    string = 'Теперь после окончания матчей, вам будет приходить пуш с результатами матчей.';
    await User.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { onScheduler: true } }, function (err, data) {
      if (err) return console.log(err);
    });
    keyboard = unSubscribeAnswerKeyBoardInline;
  } else {
    await User.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { onScheduler: false } }, function (err, data) {
      if (err) return console.log(err);
    });
    info = 'Вы отписались';
    keyboard = subscribeAnswerKeyBoardInline;
  }
  ctx.answerCbQuery(info, false);
  ctx.editMessageText(string, keyboard);
}

// Exports
module.exports = {
  setupSubscribe,
}