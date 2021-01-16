const { countryKBInline, statViewKBInline, countryKey, statViewKey } = require('../helpers/keyboards');
const { getData } = require('../helpers/api')
const { getDataStat, conversionDataStat } = require('../helpers/statistics')

function setupStat(bot) {
  bot.hears('Статистика', (ctx) => selectCountry(ctx));
  bot.action(new RegExp(countryKey.map(el => el.value).join("|")), (ctx) => selectyResult(ctx));
  bot.action(new RegExp(statViewKey.map(el => el.value).join("|")), (ctx) => getResult(ctx));
}

async function selectCountry(ctx) {
  const options = countryKBInline;
  ctx.replyWithHTML('Выберите страну', options);
}

async function selectyResult(ctx) {
  ctx.session.countryCode = ctx.match.input;
  const options = statViewKBInline;
  ctx.editMessageText('Выберите вид результата', options);
}

async function getResult(ctx) {
  const options = countryKBInline;
  const json = await getData('stat', { country: ctx.session.countryCode, view: ctx.match.input });
  const data = getDataStat(json);
  const info = conversionDataStat({data, view: ctx.match.input});
  options.parse_mode = 'HTML';
  ctx.editMessageText(info, options);
}

// Exports
module.exports = {
  setupStat,
}
