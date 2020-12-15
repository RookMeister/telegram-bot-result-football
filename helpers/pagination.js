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
  const maxButtons = (maxPages < 5) ? maxPages : 5;
  let startPage = Math.max(current - Math.floor(maxButtons / 2), 1);
  let endPage = startPage + maxButtons;
  let lastPag = maxPages + '>>';
  if (endPage > maxPages) {
    endPage = maxPages;
    startPage = endPage - maxButtons + 1;
    lastPag = maxPages;
  }
  let firstPag = (startPage > 1) ? '<<1' : startPage;
  const buttonsArray = [];
  for (let i = startPage; i < endPage; i++) {
    buttonsArray.push(i.toString())
  }
  buttonsArray[0] = firstPag.toString();
  buttonsArray[maxButtons-1] = lastPag.toString();
  const buttons = inInline(buttonsArray, maxButtons);
  return buttons;
}

// Exports
module.exports = {
  getPagination,
  conversionDataForPagination,
}