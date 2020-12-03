'use strict'

require('dotenv').config();

// Init
const setupMongoose = require('./init/mongo')
const { bot, startBot, startMiddelware } = require('./init/bot')
const { setupStart } = require('./commands/start')
const { setupMatches,  } = require('./handlers/matches')
const { setupStat } = require('./handlers/statistics')
const { startScheduler } = require('./handlers/scheduler')
const { setupSubscribe } = require('./handlers/subscribe')
const { setupSettings } = require('./handlers/settings')
const { setupTimeZone } = require('./handlers/timeZone')

setupMongoose();

startMiddelware();

setupStart(bot);
setupMatches(bot);
setupStat(bot);
startScheduler(bot);
setupSubscribe(bot);
setupTimeZone(bot);
setupSettings(bot);

bot.on('message', (ctx) => {
  const info = 'Извини, я не могу тебя понять. Используй кнопки. Если не видишь кнопки, отправь мне /start';
  ctx.reply(info);
});

startBot();