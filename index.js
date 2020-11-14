'use strict'

require('dotenv').config();

// Init
const setupMongoose = require('./init/mongo')
const { bot, startBot, startMiddelware } = require('./init/bot')
const { setupStart } = require('./commands/start')
const { setupMatches,  } = require('./handlers/matches')
const { setupStat } = require('./handlers/statistics')
const { startScheduler } = require('./handlers/scheduler')

setupMongoose();

startMiddelware();

setupStart(bot);
setupMatches(bot);
setupStat(bot);
startScheduler(bot);

startBot();