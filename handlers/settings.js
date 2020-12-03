const {
  mainKeyboard,
  settingsKeyboard,
  subscribeAnswerKeyBoardInline,
  unSubscribeAnswerKeyBoardInline,
} = require('../utils/keyBoards');
const { getPaginationInfo } = require('../utils/helpers');
const User = require('../models/user');

function setupSettings(bot) {
  bot.hears('Настройки', (ctx) => showSettings(ctx));
  bot.hears('Рассылки', (ctx) => subscribesList(ctx));
  bot.hears('Подписки', (ctx) => paginationSubscribe(ctx, 1));
  bot.hears('🔙Назад', (ctx) => goBack(ctx));
  bot.hears('О боте', (ctx) => about(ctx));
  bot.on('callback_query', (ctx) => callbackQuery(ctx));
}

async function callbackQuery(ctx) {
  tornaments = [];
  const query = ctx.callbackQuery.data;
  const re = new RegExp('✅|🚫');
  if (re.test(query)) {
    let info = '';
    const isReg = new RegExp('✅');
    const notIsReg = new RegExp('🚫');
    const val = query.replace(re, '').trim();
    if (notIsReg.test(query)) {
      const data = await User.findOneAndUpdate({chat_id: ctx.chat.id}, { $addToSet : { subscribeTournaments: val }}, { new: true } );
      tornaments = data.subscribeTournaments;
      info = 'Подписался';
    } else if (isReg.test(query)) {
      const data = await User.findOneAndUpdate({chat_id: ctx.chat.id}, { $pull : { subscribeTournaments: val }}, { new: true });
      tornaments = data.subscribeTournaments;
      info = 'Отписался';
    }
    const current = ctx.session.currentPage || 1;
    await ctx.answerCbQuery(info);
    const options = await getPaginationInfo(current, 5, tornaments);
    ctx.editMessageReplyMarkup(options.reply_markup);
  } else {
    paginationSubscribe(ctx);
  }
}

async function paginationSubscribe(ctx, curentPage) {
  const tornaments = ctx.session.user.subscribeTournaments;
  const current = curentPage || parseInt(ctx.callbackQuery.data.match(/\d+/))
  ctx.session.currentPage = current;
  const options = await getPaginationInfo(current, 5, tornaments);
  const info = `Страница №${current}`;
  if (!curentPage) {
    ctx.editMessageText(info, options);
  } else {
    ctx.replyWithHTML(info, options);
  }
}

function showSettings(ctx) {
  const options = settingsKeyboard;
  const info = 'Здесь вы можете выбрать часовой пояс и узнать на какие пуши вы подписаны';
  ctx.replyWithHTML(info, options);
}

function subscribesList(ctx) {
  const user = ctx.session.user;
  let info;
  let options;
  if (user && user.onScheduler) {
    info = 'Вы уверены, что хотите отписаться от еженедельной подписки?'
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
  ctx.replyWithHTML('Я создан чтобы пользователи могли быстро и удобно узнать результаты футбольных матчей. Если есть какие то проблемы, недостатки или пожелания, то мой создатель готов выслушать вас @Rookmeister.Если я вам полезен, то можно сделать <a href="https://sobe.ru/na/rookmeister">пожертвование</a>.', {disable_web_page_preview: true});
}

// Exports
module.exports = {
  setupSettings,
}