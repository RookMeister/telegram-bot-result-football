const { settingsKeyboard } = require('../utils/keyBoards');
const { arrayToString } = require('../utils/helpers')
const User = require('../models/user');

function setupSettings(bot) {
  bot.hears('Настройки', (ctx) => showSettings(ctx));
  bot.hears('Подписки', (ctx) => showSubscribes(ctx));
}

function showSettings(ctx) {
  const options = settingsKeyboard;
  const info = 'Здесь вы можете выбрать часовой пояс и изменить свои подписки.';
  ctx.replyWithHTML(info, options);
}

async function showSubscribes(ctx) {
  const user = await User.findOne({chat_id: ctx.chat.id}).exec();
  const info = arrayToString(user.subscriptions);
  ctx.replyWithHTML(info);
}

// Exports
module.exports = {
  setupSettings,
}