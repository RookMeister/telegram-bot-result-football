const { mainKeyboard } = require('../helpers/keyboards');

function setupStart(bot) {
  bot.command('start', async (ctx) => mainMenu(ctx));
  bot.command('en', ({ i18n, replyWithHTML }) => {
    i18n.locale('en')
    return replyWithHTML(i18n.t('language'))
  })

  // Set locale to `ru`
  bot.command('ru', ({ i18n, replyWithHTML }) => {
    i18n.locale('ru')
    return replyWithHTML(i18n.t('language'))
  })
}

async function mainMenu(ctx) {
  const options = mainKeyboard;
  await ctx.replyWithHTML(ctx.i18n.t('start'), options).then(function(resp) {
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