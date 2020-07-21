const fetch = require('node-fetch');
// const stringTable = require('string-table');
require('dotenv').config();

const Telegraf = require('telegraf')
// const Composer = require('telegraf/composer')
const session = require('telegraf/session')
// const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
// const WizardScene = require('telegraf/scenes/wizard')
// const stage = new Stage([superWizard], { default: 'super-wizard' })
const bot = new Telegraf(process.env.BOT_TOKEN)

// API Sports
function returnApi(countryNumber, viewResult) {
  return `https://www.sports.ru/core/stat/gadget/${viewResult}/?args={%22tournament_id%22:${countryNumber}}`;
}

// Country
const country = ['🇷🇺', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇪🇸', '🇮🇹', '🇩🇪', '🇫🇷'];
const countryCode = {'🇷🇺': 31, '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 52, '🇪🇸': 49, '🇮🇹': 48, '🇩🇪': 50, '🇫🇷': 51};
// View
const view = ['Турнирная таблица', 'Результаты', 'Календарь'];
const viewCode = {'Турнирная таблица': 'tournament_table', 'Результаты': 'last_matches', 'Календарь': 'future_matches'};

bot.use(session())

bot.hears('Чемпионат', ({reply}) => {
  // ctx.reply('Выберите чемпионат!', Markup.inlineKeyboard([
  //   Markup.callbackButton('🇷🇺', 31),
  //   Markup.callbackButton('🏴󠁧󠁢󠁥󠁮󠁧󠁿', 52),
  //   Markup.callbackButton('🇪🇸', 49),
  //   Markup.callbackButton('🇮🇹', 48),
  //   Markup.callbackButton('🇩🇪', 50),
  //   Markup.callbackButton('🇫🇷', 51),
  // ]).extra())
  return reply('Выберите чемпионат',Markup
    .keyboard([
      country
    ])
    .resize()
    .oneTime()
    .extra()
  )
})

bot.command('start', ({ reply }) => {
  return reply('Добро пожаловать. Нажми на кнопку "Чемпионат"',Markup
    .keyboard([
      ['Чемпионат'],
    ])
    .resize()
    .oneTime()
    .extra()
  )
})

bot.hears(country, (ctx) => {
  console.log(1, ctx.match)
  ctx.session.country = countryCode[ctx.match]
  ctx.reply('Выберите вид информации',Markup
    .keyboard([
      [...view, 'Чемпионат']
    ])
    .resize()
    .oneTime()
    .extra()
  )
})

bot.hears(view, async (ctx) => {
  console.log(2, ctx.match)
  ctx.session.view = viewCode[ctx.match]
  if (!ctx.session.country) {
    ctx.reply('Выберите чемпионат',Markup
      .keyboard([
        ['Чемпионат']
      ])
      .resize()
      .oneTime()
      .extra()
    )
  } else {
    const url = returnApi(ctx.session.country, ctx.session.view);
    const info = await getData(url, ctx.session.view);
    ctx.replyWithHTML(info)
  }
})

// bot.action(/^[0-9]{2}$/i, ctx => {
//   ctx.session.country = ctx.update.callback_query.data || null;
//   ctx.reply('Выберите информацию', Markup.inlineKeyboard([
//     Markup.callbackButton('Турнирная таблица', 'tournament_table'),
//     Markup.callbackButton('Результаты', 'last_matches'),
//     Markup.callbackButton('Календарь', 'future_matches'),
//   ]).extra())
// })

// bot.on('callback_query', async (ctx) => {
//   console.log(3, ctx.match)
  // const url = returnApi(ctx.session.country, ctx.update.callback_query.data);
  // const info = await getData(url, ctx.update.callback_query.data);
  // ctx.replyWithHTML(info)
//   ctx.reply(1123)
// })

bot.launch()

// Определение функции получения данных и возврат отформатированной :
async function getData(url, view) {
  try {
    const data = await fetch(url);
    const json = await data.json();
    let result = '';
    if (view === 'tournament_table') {
      const table = [];
      json.tournament_table[0].list.forEach(element => {
        result +=`<b>${element.place} место</b> \u2014 <i>${element.team_info.name}</i> | ${element.score}\r\n`;
        // table.push({place: element.place, team: element.team_info.name})
      });
      // result = stringTable.create(table);
    } else {
      json.match_list.forEach(element => {
        result += `\r\n<i>${element.title}</i>\r\n\r\n`;
        if (element.matches.length) {
          element.matches.forEach(el => {
            if (view === 'last_matches') {
              result += `${el.first_team.name} \u2014 ${el.second_team.name}  ${el.first_team.goals}:${el.second_team.goals}\r\n`;
            }
            else {
              result += `${el.first_team.name} \u2014 ${el.second_team.name} (${el.start_time.bulgakov} - мск. время)\r\n`;
            }
          });
        }
      });
    }
    return result;
  } catch (err) {
    console.error('Fail to fetch data: ' + err);
    return 'Ошибка';
  }
}
