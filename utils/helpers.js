const fetch = require('node-fetch');
const { dayToIso, isPastDate} = require('./date');
const stringTable = require('string-table');

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
  const result = (api === 'sports') ? getDataSports(json) : getDataChampionat(json, config.subscriptions, config.check);
  return result
}

async function getDataSports(data) {
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
function getDataChampionat(data, subscriptions, checkEnd = false) {
  try {
    const tournaments = data.matches.football.tournaments;
    const matches = [];
    outer: for (const value of Object.values(tournaments)) {
      const nameTournament = value.name_tournament || value.name;
      if (!subscriptions.includes(nameTournament)) continue;
      matches.push({title: value.name, championat: nameTournament})
      for (const el of value.matches) {
        if (checkEnd && el.raw_status === 'dns') {
          console.log('scheduler', el.link_title, el.link);
          matches.length = 0;
          break outer;
        }
        matches.push({firstTeam: el.teams[0], secondTeam: el.teams[1], startTime: el.time , result: el.result, status: el.status, group: el.group, championat: nameTournament})
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
        string += `${el.firstTeam.name} \u2014 ${el.secondTeam.name} `;
        string += (el.result)
                    ? `${el.result.detailed.goal1}:${el.result.detailed.goal2} (${el.status})\r\n`
                    : `${el.status === 'Не начался' ? '(' + el.startTime +' - мск. время)' : el.status}\r\n`;
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
function arrayToString(arr) {
  let string = '';
  arr.forEach((el, i) => {
    string += `<i>/${i+1+'.'+el}</i>\r\n`;
  });
  return string;
}

// Exports
module.exports = {
  getData,
  dataConversionSports,
  dataConversionChampionat,
  arrayToString,
}

