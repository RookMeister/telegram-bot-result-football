const User = require('../models/user');
const { mainKeyboard } = require('../helpers/keyBoards');


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

  const options = mainKeyboard();
  ctx.replyWithHTML('Выберите раздел в главном меню', options);
}

// Exports
module.exports = {
  setupStart,
}