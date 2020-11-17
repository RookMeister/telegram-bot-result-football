const { footballScoresKeyBoardInline } = require('../utils/keyBoards');
const { getData } = require('../utils/helpers')

function setupMatches(bot) {
  bot.hears('Матч-центр', (ctx) => getMatches(ctx, 'now'));
  bot.action('Вчера', (ctx) => getMatches(ctx, 'prev', true));
  bot.action('Сегодня', (ctx) => getMatches(ctx, 'now', true));
  bot.action('Завтра', (ctx) => getMatches(ctx, 'next', true));
}

async function getMatches(ctx, date, editMessage) {
  const data = await getData('championat', { date });
  const options = footballScoresKeyBoardInline;
  const info = dataConversion(data, ctx.match.input);
  options.parse_mode = 'HTML';
  if (editMessage) {
    // ctx.editMessageText(info, options);
  } else {
    // ctx.replyWithHTML(info, options);
  }
}

function dataConversion(data, subscriptions) {
  try {
    if (!data && subscriptions.length)  return 'Ошибка';
    let string = '';
    data.forEach(el => {
      if (el.title) {
        string += `\r\n<i>${el.title}</i>\r\n\r\n`;
      } else if(subscriptions.includes(el.championat)) {
        string += `${el.firstTeam.name} \u2014 ${el.secondTeam.name} `;
        string += (el.result)
                    ? `${el.result.detailed.goal1}:${el.result.detailed.goal2} (${el.status})\r\n`
                    : `${el.startTime ? '(' + el.startTime +' - мск. время)' : el.status}\r\n`;
      }
    });
    return string;
  } catch (err) {
    console.error(err);
    return 'Ошибка';
  }
}

// Exports
module.exports = {
  setupMatches,
}