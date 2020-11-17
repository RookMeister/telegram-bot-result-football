const formatISO = require('date-fns/formatISO');
const startOfTomorrow = require('date-fns/startOfTomorrow');
const startOfYesterday = require('date-fns/startOfYesterday');
const startOfToday = require('date-fns/startOfToday');
const parseISO = require('date-fns/parseISO')
const isPast = require('date-fns/isPast')


function dayToIso(day) {
  if (day === 'prev') {
    return formatISO(startOfYesterday(), { representation: 'date' })
  } else if (day === 'next') {
    return formatISO(startOfTomorrow(), { representation: 'date' })
  }
  return formatISO(startOfToday(), { representation: 'date' });
}

function isPastDate(date) {
  return isPast(parseISO(date));
}

module.exports = {
  dayToIso,
  isPastDate,
}