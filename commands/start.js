const User = require('../models/user');
const { subscribeAnswerKeyBoardInline, unSubscribeAnswerKeyBoardInline, mainKeyboard } = require('../utils/keyBoards');


function setupStart(bot) {
  // Start command
  bot.command('start', async (ctx) => mainMenu(ctx));
}

async function mainMenu(ctx) {
  const options = ctx.session.user.onScheduler ? unSubscribeAnswerKeyBoardInline : subscribeAnswerKeyBoardInline;
  const keyboard = mainKeyboard;
  await ctx.replyWithHTML(`Подпишитесь на рассылку и этот бот будет присылать вам результаты матчей.`, options).then(function(resp) {
    // ...snip...
  }).catch(function(error) {
    if (error.response && error.response.statusCode === 403) {
      console.log('bot blocked', ctx.chat);
    }
  });
  await ctx.replyWithHTML('Выберите раздел в меню', keyboard).then(function(resp) {
    // ...snip...
  }).catch(function(error) {
    if (error.response && error.response.statusCode === 403) {
      console.log('bot blocked', ctx.chat);
    }
  });
}

// Exports
module.exports = {
  setupStart,
}