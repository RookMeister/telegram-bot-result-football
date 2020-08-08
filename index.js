require('dotenv').config();

const exp = require('./const');
const func = require('./function');

const Telegraf = require('telegraf');
const Session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Composer = require('telegraf/composer');
const WizardScene = require('telegraf/scenes/wizard');

const bot = new Telegraf(process.env.BOT_TOKEN);

const stepCountry = new Composer();
const stepViewResult = new Composer();

stepCountry.hears(new RegExp(exp.country.map(el => el.text).join("|")), (ctx) => {
  const options = exp.viewResultKeyboard;
  ctx.session.country = ctx.match.input;
  try {
    ctx.replyWithHTML('Выбери вид результата', options);
  } catch (e) {
    ctx.reply('Ошибка', exp.noneKeyboard);
    console.error(e);
  }
  return ctx.wizard.next();
});

stepViewResult.hears(new RegExp(exp.viewResult.map(el => el.text).join("|")), async (ctx) => {
  const options = exp.noneKeyboard;
  try {
    const countryCode = exp.countryCode[ctx.session.country];
    const viewResultCode = exp.viewResultCode[ctx.match.input];
    const url = func.returnApi(countryCode, viewResultCode);
    const info = await func.getData(url, viewResultCode);
    ctx.replyWithHTML(info, options);
  } catch (e) {
    ctx.reply('Ошибка');
    console.error(e);
  }
  return ctx.scene.leave();
});

stepCountry.use((ctx) => ctx.replyWithMarkdown('Введите флаг чемпионата'));
stepViewResult.use((ctx) => ctx.replyWithMarkdown('Введите вид результата'));

const superWizard = new WizardScene('super-wizard',
  (ctx) => {
    const options = exp.countryKeyboard;
    try {
      ctx.replyWithHTML('Выберите чемпионат', options);
    } catch (e) {
      ctx.reply('Ошибка', exp.noneKeyboard);
      console.error(e);
    }
    return ctx.wizard.next();
  },
  stepCountry,
  stepViewResult,
);

const stage = new Stage([superWizard]);
bot.use(Session());

bot.use(stage.middleware());
bot.command('start', (ctx) => ctx.scene.enter('super-wizard'));
bot.hears('Повторить', (ctx) => ctx.scene.enter('super-wizard'));
bot.launch();