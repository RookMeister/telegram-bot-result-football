const User = require('../models/user');
const { mainKeyboard } = require('../utils/keyBoards');

function setupSubscribe(bot) {
  bot.action('✔Подписаться', (ctx) => isSubscribe(ctx, true));
  bot.action('✖Отказаться', (ctx) => isSubscribe(ctx));
  bot.hears(new RegExp('/\\d'), (ctx) => deleteSubscribe(ctx));
}

function isSubscribe(ctx, isSubscribe = false) {
  let string = 'Ты всегда можешь подписаться в Настройках';
  if (isSubscribe) {
    string = 'Теперь раз в сутки, после окончания матчей, вам будет приходить пуш с результатами тех чемпионатов на которые вы подписаны. Список можно посмотреть в настройках.';
    User.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { onScheduler: true } }, function (err, data) {
      if (err) return console.log(err);
    });
  }
  ctx.answerCbQuery(string, true);
  const options = mainKeyboard;
  // ctx.deleteMessage(ctx.update.callback_query.message.message_id)
  ctx.replyWithHTML('Выберите раздел в меню', options);
}

function deleteSubscribe(ctx) {
  User.findOneAndUpdate({chat_id: ctx.chat.id}, { $pull: { subscriptions:  } }, function (err, data) {
    console.log(data)
    if (err) return console.log(err);
  });
  // ctx.replyWithHTML(`Подписка ${idSubscribe} удалена!`);
}

// Exports
module.exports = {
  setupSubscribe,
}