const User = require('../models/user');
const { mainKeyboard } = require('../utils/keyBoards');

function setupSubscribe(bot) {
  bot.action('✔Подписаться', (ctx) => isSubscribe(ctx, true));
  bot.action('✖Отписаться', (ctx) => isSubscribe(ctx));
}

async function isSubscribe(ctx, isSubscribe = false) {
  let string = 'Ты всегда можешь подписаться в Настройках';
  if (isSubscribe) {
    string = 'Теперь после окончания матчей, вам будет приходить пуш с результатами матчей. Отписаться можно в настройках';
    await User.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { onScheduler: true } }, function (err, data) {
      if (err) return console.log(err);
    });
  } else {
    await User.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { onScheduler: false } }, function (err, data) {
      if (err) return console.log(err);
    });
  }
  ctx.answerCbQuery(string, true);
  const options = mainKeyboard;
  // ctx.deleteMessage(ctx.update.callback_query.message.message_id)
  ctx.replyWithHTML('Выберите раздел в меню', options);
}

// Exports
module.exports = {
  setupSubscribe,
}