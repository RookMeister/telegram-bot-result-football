const { getHoursTimeZone } = require('./date');

function getDataMatches({data, subscriptions, timeZone, checkEnd = false}) {
  try {
    const tournaments = data.matches.football.tournaments;
    const matches = [];
    outer: for (const value of Object.values(tournaments)) {
      const nameTournament = value.name_tournament || value.name;
      if (!subscriptions.includes(nameTournament)) continue;
      matches.push({title: value.name, championat: nameTournament})
      for (const el of value.matches) {
        if (checkEnd && el.raw_status !== 'fin' && el.raw_status !== 'post') {
          matches.length = 0;
          break outer;
        }
        matches.push({
          firstTeam: el.teams[0],
          secondTeam: el.teams[1],
          startTime: getHoursTimeZone(`${el.date} ${el.time}`, timeZone),
          result: el.result,
          status: el.status,
          group: el.group,
          championat: nameTournament,
          link: el.link,
        })
      }
    }
    return matches;
  } catch (err) {
    console.error('getDataMatches', err);
    return 'Ошибка';
  }
}

function conversionDataMatches(data) {
  try {
    if (!data)  return 'Ошибка';
    let string = '';
    data.forEach(el => {
      if (el.title) {
        string += `\r\n<b><i>${el.title}</i></b>\r\n`;
      } else {
        string += `${(el.result) ? '' : el.startTime[0] + ' '}<a href="http://championat.com${el.link}">${el.firstTeam.name} \u2014 ${el.secondTeam.name} </a>`;
        string += (el.result)
                    ? `${el.result.detailed.goal1}:${el.result.detailed.goal2} (${el.status})\r\n`
                    : `${el.status === 'Не начался' ? 'в ' + el.startTime[1] : el.status}\r\n`;
      }
    });
    return string || 'Нет подходящих матчей';
  } catch (err) {
    console.error('conversionDataMatches', err);
    return 'Ошибка';
  }
}

// Exports
module.exports = {
  getDataMatches,
  conversionDataMatches,
}