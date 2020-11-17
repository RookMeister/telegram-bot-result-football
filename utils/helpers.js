const fetch = require('node-fetch');
const returnDate = require('./date');

// URL Sports
function returnUrlSports({country, view}) {
  return `https://www.sports.ru/core/stat/gadget/${view}/?args={%22tournament_id%22:${country}}`;
}

// URL Championat
function returnUrlChampionat({date}) {
  const stringDate = returnDate(date)
  return `https://www.championat.com/stat/football/${stringDate}.json`;
}


async function getData(api, config) {
  const url = (api === 'sports') ? returnUrlSports(config) : returnUrlChampionat(config);
  const data = await fetch(url);
  const json = await data.json();
  const result = (api === 'sports') ? getDataSports(json) : getDataChampionat(json);
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
function getDataChampionat(data) {
  try {
    const tournaments = data.matches.football.tournaments;
    const matches = [];
    tournaments && Object.entries(tournaments).forEach(([key, value]) => {
      const nameTournament = value.name_tournament || value.name;
      matches.push({title: value.name, championat: nameTournament})
      value.matches.forEach(el => {
        matches.push({firstTeam: el.teams[0], secondTeam: el.teams[1], startTime: el.time , result: el.result, status: el.status, group: el.group, championat: nameTournament})
      });
    });
    return matches
  } catch (err) {
    console.error(err);
    return 'Ошибка';
  }
}

// Exports
module.exports = {
  getData,
}

