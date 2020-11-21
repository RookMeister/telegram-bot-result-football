const { settingsKeyboard } = require('../utils/keyBoards');
const User = require('../models/user');

function setupSettings(bot) {
  bot.hears('Настройки', (ctx) => showSettings(ctx));
  // bot.action('Вчера', (ctx) => getMatches(ctx, 'prev', true));
  // bot.action('Сегодня', (ctx) => getMatches(ctx, 'now', true));
  // bot.action('Завтра', (ctx) => getMatches(ctx, 'next', true));
}

function showSettings(ctx) {
  const options = settingsKeyboard;
  const info = 'Здесь вы можете выбрать часовой пояс и изменить свои подписки.';
  ctx.replyWithHTML(info, options);
}

// async function showSettings(ctx) {
//   const user = await User.findOne({chat_id: ctx.chat.id}).exec();
//   const data = await getData('championat', { date, subscriptions: user.subscriptions });
//   const options = footballScoresKeyBoardInline;
//   const info = dataConversionChampionat(data);
//   options.parse_mode = 'HTML';
//   if (editMessage) {
//     ctx.editMessageText(info, options);
//   } else {
//     ctx.replyWithHTML(info, options);
//   }
// }

// Exports
module.exports = {
  setupMatches,
}