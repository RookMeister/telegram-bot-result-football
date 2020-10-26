'use strict'

require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./bot/models/user')

const getHours = require('date-fns/getHours');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@football-result-bot.1i9up.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});

const exp = require('./bot/const');
const actions = require('./bot/actions');

const Telegraf = require('telegraf');
const Session = require('telegraf/session');
const Stage = require('telegraf/stage');
const { leave } = Stage;
const Composer = require('telegraf/composer');
const WizardScene = require('telegraf/scenes/wizard');

mongoose.connection.on('open', () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  const stepCountry = new Composer();
  const stepViewResult = new Composer();

  const superWizard = new WizardScene('superWizard',
    async (ctx) => await actions.stepSelectCountry(ctx),
    stepCountry.hears(exp.regexpContry, async (ctx) => await actions.stepSelectViewResult(ctx)),
    stepViewResult.hears(exp.regexpViewResult, async (ctx) => await actions.outputResult(ctx)),
  );

  const addFavoriteClub = new WizardScene('addFavoriteClub',
    async (ctx) => await actions.favClub(ctx),
    async (ctx) => await actions.addFavClub(ctx),
  );

  const stage = new Stage([superWizard, addFavoriteClub]);

  bot.use(Session());
  bot.use(stage.middleware());
  stepCountry.use((ctx) => ctx.replyWithMarkdown('Введите флаг чемпионата'));
  stepViewResult.use((ctx) => ctx.replyWithMarkdown('Введите вид результата'));
  superWizard.hears('Главное меню', async (ctx) => {ctx.scene.leave(); await actions.mainMenu(ctx)}),

  bot.command('start', async (ctx) => await actions.mainMenu(ctx));
  bot.command('add', async (ctx) => ctx.scene.enter('addFavoriteClub'));
  bot.hears('Главное меню', async (ctx) => await actions.mainMenu(ctx));
  bot.hears('Чемпионаты', (ctx) => ctx.scene.enter('superWizard'));
  bot.hears('Завтра', async (ctx) => await actions.getMatches(ctx, 'next'));
  bot.hears('Сегодня', async (ctx) => await actions.getMatches(ctx, 'now'));
  bot.hears('Вчера', async (ctx) => await actions.getMatches(ctx, 'prev'));

  bot.launch();

  setInterval(async () => {
    const hours = getHours(new Date());
    console.log('Час - ' + hours)
    if (hours === 23) {
      const users = await User.find({});
      if (users.length) {
        users.forEach(el => {
          actions.sendTo(bot.telegram, 'now', el.chat_id);
        });
      }
    }
  }, 3600000);
})
