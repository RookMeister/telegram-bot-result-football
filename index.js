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

// API Турнирная таблица
function returnApi(countryNumber, viewResult) {
  return `https://www.sports.ru/core/stat/gadget/${viewResult}/?args={%22tournament_id%22:${countryNumber}}`;
}

bot.start((ctx) => {
  ctx.reply('Добро пожаловать. Выберите страну!', Markup.inlineKeyboard([
    Markup.callbackButton('🇷🇺', 'russian')
  ]).extra())
})
bot.action('russian', (ctx) => {
  console.log(1, ctx.match);
  // numberCountry = 31;
  ctx.reply('Выберите информацию', Markup.inlineKeyboard([
    Markup.callbackButton('Турнирная таблица', 'tournament_table')
  ]).extra())
})
bot.on('callback_query', async (ctx) => {
  console.log(2, ctx.update.callback_query.data)
  const url = returnApi(31, ctx.update.callback_query.data);
  console.log(3, url);
  const info = await getData(url);
  console.log(info)
  ctx.reply(info)
})

bot.use(session())

bot.launch()

// Определение функции получения данных и возврат отформатированной цитаты:
async function getData(url) {
  try {
    const data = await fetch(url);
    const json = await data.json();
    
    const team = json.tournament_table[0].list[0];
    console.log(json.tournament_table[0].list[0])
    // const author = json.quoteAuthor.length === 0 ? 'Автор не известен' : json.quoteAuthor;
    return `<b>${team.place} место</b>\n\u2014 <i>команда ${team.team_info.name}</i>`;
  } catch (err) {
    console.error('Fail to fetch data: ' + err);
    // return 'Мысль потеряна! Попробуй ещё раз.';
  }
}
