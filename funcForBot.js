const exp = require('./const');
const func = require('./function');

exports.mainMenu = async function(ctx) {
  const options = exp.mainKeyboard;
  ctx.replyWithHTML('Выберите раздел в главном меню', options);
}

exports.getMatches = async function(ctx, time) {
  const options = exp.noneKeyboard;
  try {
    const info = await func.getDataChampionat(func.date(time));
    ctx.replyWithHTML(info, options);
  } catch (e) {
    ctx.reply('Ошибка');
    console.error(e);
  }
}

exports.stepSelectCountry = async function(ctx) {
  const options = exp.countryKeyboard;
  try {
    ctx.replyWithHTML('Выберите чемпионат', options);
  } catch (e) {
    ctx.reply('Ошибка', exp.noneKeyboard);
    console.error(e);
  }
  return ctx.wizard.next();
}

exports.stepSelectViewResult = async function(ctx) {
  const options = exp.viewResultKeyboard;
  ctx.session.country = ctx.match.input;
  try {
    ctx.replyWithHTML('Выбери вид результата', options);
  } catch (e) {
    ctx.reply('Ошибка', exp.noneKeyboard);
    console.error(e);
  }
  return ctx.wizard.next();
}

exports.outputResult = async function(ctx) {
  const options = exp.noneKeyboard;
  try {
    const countryCode = exp.countryCode[ctx.session.country];
    const viewResultCode = exp.viewResultCode[ctx.match.input];
    const url = func.returnApiSports(countryCode, viewResultCode);
    const info = await func.getDataSports(url, viewResultCode);
    ctx.replyWithHTML(info, options);
  } catch (e) {
    ctx.reply('Ошибка');
    console.error(e);
  }
  return ctx.scene.leave();
}