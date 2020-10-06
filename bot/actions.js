const exp = require('./const');
const key = require('./keyBoards');
const func = require('./api/function');
const returnDate = require('./utils/date');
const keyBoards = new key();

exports.mainMenu = async function(ctx) {
  const options = keyBoards.mainKeyboard();
  ctx.replyWithHTML('Выберите раздел в главном меню', options);
}

exports.getMatches = async function(ctx, time) {
  const options = keyBoards.mainKeyboard();
  try {
    const info = await func.getDataChampionat(returnDate(time));
    ctx.replyWithHTML(info, options);
  } catch (e) {
    ctx.reply('Ошибка');
    console.error(e);
  }
}

exports.stepSelectCountry = async function(ctx) {
  const options = keyBoards.countryKeyboard();
  try {
    ctx.replyWithHTML('Выберите чемпионат', options);
  } catch (e) {
    ctx.reply('Ошибка', keyBoards.noneKeyboard);
    console.error(e);
  }
  return ctx.wizard.next();
}

exports.stepSelectViewResult = async function(ctx) {
  const options = keyBoards.viewResultKeyboard();
  ctx.session.country = ctx.match.input;
  try {
    ctx.replyWithHTML('Выбери вид результата', options);
  } catch (e) {
    ctx.reply('Ошибка', keyBoards.noneKeyboard);
    console.error(e);
  }
  return ctx.wizard.next();
}

exports.outputResult = async function(ctx) {
  const options = keyBoards.mainKeyboard();
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

// exports.sendToMe = async function(ctx, e) {
//   ctx.telegram.sendMessage(, `${ctx.message.chat.id} - ${ctx.message.text} - ${ctx.from.username} : ${e}`);
// }
