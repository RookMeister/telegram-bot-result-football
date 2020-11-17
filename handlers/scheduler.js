const { getData } = require('../utils/helpers')
const returnDate = require('../utils/date');
const User = require('../models/user');

async function startScheduler(bot) {
  let isSend = false;
  setInterval(async () => {
    const users = await User.find({});
    if (users.length) {
      users.forEach(async (el) => {
        const data = await getOriginalData(returnDate('now'), el.subscriptions)
        if (data && !isSend) {
          console.log(`Отправилось ${el.username}`)
          sendMessage(bot.telegram, el.chat_id, data);
          isSend = true;
        } else if (!data) {
          isSend = false;
        }
      });
    }
  }, 600000);
}

async function sendMessage(ctx, chat, info) {
  try {
    ctx.sendMessage(chat, info, {parse_mode: 'html'})
  } catch (e) {
    console.error(e);
  }
}

// Export bot
module.exports = { startScheduler }