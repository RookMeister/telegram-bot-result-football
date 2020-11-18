const User = require('../models/user');
const { subscriptionAnswerKeyBoardInline, mainKeyboard, } = require('../utils/keyBoards');


function setupStart(bot) {
  // Start command
  bot.command('start', async (ctx) => await mainMenu(ctx));
}

async function mainMenu(ctx) {
  const user = new User({
    username: ctx.message.chat.username,
    chat_id: ctx.message.chat.id
  });
  const userOld = await User.findOne({chat_id: ctx.message.chat.id}).exec();
  if (!userOld) {
    user.save(function(err){
      if(err) return console.log(err);
      console.log(`Сохранен пользователь ${ctx.message.chat.username}`);
    })
  }

  const keyBoardsInline = subscriptionAnswerKeyBoardInline;
  const keyBoards = mainKeyboard;
  const options = { ...keyBoards, ...keyBoardsInline };
  ctx.replyWithHTML(`Подпишитесь на рассылку и этот бот будет присылать вам результаты матчей в соответствии с вашими подписками после окончания всех матчей. Добавить, удалить, а так же посмотреть свои подписки можете в разделе настройки`, options);
}

// Exports
module.exports = {
  setupStart,
}