const { inInline } = require('./keyboards');

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

// Exports
module.exports = {
  getDataTournaments,
  conversionDataTournaments,
}