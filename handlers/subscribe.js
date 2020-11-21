const User = require('../models/user');
const { mainKeyboard } = require('../utils/keyBoards');

function setupSubscribe(bot) {
  bot.action('✔Подписаться', (ctx) => isSubscribe(ctx, true));
  bot.action('✖Отказаться', (ctx) => isSubscribe(ctx));
}

function isSubscribe(ctx, isSubscribe = false) {
  let string = 'Ты всегда можешь подписаться в Настройках';
  if (isSubscribe) {
    string = 'Теперь раз в сутки, после окончания матчей, вам будет приходить пуш с результатами тех чемпионатов на которые вы подписаны. Список можно посмотреть в настройках.'
    User.findOneAndUpdate({chat_id: ctx.chat.id}, { onScheduler: true });
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