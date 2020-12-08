const { footballScoresKeyBoardInline } = require('../utils/keyBoards');
const { getData } = require('../utils/helpers')
const { dataConversionChampionat, getDataChampionat } = require('../utils/helpers')

function setupMatches(bot) {
  bot.hears('Матч-центр', (ctx) => getMatches(ctx, 'now'));
  bot.action('Вчера', (ctx) => getMatches(ctx, 'prev', true));
  bot.action('Сегодня', (ctx) => getMatches(ctx, 'now', true));
  bot.action('Завтра', (ctx) => getMatches(ctx, 'next', true));
}

async function getMatches(ctx, date, editMessage) {
  if (ctx.session.date === date) {
    await ctx.answerCbQuery('Уже выведено');
    return;
  }
  ctx.session.date = date;
  const userData = ctx.session.user;
  const json = await getData('championat', { date });
  const data = getDataChampionat(json, userData.subscribeTournaments, Number(userData.timeZone), false);
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