const { inInline } = require('./keyboards');

function getPagination({current, length}) {
  const maxPages = Math.ceil(length/5);
  const pagination1 = (current < 4) ? '1' : '<<1';
  const pagination2 = (current < 4) ? '2' : (current-1).toString();
  const pagination3 = (current < 4) ? '3' : current.toString();
  const pagination4 = (current < 4) ? '4' : (current+1).toString();
  const pagination5 = (current < maxPages) ? maxPages+'>>' : maxPages.toString();
  const buttonsArray = [pagination1, pagination2, pagination3, pagination4, pagination5]
  const buttons = inInline(buttonsArray, 5 );
  return buttons;
}

// Exports
module.exports = {
  getPagination,
}