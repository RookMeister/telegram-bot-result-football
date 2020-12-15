const { getData } = require('./api')
const { getPagination, conversionDataForPagination } = require('./pagination');

async function getDataTournaments() {
  try {
    const data = await getData('tornaments');
    const tournaments = (data[0].name === 'Футбол') ? data[0].tournaments : null;
    // Исключение (лимит битов)
    return tournaments && tournaments.filter(el => el.name !== 'Босния и Герцеговина - Премьер-лига').map(el => el.name);
  } catch (err) {
    console.error('getDataTournaments', err);
    return 'Ошибка';
  }
}

async function tournamentsButtons({current, userData, allData}) {
  try {
    const options = conversionDataForPagination({current, userData, allData, countItem: 6});
    const pagination = getPagination({current, length: allData.length, countItem: 6});
    options.reply_markup.inline_keyboard.push(pagination.reply_markup.inline_keyboard[0]);
    return options;
  } catch (err) {
    console.error('tournamentsButtons', err);
    return 'Ошибка';
  }
}

// Exports
module.exports = {
  getDataTournaments,
  tournamentsButtons,
}