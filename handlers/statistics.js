const { countryKeyBoardInline, viewResultKeyBoardInline, countryCode, viewCode} = require('../utils/keyBoards');
const { getData } = require('../utils/helpers')
const { dataConversionSports } = require('../utils/helpers')

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
  const info = dataConversionSports(data, ctx.match.input);
  options.parse_mode = 'HTML';
  ctx.editMessageText(info, options);
}

// Exports
module.exports = {
  setupStat,
}
