const exp = require('./const');
const key = require('./keyBoards');
const func = require('./api/function');
const returnDate = require('./utils/date');
const keyBoards = new key();
const User = require('./models/user')

exports.favClub = async function(ctx) {
  ctx.replyWithHTML('Введите название своей любимой команды');
  return ctx.wizard.next();
}

exports.addFavClub = async function(ctx) {
  const userFind = await User.findOne({chat_id: ctx.message.chat.id});
  userFind.favClub.push(ctx.message.text);
  userFind.save(function(err){
    if(err) return console.log(err);
    console.log('Добавлена любимая команда', userFind);
  })
  ctx.replyWithHTML('Добавил, теперь по этой команде вам будет приходить уведомление о игре в день матча');
  return ctx.scene.leave();
}

exports.mainMenu = async function(ctx) {
  const user = new User({
    username: ctx.message.chat.username,
    chat_id: ctx.message.chat.id
  });
  const userOld = await User.findOne({chat_id: ctx.message.chat.id}).exec();
  if (!userOld) {
    user.save(function(err){
      if(err) return console.log(err);
      console.log("Сохранен объект", user);
    })
  }
  
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

exports.sendTo = async function(ctx, time, chat) {
  const options = keyBoards.mainKeyboard();
  try {
    const info = await func.getDataChampionat(returnDate(time));
    ctx.sendMessage(chat, info, {parse_mode: 'html'})
  } catch (e) {
    console.error(e);
  }
}

// exports.sendToMe = async function(ctx, e) {
//   ctx.telegram.sendMessage(, `${ctx.message.chat.id} - ${ctx.message.text} - ${ctx.from.username} : ${e}`);
// }
