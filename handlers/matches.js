const { footballScoresKeyBoardInline } = require('../utils/keyBoards');
const { getData } = require('../utils/helpers')

function setupMatches(bot) {
  bot.hears('Матч-центр', (ctx) => getMatches(ctx, 'now'));
  bot.action('Вчера', (ctx) => getMatches(ctx, 'prev', true));
  bot.action('Сегодня', (ctx) => getMatches(ctx, 'now', true));
  bot.action('Завтра', (ctx) => getMatches(ctx, 'next', true));
}

async function getMatches(ctx, date, editMessage) {
  const info = await getData('championat', { date });
  const options = footballScoresKeyBoardInline;
  options.parse_mode = 'HTML';
  if (editMessage) {
    // ctx.editMessageText(info, options);
  } else {
    // ctx.replyWithHTML(info, options);
  }
}

// Exports
module.exports = {
  setupMatches,
}