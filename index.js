const fetch = require('node-fetch');
require('dotenv').config();
// API Турнирная таблица

function returnApi(countryNumber, viewResult) {
  return `https://www.sports.ru/core/stat/gadget/${viewResult}/?args={%22tournament_id%22:${countryNumber}}`;
}

const { Telegraf } = require('telegraf')
console.log(process.env.TELEGRAM_TOKEN)
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
bot.start((ctx) => ctx.reply('Добро пожаловать. Выбери страну и то ,что хочешь узнать.'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.launch()

// Определение функции получения данных и возврат отформатированной цитаты:
// async function getData(url) {
//   try {
//     const data = await fetch(url);
//     const json = await data.json();
//     const quote = json.quoteText;
//     const author = json.quoteAuthor.length === 0 ? 'Автор не известен' : json.quoteAuthor;
//     return `<b>${quote}</b>\n\u2014 <i>${author}</i>`;
//   } catch (err) {
//     console.error('Fail to fetch data: ' + err);
//     return 'Мысль потеряна! Попробуй ещё раз.';
//   }
// }
