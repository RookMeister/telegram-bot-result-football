const fetch = require('node-fetch');
const stringTable = require('string-table');

exports.dateNow = function () {
  const d = new Date();
  const year = d.getFullYear();
  const mounth = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}-${(mounth > 9) ? mounth : '0' + mounth}-${day}`;
}

exports.datePrev = function () {
  const d = new Date();
  const year = d.getFullYear();
  const mounth = d.getMonth() + 1;
  const day = d.getDate() - 1;
  return `${year}-${(mounth > 9) ? mounth : '0' + mounth}-${day}`;
}

// API Sports
exports.returnApiSports = function (countryNumber, viewResult) {
  return `https://www.sports.ru/core/stat/gadget/${viewResult}/?args={%22tournament_id%22:${countryNumber}}`;
}

// API Championat
exports.returnApiChampionat = function (date) {
  return `https://www.championat.com/stat/football/${date}.json`;
}

// Определение функции получения данных и возврат отформатированной :
exports.getDataSports = async function (url, view) {
  try {
    const data = await fetch(url);
    const json = await data.json();
    let result = '';
    if (view === 'tournament_table') {
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
              if (view === 'last_matches') {
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

exports.getDataChampionat = async function (date) {
  try {
    const url = this.returnApiChampionat(date);
    const data = await fetch(url);
    const json = await data.json();
    let result = '';
    if (json.matches.football.tournaments) {
      Object.entries(json.matches.football.tournaments).forEach(([key, value]) => {
        result += `\r\n<i>${value.name}</i>\r\n\r\n`;
        value.matches.forEach(el => {
          if (!el.result) {
            result += `${el.teams[0].name} \u2014 ${el.teams[1].name} (${el.time} - мск. время)\r\n`;
          } else {
            console.log(el.teams[0].name, el.teams[1].name)
            result += `${el.teams[0].name} \u2014 ${el.teams[1].name}  ${el.result.detailed.goal1}:${el.result.detailed.goal2}\r\n`;
          }
        });
      });
    } else {
      result += 'Нет данных';
    }
    return result;
  } catch (err) {
    console.error('Fail to fetch data: ' + err);
    return 'Ошибка';
  }
}