const fetch = require('node-fetch');
const stringTable = require('string-table');
const User = require('../models/user');

// URL Sports
function returnUrlSports(countryNumber, viewResult) {
  return `https://www.sports.ru/core/stat/gadget/${viewResult}/?args={%22tournament_id%22:${countryNumber}}`;
}

// URL Championat
function returnUrlChampionat(date) {
  return `https://www.championat.com/stat/football/${date}.json`;
}

async function getMatches(url) {
  const data = await fetch(url);
  const json = data.json();
  return json
}

// Определение функции получения данных и возврат отформатированной :
async function getDataSports(championat) {
  try {
    let result = '';
    const data = await getMatches(returnUrlSports(championat.country, championat.view));
    if (championat.view === 'tournament_table') {
      const table = [];
      data.tournament_table[0].list.forEach(element => {
        table.push({Место: element.place, Команда: element.team_info.name, Очки: element.score})
      });
      result = `<pre>${stringTable.create(table)}</pre>`;
    } else {
      if (data.match_list.length) {
        data.match_list.forEach(element => {
          result += `\r\n<i>${element.title}</i>\r\n\r\n`;
          element.matches.forEach(el => {
            result += `${el.first_team.name} \u2014 ${el.second_team.name} `;
            result += (championat.view === 'last_matches') ? `${el.first_team.goals}:${el.second_team.goals}\r\n` : `(${el.start_time.time} - мск. время)\r\n`;
          });
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
    let result = '';
    const data = await getMatches(returnUrlChampionat(date));
    const tournaments =data.matches.football.tournaments;
    let isAllFinish = true;
    if (tournaments) {
      Object.entries(data.matches.football.tournaments).forEach(([key, value]) => {
        const nameTournament = value.name_tournament || value.name;
        if (subscriptions.includes(nameTournament)) {
          let matches = '';
          value.matches.forEach(el => {
            if (el.teams[0].name && el.teams[1].name) {
              if (el.result && el.status === 'Окончен') {
                matches += `${el.teams[0].name} \u2014 ${el.teams[1].name} ${el.result.detailed.goal1}:${el.result.detailed.goal2} (${el.status})\r\n`;
              } else {
                isAllFinish = false
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
      isAllFinish = false;
    }
    return (isAllFinish) ? result : null;
  } catch (err) {
    console.error('Fail to fetch data: ' + err);
    return 'Ошибка';
  }
}

async function getDataChampionat(date, chat_id) {
  try {
    const user = await User.findOne({chat_id}).exec();
    const url = returnUrlChampionat(date);
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

