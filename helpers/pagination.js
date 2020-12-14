const { inInline } = require('./keyboards');

function conversionDataForPagination({current, userData, allData, countItem}) {
  const result = []
  allData.forEach((el, i) => {
    const condition = (i >= (current - 1) * countItem) && (i < current * countItem)
    if (condition) {
      const inArr = userData.includes(el);
      result.push(inArr ? '✅ '+el : '🚫 '+el);
    };
  });
  const buttons = inInline(result, 1)
  return buttons;
}

function getPagination({current, length, countItem}) {
  const maxPages = Math.ceil(length/countItem);
  const pagination1 = (current < 4) ? '1' : '<<1';
  const pagination2 = (current < 4) ? '2' : (current-1).toString();
  const pagination3 = (current < 4) ? '3' : current.toString();
  const pagination4 = (current < 4) ? '4' : (current+1).toString();
  const pagination5 = (current < maxPages) ? maxPages+'>>' : maxPages.toString();
  const buttonsArray = [pagination1, pagination2, pagination3, pagination4, pagination5]
  const buttons = inInline(buttonsArray, 5);
  return buttons;
}

// Exports
module.exports = {
  getPagination,
  conversionDataForPagination,
}