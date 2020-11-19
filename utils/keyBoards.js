const Markup = require('telegraf/markup');

const inInline = (array) => {
  const key = array.map((el) => {
    if (typeof(el) === 'string') {
      return Markup.callbackButton(el, el)
    } else {
      return Markup.callbackButton(el.title, el.value)
    }
  })
  return Markup.inlineKeyboard([[...key]]).extra();
};

const footballScores = [ 'Вчера', 'Сегодня', 'Завтра' ];
const countryCode = [
  { title: '🇷🇺', value: 31 },
  { title: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', value: 52 },
  { title: '🇪🇸', value: 49 },
  { title: '🇮🇹', value: 48 },
  { title: '🇩🇪', value: 50 },
  { title: '🇫🇷', value: 51 },
];
const viewCode = [
  { title: 'Таблица', value: 'tournament_table' },
  { title: 'Результаты', value: 'last_matches' },
  { title: 'Календарь', value: 'future_matches' },
];

function mainKeyboard() {
  return Markup.keyboard([[{ text: ' Матч-центр'}, { text: 'Статистика'}]]).resize().extra();
}

const footballScoresKeyBoardInline = inInline(footballScores);

const countryKeyBoardInline = inInline(countryCode);

const viewResultKeyBoardInline = inInline(viewCode);

// Exports
module.exports = {
  countryCode,
  viewCode,
  mainKeyboard,
  footballScoresKeyBoardInline,
  countryKeyBoardInline,
  viewResultKeyBoardInline,
}