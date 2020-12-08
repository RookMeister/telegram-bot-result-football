const Markup = require('telegraf/markup');

const inInline = (array, size = 3) => {
  const key = array.map((el) => {
    if (typeof(el) === 'string') {
      return Markup.callbackButton(el, el)
    } else {
      return Markup.callbackButton(el.title, el.value)
    }
  })
  const res = []; //массив в который будет выведен результат.
  for (let i = 0; i < Math.ceil(key.length/size); i++){
    res[i] = key.slice((i*size), (i*size) + size);
  }
  return Markup.inlineKeyboard([...res]).extra();
};

const unSubscribeAnswer = [ '✖Отписаться' ];
const subscribeAnswer = [ '✔Подписаться' ];
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
const timeZone = ['-12','-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','0','+1','+2','+3','+4','+5','+6','+7','+8','+9','+10','+11']

const mainKeyboard = Markup.keyboard([[{text: 'Матч-центр'}, {text: 'Статистика'}], [{text: 'Настройки'}]]).resize().extra();
const settingsKeyboard = Markup.keyboard([[{text: 'Подписки'}, {text: 'Рассылки'}], [{text: 'Настроить время'}], [{text: 'О боте'}], [{ text: '🔙Назад'}]]).resize().extra();

const footballScoresKeyBoardInline = inInline(footballScores);
const countryKeyBoardInline = inInline(countryCode);
const viewResultKeyBoardInline = inInline(viewCode);
const unSubscribeAnswerKeyBoardInline = inInline(unSubscribeAnswer);
const subscribeAnswerKeyBoardInline = inInline(subscribeAnswer);
const timeZoneKeyBoardInline = inInline(timeZone, 6);

// Exports
module.exports = {
  inInline,
  timeZone,
  countryCode,
  viewCode,
  mainKeyboard,
  footballScoresKeyBoardInline,
  countryKeyBoardInline,
  viewResultKeyBoardInline,
  unSubscribeAnswerKeyBoardInline,
  subscribeAnswerKeyBoardInline,
  settingsKeyboard,
  timeZoneKeyBoardInline,
}