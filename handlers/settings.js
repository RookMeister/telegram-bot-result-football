const { 
  mainKeyboard,
  settingsKeyboard,
  subscribeAnswerKeyBoardInline,
  unSubscribeAnswerKeyBoardInline
} = require('../utils/keyBoards');
const User = require('../models/user');

function setupSettings(bot) {
  bot.hears('Настройки', (ctx) => showSettings(ctx));
  bot.hears('Подписки', (ctx) => subscribes(ctx));
  bot.hears('🔙Назад', (ctx) => goBack(ctx));
}

function showSettings(ctx) {
  const options = settingsKeyboard;
  const info = 'Здесь вы можете выбрать часовой пояс и узнать на какие пуши вы подписаны';
  ctx.replyWithHTML(info, options);
}

async function subscribes(ctx) {
  const user = await User.findOne({chat_id: ctx.chat.id}).exec();
  let info;
  let options;
  if (user && user.onScheduler) {
    info = 'Вы уверены, что хотите отписаться?'
    options = unSubscribeAnswerKeyBoardInline;
  } else {
    info = 'После подписки бот будет вам отправлять пуш с результатами матчей.'
    options = subscribeAnswerKeyBoardInline
  }
  ctx.replyWithHTML(info, options);
}

function goBack(ctx) {
  const options = mainKeyboard;
  ctx.replyWithHTML('Перехожу в главное меню', options);
}

// Exports
module.exports = {
  setupSettings,
}