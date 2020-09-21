const formatISO = require('date-fns/formatISO');
const startOfTomorrow = require('date-fns/startOfTomorrow');
const startOfYesterday = require('date-fns/startOfYesterday');
const startOfToday = require('date-fns/startOfToday');

module.exports = (time) => {
  if (time === 'prev') {
    return formatISO(startOfYesterday(), { representation: 'date' })
  } else if (time === 'next') {
    return formatISO(startOfTomorrow(), { representation: 'date' })
  }
  return formatISO(startOfToday(), { representation: 'date' });
}