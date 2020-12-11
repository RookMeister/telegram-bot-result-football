const { inInline } = require('./keyboards');
const { getData } = require('./api')
const { getPagination } = require('./pagination');

function getDataTournaments(data) {
  const tournaments = (data[0].name === 'Футбол') ? data[0].tournaments : null;
  return tournaments && tournaments.map(el => el.name);
}

function conversionDataTournaments({current, userTornaments, allTornaments}) {
  const result = []
  allTornaments.forEach((el, i) => {
    const condition = (i >= (current - 1) * 5) && (i < current * 5)
    if (condition) {
      const inArr = userTornaments.includes(el);
      result.push(inArr ? '✅ '+el : '🚫 '+el);
    };
  });
  const buttons = inInline(result, 1)
  return buttons;
}

async function tournamentsButtons({current, userTornaments}) {
  const json = await getData('tornaments');
  const allTornaments = getDataTournaments(json);
  const options = conversionDataTournaments({current, userTornaments, allTornaments});
  const pagination = getPagination({current, length: allTornaments.length});
  options.reply_markup.inline_keyboard.push(pagination.reply_markup.inline_keyboard[0]);
  return options;
}

// Exports
module.exports = {
  tournamentsButtons,
}