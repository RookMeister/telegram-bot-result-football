const stringTable = require('string-table');
const { isPastDate } = require('./date');

function getDataStat(data) {
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
    console.error('getDataStat', err);
    return 'Ошибка';
  }
}

function conversionDataStat({data, view}) {
  try {
    if (!data && !view)  return 'Ошибка';
    if (view === 'tournament_table') {
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
    console.error('conversionDataStat', err);
    return 'Ошибка';
  }
}

// Exports
module.exports = {
  getDataStat,
  conversionDataStat,
}