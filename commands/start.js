const { mainKeyboard } = require('../helpers/keyboards');

function setupStart(bot) {
  bot.command('start', async (ctx) => mainMenu(ctx));
}

async function mainMenu(ctx) {
  const options = mainKeyboard;
  await ctx.replyWithHTML('Выберите раздел в меню', options).then(function(resp) {
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