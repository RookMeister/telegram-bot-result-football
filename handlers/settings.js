const {
  unSubscribeKBInline,
  subscribeKBInline,
  viewSubscribeKBInline,
  backToKBInline,
} = require('../helpers/keyboards');

const { showSettings } = require('../helpers/backToSettings');

function setupSettings(bot) {
  bot.hears('Настройки', (ctx) => showSettings(ctx));
  bot.action('Рассылки', (ctx) => subscribesList(ctx));
  bot.action('Подписки', (ctx) => selectSubcribeView(ctx));
  bot.action('🔙Назад к настройкам', (ctx) => showSettings(ctx, true));
  bot.action('О боте', (ctx) => about(ctx));
}

function selectSubcribeView(ctx) {
  const options = viewSubscribeKBInline;
  const info = 'Выберите вид пописки.';
  ctx.editMessageText(info, options);
}

function subscribesList(ctx) {
  const user = ctx.session.user;
  const info = (user && user.onScheduler)
                ? 'Вы уверены, что хотите отписаться от еженедельной подписки?'
                : 'После подписки бот будет вам отправлять пуш с результатами матчей.';
  const options = (user && user.onScheduler) ? unSubscribeKBInline : subscribeKBInline;
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