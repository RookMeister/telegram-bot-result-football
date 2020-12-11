const { dayToIso } = require('./date');

// URL Statistic Tornaments
function urlStat({country, view}) {
  return `https://www.sports.ru/core/stat/gadget/${view}/?args={%22tournament_id%22:${country}}`;
}

// URL Match Center
function urlMatches({date}) {
  const stringDate = dayToIso(date)
  return `https://www.championat.com/stat/football/${stringDate}.json`;
}

// URL Tornaments
function urlTornaments() {
  return 'https://www.championat.com/stat/tournament/search/';
}

// Exports
module.exports = {
  urlStat,
  urlMatches,
  urlTornaments,
}