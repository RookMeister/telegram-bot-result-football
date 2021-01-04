const Markup = require('telegraf/markup');

const inInline = (array, size = 3, column = false) => {
  const key = array.map((el) => {
    if (typeof(el) === 'string') {
      return Markup.callbackButton(el, el)
    } else {
      return Markup.callbackButton(el.title, el.value)
    }
  })
  const res = []; //массив в который будет выведен результат.
  if (column) {
    let length = key.length;
    let start = 0;
    for (let i = 0; i < size; i++){
      res[i] = key.slice(start, start + Math.ceil(length/size));
      start += Math.ceil(length/size);
      length -= Math.ceil(length/size);
    }
  } else {
    for (let i = 0; i < Math.ceil(key.length/size); i++){
      res[i] = key.slice((i*size), (i*size) + size);
    }
  }
  return Markup.inlineKeyboard([...res]).extra();
};

const backToKey = [ '🔙Назад к настройкам' ];
const unSubscribeKey = [ '✖Отписаться', '🔙Назад к настройкам' ];
const subscribeKey = [ '✔Подписаться', '🔙Назад к настройкам' ];
const dateKey = [ 'Вчера', 'Сегодня', 'Завтра' ];
const viewSubscribeKey = [ 'Турниры', 'Клубы', '🔙Назад к настройкам' ];
const countryKey = [
  { title: '🇷🇺', value: 31 },
  { title: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', value: 52 },
  { title: '🇪🇸', value: 49 },
  { title: '🇮🇹', value: 48 },
  { title: '🇩🇪', value: 50 },
  { title: '🇫🇷', value: 51 },
];
const statViewKey = [
  { title: 'Таблица', value: 'tournament_table' },
  { title: 'Результаты', value: 'last_matches' },
  { title: 'Календарь', value: 'future_matches' },
];
const timeZoneKey = ['-12','-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','0','+1','+2','+3','+4','+5','+6','+7','+8','+9','+10','+11']
const settingsKey = ['Подписки', 'Рассылки', 'Настроить время', 'О боте'];

const dateKBInline = inInline(dateKey);
const countryKBInline = inInline(countryKey, 6);
const statViewKBInline = inInline(statViewKey);
const unSubscribeKBInline = inInline(unSubscribeKey, 1);
const subscribeKBInline = inInline(subscribeKey, 1);
const timeZoneKBInline = inInline(timeZoneKey, 6);
const settingsKBInline = inInline(settingsKey, 3, true);
const viewSubscribeKBInline = inInline(viewSubscribeKey, 2);
const backToKBInline = inInline(backToKey, 1);
const deleteKBInline = inInline(['❌ Удалить'], 1);

const mainKeyboard = Markup.keyboard([[{text: 'Матч-центр'}, {text: 'Статистика'}], [{text: 'Настройки'}]]).resize().extra();

// Exports
module.exports = {
  inInline,
  countryKey,
  statViewKey,
  timeZoneKey,
  dateKBInline,
  countryKBInline,
  statViewKBInline,
  unSubscribeKBInline,
  subscribeKBInline,
  timeZoneKBInline,
  settingsKBInline,
  viewSubscribeKBInline,
  backToKBInline,
  mainKeyboard,
  deleteKBInline,
}