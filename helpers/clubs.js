const { getData } = require('../helpers/api');
const { getDataStat } = require('../helpers/statistics');
const { getPagination, conversionDataForPagination } = require('./pagination');

async function getDataClubs(country) {
  const json = await getData('stat', { country, view: 'tournament_table' });
  const data = getDataStat(json);
  return data.map(el => el['Команда']);
}

function clubsButtons({current, userData, allData}) {
  const options = conversionDataForPagination({current, userData, allData, countItem: 8});
  const pagination = getPagination({current, length: allData.length, countItem: 8});
  options.reply_markup.inline_keyboard.push(pagination.reply_markup.inline_keyboard[0]);
  return options;
}

// fun

// Exports
module.exports = {
  getDataClubs,
  clubsButtons,
}