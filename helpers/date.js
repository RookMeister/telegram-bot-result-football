const formatISO = require('date-fns/formatISO');
const startOfTomorrow = require('date-fns/startOfTomorrow');
const startOfYesterday = require('date-fns/startOfYesterday');
const startOfToday = require('date-fns/startOfToday');
const parseISO = require('date-fns/parseISO')
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const isPast = require('date-fns/isPast')
const format = require('date-fns/format');
const addHours = require('date-fns/addHours');
const ru = require( 'date-fns/locale/ru');


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

function getHoursTimeZone(date, hours) {
  const dateNew = addHours(parseISO(date), hours - 3);
  return [format(dateNew, 'd.M'), format(dateNew, 'HH:mm')];
}

function getDistanceToNow(date, hours) {
  const dateNew = addHours(parseISO(date), hours - 3);
  return formatDistanceToNow(dateNew, {locale: ru, addSuffix: true});
}

module.exports = {
  dayToIso,
  isPastDate,
  getDistanceToNow,
  getHoursTimeZone,
}