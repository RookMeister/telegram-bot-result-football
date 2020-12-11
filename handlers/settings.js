const {
  settingsKBInline,
  unSubscribeKBInline,
  subscribeKBInline,
  viewSubscribeKBInline,
  backToKBInline,
} = require('../helpers/keyboards');
const { tournamentsButtons} = require('../helpers/tornaments');
const { UserModel } = require('../models/user');

function setupSettings(bot) {
  bot.hears('Настройки', (ctx) => showSettings(ctx));
  bot.action('Рассылки', (ctx) => subscribesList(ctx));
  bot.action('Подписки', (ctx) => selectSubcribeView(ctx));
  bot.action('Турниры', (ctx) => paginationSubscribe(ctx, 1));
  bot.action('Клубы', (ctx) => subscribesClubs(ctx));
  bot.action('🔙Назад к настройкам', (ctx) => showSettings(ctx, true));
  bot.action('О боте', (ctx) => about(ctx));
  bot.on('callback_query', (ctx) => callbackQuery(ctx));
}

function selectSubcribeView(ctx) {
  const options = viewSubscribeKBInline;
  const info = 'Выберите вид пописки.';
  ctx.editMessageText(info, options);
}

function subscribesClubs(ctx) {
  ctx.answerCbQuery('Скоро');
}

async function callbackQuery(ctx) {
  userTornaments = [];
  const query = ctx.callbackQuery.data;
  const re = new RegExp('✅|🚫');
  if (re.test(query)) {
    let info = '';
    const isReg = new RegExp('✅');
    const notIsReg = new RegExp('🚫');
    const val = query.replace(re, '').trim();
    if (notIsReg.test(query)) {
      const data = await UserModel.findOneAndUpdate({chat_id: ctx.chat.id}, { $addToSet : { subscribeTournaments: val }}, { new: true } );
      userTornaments = data.subscribeTournaments;
      info = 'Подписался';
    } else if (isReg.test(query)) {
      const data = await UserModel.findOneAndUpdate({chat_id: ctx.chat.id}, { $pull : { subscribeTournaments: val }}, { new: true });
      userTornaments = data.subscribeTournaments;
      info = 'Отписался';
    }
    const current = ctx.session.currentPage || 1;
    await ctx.answerCbQuery(info);
    const options = await tournamentsButtons({current, userTornaments})
    ctx.editMessageReplyMarkup(options.reply_markup);
  } else {
    paginationSubscribe(ctx);
  }
}

async function paginationSubscribe(ctx, curentPage) {
  const userTornaments = ctx.session.user.subscribeTournaments;
  const current = curentPage || parseInt(ctx.callbackQuery.data.match(/\d+/))
  ctx.session.currentPage = current;
  const options = await tournamentsButtons({current, userTornaments})
  options.reply_markup.inline_keyboard.push(backToKBInline.reply_markup.inline_keyboard[0]);
  const info = `Страница №${current}`;
  ctx.editMessageText(info, options);
}

function showSettings(ctx, editMessage = false) {
  const options = settingsKBInline;
  const info = 'Здесь вы можете выбрать часовой пояс и узнать на какие пуши вы подписаны';
  editMessage ? ctx.editMessageText(info, options) : ctx.replyWithHTML(info, options);
}

function subscribesList(ctx) {
  const user = ctx.session.user;
  let info;
  let options;
  if (user && user.onScheduler) {
    info = 'Вы уверены, что хотите отписаться от еженедельной подписки?'
    options = unSubscribeKBInline;
  } else {
    info = 'После подписки бот будет вам отправлять пуш с результатами матчей.'
    options = subscribeKBInline
  }
  ctx.editMessageText(info, options);
}

function about(ctx) {
  const options = backToKBInline;
  options.parse_mode = 'HTML';
  options.disable_web_page_preview = true;
  ctx.editMessageText('Я создан чтобы пользователи могли быстро и удобно узнать результаты футбольных матчей. Если есть какие то проблемы, недостатки или пожелания, то мой создатель готов выслушать вас @Rookmeister.Если я вам полезен, то можно сделать <a href="https://sobe.ru/na/rookmeister">пожертвование</a>.', options);
}

// Exports
module.exports = {
  setupSettings,
}