const fetch = require('node-fetch');
const stringTable = require('string-table');
const User = require('../models/user');

// Championats
const champions =  [
  // Россия
  'Россия - Премьер-Лига',
  'Кубок России',
  //Англия
  'Англия - Премьер-лига',
  'Кубок Англии',
  'Суперкубок Англии',
  'Англия - Кубок лиги',
  // Германия
  'Суперкубок Германии',
  'Германия - Бундеслига',
  'Кубок Германии',
  // Италия
  'Суперкубок Италии',
  'Кубок Италии',
  'Италия - Серия А',
  // Испания
  'Испания - Примера',
  'Суперкубок Испании',
  // Франция
  'Франция - Лига 1',
  'Суперкубок Франции',
  // Европа
  'Лига чемпионов',
  'Лига Европы',
  // Сборные
  'Товарищеские матчи (сборные)',
  'Лига наций УЕФА',
];

// API Sports
function returnApiSports(countryNumber, viewResult) {
  return `https://www.sports.ru/core/stat/gadget/${viewResult}/?args={%22tournament_id%22:${countryNumber}}`;
}

// API Championat
function returnApiChampionat(date) {
  return `https://www.championat.com/stat/football/${date}.json`;
}

// Определение функции получения данных и возврат отформатированной :
async function getDataSports(championat) {
  try {
    const url = returnApiSports(championat.country, championat.view);
    const data = await fetch(url);
    const json = await data.json();
    let result = '';
    if (championat.view === 'tournament_table') {
      const table = [];
      json.tournament_table[0].list.forEach(element => {
        // result +=`<b>${element.place} место</b> \u2014 <i>${element.team_info.name}</i> | ${element.score}\r\n`;
        table.push({Место: element.place, Команда: element.team_info.name, Очки: element.score})
      });
      result = `<pre>${stringTable.create(table)}</pre>`;
    } else {
      if (json.match_list.length) {
        json.match_list.forEach(element => {
          result += `\r\n<i>${element.title}</i>\r\n\r\n`;
          if (element.matches.length) {
            element.matches.forEach(el => {
              if (championat.view === 'last_matches') {
                result += `${el.first_team.name} \u2014 ${el.second_team.name}  ${el.first_team.goals}:${el.second_team.goals}\r\n`;
              }
              else {
                result += `${el.first_team.name} \u2014 ${el.second_team.name} (${el.start_time.time} - мск. время)\r\n`;
              }
            });
          }
        });
      } else {
        result += 'Нет данных';
      }
    }
    return result;
  } catch (err) {
    console.error('Fail to fetch data: ' + err);
    return 'Ошибка';
  }
}

async function getOriginalData(date, subscriptions) {
  try {
    const url = returnApiChampionat(date);
    const data = await fetch(url);
    const json = await data.json();
    let result = '';
    if (json.matches.football.tournaments) {
      Object.entries(json.matches.football.tournaments).forEach(([key, value]) => {
        const nameTournament = value.name_tournament || value.name;
        if (subscriptions.includes(nameTournament)) {
          let matches = '';
          let isAllFinish = true;
          value.matches.forEach(el => {
            if (el.teams[0].name && el.teams[1].name) {
              if (el.result && el.status === 'Окончен') {
                matches += `${el.teams[0].name} \u2014 ${el.teams[1].name} ${el.result.detailed.goal1}:${el.result.detailed.goal2} (${el.status})\r\n`;
              } else {
                isAllFinish = false
              }
            }
          });
          matches = isAllFinish ? matches : '';
          if (matches) {
            result += `\r\n<b><i>${value.name}</i></b>\r\n\r\n`;
            result += matches;
          }
        }
      });
    } else {
      return null;
    }
    if (!result) {
      result = null
    }
    return result;
  } catch (err) {
    console.error('Fail to fetch data: ' + err);
    return 'Ошибка';
  }
}

async function getDataChampionat(date, chat_id) {
  try {
    const user = await User.findOne({chat_id}).exec();
    const url = returnApiChampionat(date);
    const data = await fetch(url);
    const json = await data.json();
    let result = '';
    if (json.matches.football.tournaments) {
      Object.entries(json.matches.football.tournaments).forEach(([key, value]) => {
        const isTop = value.is_top;
        const nameTournament = value.name_tournament || value.name;
        if (user.subscriptions.includes(nameTournament)) {
          let matches = '';
          value.matches.forEach(el => {
            if (el.teams[0].name && el.teams[1].name) {
              if (el.result) {
                matches += `${el.teams[0].name} \u2014 ${el.teams[1].name} ${el.result.detailed.goal1}:${el.result.detailed.goal2} (${el.status})\r\n`;
              } else {
                matches += `${el.teams[0].name} \u2014 ${el.teams[1].name} ${el.time ? '(' + el.time +' - мск. время)' : el.status}\r\n`;
              }
            }
          });
          if (matches) {
            result += `\r\n<b><i>${value.name}</i></b>\r\n\r\n`;
            result += matches;
          }
        }
      });
    } else {
      result += 'Нет данных';
    }
    if (!result) {
      result = 'Нет подходящих матчей'
    }
    return result;
  } catch (err) {
    console.error('Fail to fetch data: ' + err);
    return 'Ошибка';
  }
}

// Exports
module.exports = {
  getDataSports,
  getDataChampionat,
  getOriginalData,
}

