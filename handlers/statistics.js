const { countryKeyBoardInline, viewResultKeyBoardInline, countryCode, viewCode} = require('../helpers/keyBoards');
const { getDataSports } = require('../helpers/function')

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
  const info = await getDataSports({country: ctx.session.countryCode, view: ctx.match.input});
  options.parse_mode = 'HTML';
  ctx.editMessageText(info, options);
}

// Exports
module.exports = {
  setupStat,
}
