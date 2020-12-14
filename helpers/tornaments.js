const { getData } = require('./api')
const { getPagination, conversionDataForPagination } = require('./pagination');

async function getDataTournaments() {
  const data = await getData('tornaments');
  const tournaments = (data[0].name === 'Футбол') ? data[0].tournaments : null;
  return tournaments && tournaments.map(el => el.name);
}

async function tournamentsButtons({current, userData, allData}) {
  const options = conversionDataForPagination({current, userData, allData, countItem: 5});
  const pagination = getPagination({current, length: allData.length, countItem: 5});
  options.reply_markup.inline_keyboard.push(pagination.reply_markup.inline_keyboard[0]);
  return options;
}

// Exports
module.exports = {
  getDataTournaments,
  tournamentsButtons,
}