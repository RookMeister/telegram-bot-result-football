const { footballScoresKeyBoardInline } = require('../helpers/keyBoards');
const returnDate = require('../helpers/date');
const { getDataChampionat } = require('../helpers/function')

function setupMatches(bot) {
  bot.hears('Матч-центр', (ctx) => getMatches(ctx));
  bot.action('Вчера', (ctx) => getMatches(ctx, returnDate('prev')));
  bot.action('Сегодня', (ctx) => getMatches(ctx, returnDate('now')));
  bot.action('Завтра', (ctx) => getMatches(ctx, returnDate('next')));
}

async function getMatches(ctx, date) {
  const info = await getDataChampionat(date ? date : returnDate('now'), ctx.chat.id);
  const options = footballScoresKeyBoardInline;
  options.parse_mode = 'HTML';
  if (date) {
    ctx.editMessageText(info, options);
  } else {
    ctx.replyWithHTML(info, options);
  }
}

// Exports
module.exports = {
  setupMatches,
}