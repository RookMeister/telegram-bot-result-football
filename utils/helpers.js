const fetch = require('node-fetch');
const { dayToIso, isPastDate, getHoursTimeZone } = require('./date');
const stringTable = require('string-table');

// Championats
const championats =  [
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

// URL Sports
function returnUrlSports({country, view}) {
  return `https://www.sports.ru/core/stat/gadget/${view}/?args={%22tournament_id%22:${country}}`;
}

// URL Championat
function returnUrlChampionat({date}) {
  const stringDate = dayToIso(date)
  return `https://www.championat.com/stat/football/${stringDate}.json`;
}

async function getData(api, config) {
  const url = (api === 'sports') ? returnUrlSports(config) : returnUrlChampionat(config);
  const data = await fetch(url);
  const json = await data.json();
  const result = (api === 'sports') ? getDataSports(json) : getDataChampionat(json, championats, config.timeZone, config.check);
  return result
}

function getDataSports(data) {
  try {
    if (data.tournament_table && data.tournament_table[0].list) {
      const table = [];
      data.tournament_table[0].list.forEach(element => {
        table.push({Место: element.place, Команда: element.team_info.name, Очки: element.score})
      });
      return table;
    } else if (data.match_list && data.match_list.length) {
      const matches = [];
      data.match_list.forEach(element => {
        matches.push({title: element.title})
        element.matches.forEach(el => {
          matches.push({firstTeam: el.first_team, secondTeam: el.second_team, startTime: el.start_time})
        });
      });
      return matches
    }
  } catch (err) {
    console.error(err);
    return 'Ошибка';
  }
}
function getDataChampionat(data, subscriptions, timeZone, checkEnd = false) {
  try {
    const tournaments = data.matches.football.tournaments;
    const matches = [];
    outer: for (const value of Object.values(tournaments)) {
      const nameTournament = value.name_tournament || value.name;
      if (!subscriptions.includes(nameTournament)) continue;
      matches.push({title: value.name, championat: nameTournament})
      for (const el of value.matches) {
        if (checkEnd && el.raw_status === 'dns' && el.raw_status === '1t' && el.raw_status === '2t') {
          matches.length = 0;
          break outer;
        }
        matches.push({firstTeam: el.teams[0], secondTeam: el.teams[1], startTime: getHoursTimeZone(`${el.date} ${el.time}`, timeZone) , result: el.result, status: el.status, group: el.group, championat: nameTournament})
      }
    }
    return matches;
  } catch (err) {
    console.error(err);
    return 'Ошибка';
  }
}
function dataConversionChampionat(data) {
  try {
    if (!data)  return 'Ошибка';
    let string = '';
    data.forEach(el => {
      if (el.title) {
        string += `\r\n<i>${el.title}</i>\r\n\r\n`;
      } else {
        string += `${el.startTime[0]} ${el.firstTeam.name} \u2014 ${el.secondTeam.name} `;
        string += (el.result)
                    ? `${el.result.detailed.goal1}:${el.result.detailed.goal2} (${el.status})\r\n`
                    : `${el.status === 'Не начался' ? 'в ' + el.startTime[1] : el.status}\r\n`;
      }
    });
    return string || 'Нет подходящих матчей';
  } catch (err) {
    console.error(err);
    return 'Ошибка';
  }
}
function dataConversionSports(data, result) {
  try {
    if (!data && !result)  return 'Ошибка';
    if (result === 'tournament_table') {
      return `<pre>${stringTable.create(data)}</pre>`;
    } else {
      let string = '';
      data.forEach(el => {
        if (el.title) {
        string += `\r\n<i>${el.title}</i>\r\n\r\n`;
        } else {
          string += `${el.firstTeam.name} \u2014 ${el.secondTeam.name} `;
          string += (isPastDate(el.startTime.full)) ? `${el.firstTeam.goals}:${el.secondTeam.goals}\r\n` : `(${el.startTime.time} - мск. время)\r\n`;
        }
      });
      return string;
    }
  } catch (err) {
    console.error(err);
    return 'Ошибка';
  }
}

// Exports
module.exports = {
  getData,
  dataConversionSports,
  dataConversionChampionat,
}

