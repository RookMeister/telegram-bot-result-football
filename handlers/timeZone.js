const { timeZoneKeyBoardInline, timeZone, viewCode } = require('../utils/keyBoards');
const format = require('date-fns/format');
const addHours = require('date-fns/addHours');
const User = require('../models/user');

function setupTimeZone(bot) {
  bot.hears('Настроить время', (ctx) => showTomeZone(ctx));
  bot.action(new RegExp(timeZone.map(el => '\\'+el).join("|")), async (ctx) => setTimeZone(ctx));
}

function showTomeZone(ctx) {
  const date = addHours(new Date(), Number(ctx.session.user.timeZone))
  const options = timeZoneKeyBoardInline;
  const info = `Твой часовой пояс ${ctx.session.user.timeZone}. Так что теперь время ${format(date, 'HH:mm')}. Если это не так, измени часовой пояс:`;
  ctx.replyWithHTML(info, options);
}

async function setTimeZone(ctx) {
  await User.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { timeZone: ctx.match.input } }, function (err, data) {
    if (err) return console.log(err);
    ctx.session.user = data;
    const date = addHours(new Date(), Number(ctx.session.user.timeZone))
    const info = `Твой часовой пояс ${ctx.session.user.timeZone}. Так что теперь время ${format(date, 'HH:mm')}. Если это не так, измени часовой пояс:`;
    ctx.replyWithHTML(info);
  });
}


// Exports
module.exports = {
  setupTimeZone,
}