const fetch = require('node-fetch');
require('dotenv').config();

const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
// const stage = new Stage([superWizard], { default: 'super-wizard' })
const bot = new Telegraf(process.env.BOT_TOKEN)

const listCountry = ['russian', 'britan', 'spain', 'germany', 'france'];
// const {}

// API Турнирная таблица
function returnApi(countryNumber, viewResult) {
  return `https://www.sports.ru/core/stat/gadget/${viewResult}/?args={%22tournament_id%22:${countryNumber}}`;
}

bot.use(session())

bot.start((ctx) => {
  ctx.reply('Добро пожаловать. Выберите страну!', Markup.inlineKeyboard([
    Markup.callbackButton('🇷🇺', 31),
    Markup.callbackButton('🏴󠁧󠁢󠁥󠁮󠁧󠁿', 52),
    Markup.callbackButton('🇪🇸', 49),
    Markup.callbackButton('🇮🇹', 48),
    Markup.callbackButton('🇩🇪', 50),
    Markup.callbackButton('🇫🇷', 51),
  ]).extra())
})

bot.action(/^[0-9]{2}$/i, ctx => {
  ctx.session.country = ctx.update.callback_query.data || null;
  ctx.reply('Выберите информацию', Markup.inlineKeyboard([
    Markup.callbackButton('Турнирная таблица', 'tournament_table')
  ]).extra())
})

bot.on('callback_query', async (ctx) => {
  const url = returnApi(ctx.session.country, ctx.update.callback_query.data);
  const info = await getData(url);
  ctx.replyWithHTML(info)
})

bot.launch()

// Определение функции получения данных и возврат отформатированной цитаты:
async function getData(url) {
  try {
    const data = await fetch(url);
    const json = await data.json();
    let result = '';
    json.tournament_table[0].list.forEach(element => {
      result +=`<b>${element.place} место</b> \u2014 <i>${element.team_info.name}</i>\r\n`;
    });
    return result;
  } catch (err) {
    console.error('Fail to fetch data: ' + err);
    return 'Ошибка';
  }
}
