const User = require('../models/user');
const { subscribeAnswerKeyBoardInline, unSubscribeAnswerKeyBoardInline, mainKeyboard } = require('../utils/keyBoards');


function setupStart(bot) {
  // Start command
  bot.command('start', async (ctx) => mainMenu(ctx));
}

async function mainMenu(ctx) {
  const user = ctx.session.user;
  const options = mainKeyboard;
  await ctx.replyWithHTML('Выберите раздел в меню', options).then(function(resp) {
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