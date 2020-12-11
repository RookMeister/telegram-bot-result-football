const { timeZoneKBInline, timeZoneKey, backToKBInline } = require('../helpers/keyboards');
const format = require('date-fns/format');
const addHours = require('date-fns/addHours');
const { UserModel } = require('../models/user');

function setupTimeZone(bot) {
  bot.action('Настроить время', (ctx) => showTomeZone(ctx));
  bot.action(new RegExp(timeZoneKey.map(el => '\\'+el).join("|")), async (ctx) => setTimeZone(ctx));
}

function showTomeZone(ctx) {
  const date = addHours(new Date(), Number(ctx.session.user.timeZone))
  const options = timeZoneKBInline;
  const info = `Твой часовой пояс ${ctx.session.user.timeZone}. Так что теперь время ${format(date, 'HH:mm')}. Если это не так, измени часовой пояс:`;
  ctx.editMessageText(info, options);
}

async function setTimeZone(ctx) {
  await UserModel.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { timeZone: ctx.match.input } }, function (err, data) {
    if (err) return console.log(err);
    ctx.session.user.timeZone = ctx.match.input;
    const date = addHours(new Date(), Number(ctx.session.user.timeZone));
    const info = `Твой часовой пояс ${ctx.session.user.timeZone}. Так что теперь время ${format(date, 'HH:mm')}. Если это не так, измени часовой пояс:`;
    const options = backToKBInline;
    ctx.editMessageText(info, options);
  });
}


// Exports
module.exports = {
  setupTimeZone,
}