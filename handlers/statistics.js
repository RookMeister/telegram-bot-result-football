const { countryKeyBoardInline, viewResultKeyBoardInline, countryCode, viewCode} = require('../utils/keyBoards');
const { getData } = require('../utils/helpers')
const stringTable = require('string-table');
const parseISO = require('date-fns/parseISO')
const isPast = require('date-fns/isPast')

function setupStat(bot) {
  bot.hears('Статистика', (ctx) => selectCountry(ctx));
  bot.action(new RegExp(countryCode.map(el => el.value).join("|")), (ctx) => selectyResult(ctx));
  bot.action(new RegExp(viewCode.map(el => el.value).join("|")), (ctx) => getResult(ctx));
}

async function selectCountry(ctx) {
  const options = countryKeyBoardInline;
  ctx.replyWithHTML('Выберите страну', options);
}

async function selectyResult(ctx) {
  ctx.session.countryCode = ctx.match.input;
  const options = viewResultKeyBoardInline;
  ctx.editMessageText('Выберите вид результата', options);
}

async function getResult(ctx) {
  const options = countryKeyBoardInline;
  const data = await getData('sports', { country: ctx.session.countryCode, view: ctx.match.input });
  const info = dataConversion(data, ctx.match.input);
  options.parse_mode = 'HTML';
  ctx.editMessageText(info, options);
}

function dataConversion(data, result) {
  try {
    if (!data && !result)  return 'Ошибка';
    if (result === 'tournament_table') {
      return `<pre>${stringTable.create(data)}</pre>`;
    } else {
      let string = '';
      data.forEach(el => {
        if (el.title) {
        string += `\r\n<i>${el.title}</i>\r\n\r\n`;
        } else {
          string += `${el.firstTeam.name} \u2014 ${el.secondTeam.name} `;
          string += (isPast(parseISO(el.startTime.full))) ? `${el.firstTeam.goals}:${el.secondTeam.goals}\r\n` : `(${el.startTime.time} - мск. время)\r\n`;
        }
      });
      return string;
    }
  } catch (err) {
    console.error(err);
    return 'Ошибка';
  }
}

// Exports
module.exports = {
  setupStat,
}
