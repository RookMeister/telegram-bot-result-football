const {
  unSubscribeKBInline,
  subscribeKBInline,
  viewSubscribeKBInline,
  backToKBInline,
} = require('../helpers/keyboards');

const { showSettings } = require('../helpers/backToSettings');

function setupSettings(bot) {
  bot.hears('Настройки', (ctx) => showSettings(ctx));
  bot.hears('Settings', (ctx) => showSettings(ctx));
  bot.action('Рассылки', (ctx) => subscribesList(ctx));
  bot.action('Mailings', (ctx) => subscribesList(ctx));
  bot.action('Подписки', (ctx) => selectSubcribeView(ctx));
  bot.action('Subscriptions', (ctx) => selectSubcribeView(ctx));
  bot.action('🔙Назад к настройкам', (ctx) => showSettings(ctx, true));
  bot.action('🔙Back to settings', (ctx) => showSettings(ctx, true));
  bot.action('❌ Удалить', (ctx) => deleteMess(ctx));
  bot.action('❌ Delete', (ctx) => deleteMess(ctx));
  bot.action('О боте', (ctx) => about(ctx));
  bot.action('About the bot', (ctx) => about(ctx));
}

function selectSubcribeView(ctx) {
  const options = viewSubscribeKBInline;
  const info = ctx.i18n.t('titleSubscriptions');
  ctx.editMessageText(info, options);
}

function deleteMess(ctx) {
  ctx.deleteMessage();
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
  ctx.editMessageText(ctx.i18n.t('aboutTheBot'), options);
}

// Exports
module.exports = {
  setupSettings,
}