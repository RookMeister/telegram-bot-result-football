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
  bot.hears('О боте', (ctx) => about(ctx));
}

function showSettings(ctx) {
  const options = settingsKeyboard;
  const info = 'Здесь вы можете выбрать часовой пояс и узнать на какие пуши вы подписаны';
  ctx.replyWithHTML(info, options);
}

async function subscribes(ctx) {
  const user = ctx.session.user;
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

function about(ctx) {
  ctx.replyWithHTML('Я создан чтобы пользователи могли быстро и удобно узнать результаты футбольных матчей. Если есть какие то проблемы, недостатки или пожелания, то мой создатель готов выслушать вас @Rookmeister. \n Если я вам полезен, то можно сделать <a href="https://sobe.ru/na/rookmeister">пожертвование</a>.', {disable_web_page_preview: true});
}

// Exports
module.exports = {
  setupSettings,
}