'use strict'

require('dotenv').config();

const exp = require('./bot/const');
const actions = require('./bot/actions');

const Telegraf = require('telegraf');
const Session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Composer = require('telegraf/composer');
const WizardScene = require('telegraf/scenes/wizard');

const bot = new Telegraf(process.env.BOT_TOKEN);

const stepCountry = new Composer();
const stepViewResult = new Composer();

const superWizard = new WizardScene('super-wizard',
  async (ctx) =>  await actions.stepSelectCountry(ctx),
  stepCountry.hears(exp.regexpContry, async (ctx) => await actions.stepSelectViewResult(ctx)),
  stepViewResult.hears(exp.regexpViewResult, async (ctx) => await actions.outputResult(ctx)),
);

const stage = new Stage([superWizard]);

bot.use(Session());
bot.use(stage.middleware());
stepCountry.use((ctx) => ctx.replyWithMarkdown('Введите флаг чемпионата'));
stepViewResult.use((ctx) => ctx.replyWithMarkdown('Введите вид результата'));

bot.command('start', async (ctx) => await actions.mainMenu(ctx));
bot.hears('Главное меню', async (ctx) => await actions.mainMenu(ctx));
bot.hears('Чемпионаты', (ctx) => ctx.scene.enter('super-wizard'));
bot.hears('Завтра', async (ctx) => await actions.getMatches(ctx, 'next'));
bot.hears('Сегодня', async (ctx) => await actions.getMatches(ctx, 'now'));
bot.hears('Вчера', async (ctx) => await actions.getMatches(ctx, 'prev'));

bot.launch();