const User = require('../models/user');
const { subscribeAnswerKeyBoardInline, unSubscribeAnswerKeyBoardInline } = require('../utils/keyBoards');


function setupStart(bot) {
  // Start command
  bot.command('start', async (ctx) => await mainMenu(ctx));
}

async function mainMenu(ctx) {
  const user = new User({
    username: ctx.message.chat.username,
    chat_id: ctx.chat.id
  });
  let options;
  const userOld = await User.findOne({chat_id: ctx.chat.id}).exec();
  if (!userOld) {
    user.save(function(err){
      if(err) return console.log(err);
      console.log(`Сохранен пользователь ${ctx.message.chat.username}`);
    })
    options = subscribeAnswerKeyBoardInline;
  } else {
    options = userOld.onScheduler ? unSubscribeAnswerKeyBoardInline : subscribeAnswerKeyBoardInline;
  }

  ctx.replyWithHTML(`Подпишитесь на рассылку и этот бот будет присылать вам результаты матчей.`, options);
}

// Exports
module.exports = {
  setupStart,
}