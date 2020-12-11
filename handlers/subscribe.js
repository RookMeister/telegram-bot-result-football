const { UserModel } = require('../models/user');
const { subscribeKBInline, unSubscribeKBInline } = require('../helpers/keyboards');

function setupSubscribe(bot) {
  bot.action('✔Подписаться', (ctx) => isSubscribe(ctx, true));
  bot.action('✖Отписаться', (ctx) => isSubscribe(ctx));
}

async function isSubscribe(ctx, isSubscribe = false) {
  let string = 'Ты всегда можешь подписаться';
  let keyboard = '';
  let info = '';
  if (isSubscribe) {
    info = 'Вы подписались';
    string = 'Теперь после окончания матчей, вам будет приходить пуш с результатами матчей.';
    await UserModel.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { onScheduler: true } }, function (err, data) {
      if (err) return console.log(err);
    });
    keyboard = unSubscribeKBInline;
  } else {
    await UserModel.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { onScheduler: false } }, function (err, data) {
      if (err) return console.log(err);
    });
    info = 'Вы отписались';
    keyboard = subscribeKBInline;
  }
  await ctx.answerCbQuery(info);
  ctx.editMessageText(string, keyboard);
}

// Exports
module.exports = {
  setupSubscribe,
}