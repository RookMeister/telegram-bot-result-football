const { footballScoresKeyBoardInline } = require('../utils/keyBoards');
const { getData } = require('../utils/helpers')
const { dataConversionChampionat } = require('../utils/helpers')

function setupMatches(bot) {
  bot.hears('Матч-центр', (ctx) => getMatches(ctx, 'now'));
  bot.action('Вчера', (ctx) => getMatches(ctx, 'prev', true));
  bot.action('Сегодня', (ctx) => getMatches(ctx, 'now', true));
  bot.action('Завтра', (ctx) => getMatches(ctx, 'next', true));
}

async function getMatches(ctx, date, editMessage) {
  const userData = ctx.session.user;
  const data = await getData('championat', { date, timeZone: Number(userData.timeZone), tournaments: userData.subscribeTournaments });
  const options = footballScoresKeyBoardInline;
  options.disable_web_page_preview = true;
  const info = dataConversionChampionat(data);
  if (editMessage) {
    options.parse_mode = 'HTML';
    ctx.editMessageText(info, options);
  } else {
    ctx.replyWithHTML(info, options);
  }
}

// Exports
module.exports = {
  setupMatches,
}