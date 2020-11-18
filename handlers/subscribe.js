const User = require('../models/user');
const { mainKeyboard } = require('../utils/keyBoards');

function setupSubscribe(bot) {
  bot.action('✔Подписаться', (ctx) => isSubscribe(ctx, true));
  bot.action('✖Отписаться', (ctx) => isSubscribe(ctx, false));
}

function isSubscribe(ctx, isSubscribe) {
  let string = '';
  if (isSubscribe) {
    console.log(1);
    string = 'Теперь раз в сутки, после окнчания матчей, вам будет приходить пуш с результатами тех чемпионатов на которые вы подписаны. Список можно посмотреть в настройках.'
    User.findOneAndUpdate({chat_id: ctx.chat.id}, {onScheduler: true});
  } else {
    console.log(2);
    string = 'Ты всегда можешь подписаться в Настройках';
    User.findOneAndUpdate({chat_id: ctx.chat.id}, {onScheduler: false});
  }
  ctx.answerCbQuery(string, true);
  const options = mainKeyboard;
  ctx.deleteMessage(ctx.update.callback_query.message.message_id)
  ctx.replyWithHTML('Выберите раздел в меню', options);
}

// Exports
module.exports = {
  setupSubscribe,
}