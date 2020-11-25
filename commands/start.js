const User = require('../models/user');
const { subscribeAnswerKeyBoardInline, unSubscribeAnswerKeyBoardInline, mainKeyboard } = require('../utils/keyBoards');


function setupStart(bot) {
  // Start command
  bot.command('start', async (ctx) => mainMenu(ctx));
}

async function mainMenu(ctx) {
  const user = new User({
    username: ctx.message.chat.username,
    chat_id: ctx.chat.id
  });
  let options;
  const userOld = await User.findOne({chat_id: ctx.chat.id}).exec();
  if (userOld) {
    options = userOld.onScheduler ? unSubscribeAnswerKeyBoardInline : subscribeAnswerKeyBoardInline;
  } else {
    user.save(function(err){
      if(err) return console.log(err);
      console.log(`Сохранен пользователь ${ctx.message.chat.username}`);
    })
    options = subscribeAnswerKeyBoardInline;
  }
  const keyboard = mainKeyboard;
  await ctx.replyWithHTML(`Подпишитесь на рассылку и этот бот будет присылать вам результаты матчей.`, options).then(function(resp) {
    // ...snip...
  }).catch(function(error) {
    if (error.response && error.response.statusCode === 403) {
      console.log('bot blocked', ctx.message.chat.username);
    }
  });
  await ctx.replyWithHTML('Выберите раздел в меню', keyboard).then(function(resp) {
    // ...snip...
  }).catch(function(error) {
    if (error.response && error.response.statusCode === 403) {
      console.log('bot blocked', ctx.message.chat.username);
    }
  });
}

// Exports
module.exports = {
  setupStart,
}