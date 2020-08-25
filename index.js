'use strict'

require('dotenv').config();

const exp = require('./const');
const func = require('./function');
const botFunc = require('./funcForBot');

const Telegraf = require('telegraf');
const Session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Composer = require('telegraf/composer');
const WizardScene = require('telegraf/scenes/wizard');

const bot = new Telegraf(process.env.BOT_TOKEN);

const stepCountry = new Composer();
const stepViewResult = new Composer();

const superWizard = new WizardScene('super-wizard',
  async (ctx) =>  await botFunc.stepSelectCountry(ctx),
  stepCountry,
  stepViewResult,
);

const stage = new Stage([superWizard]);

bot.use(Session());
bot.use(stage.middleware());
stepCountry.use((ctx) => ctx.replyWithMarkdown('Введите флаг чемпионата'));
stepViewResult.use((ctx) => ctx.replyWithMarkdown('Введите вид результата'));

bot.command('start', async (ctx) =>  await botFunc.mainMenu(ctx));
bot.hears('Главное меню', async (ctx) => await botFunc.mainMenu(ctx));
bot.hears('Чемпионаты', (ctx) => ctx.scene.enter('super-wizard'));
bot.hears('Сегодняшние матчи', async (ctx) => await botFunc.getMatches(ctx, true));
bot.hears('Вчерашние матчи', async (ctx) => await botFunc.getMatches(ctx, false));
stepCountry.hears(exp.regexpContry, async (ctx) => await botFunc.stepSelectViewResult(ctx));
stepViewResult.hears(exp.regexpViewResult, async (ctx) => await botFunc.outputResult(ctx));

bot.launch();