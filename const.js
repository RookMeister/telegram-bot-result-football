const Markup = require('telegraf/markup');

exports.welcome = `Добро пожаловать. Выбери чемпионат и что тебя интересует.`;
exports.help = `Выбирай`;

// Main
exports.mainMenu = [[{ text: 'Вчера'}, { text: 'Сегодня'}, { text: 'Завтра'}], [{ text: 'Чемпионатw'}]];

// Championats
exports.champions = ['Россия - Премьер-Лига', 'Лига чемпионов', 'Лига наций УЕФА', 'Лига Европы', 'Англия - Премьер-лига', 'Испания - Примера', 'Кубок Англи', 'Суперкубок Англи', 'Суперкубок Германии', 'Германия - Бундеслига', 'Суперкубок Италии', 'Кубок Италии', 'Италия - Серия А', 'Суперкубок Испании', '"Франция - Лига 1', 'Суперкубок Франции', 'Франция - Лига 1', 'Товарищеские матчи (сборные', 'Кубок Германии', 'Кубок Росси', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

// Country
exports.country = [{ text: '🇷🇺' }, { text: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { text: '🇪🇸' }, { text: '🇮🇹' }, { text: '🇩🇪' }, { text: '🇫🇷' }];
exports.countryCode = {'🇷🇺': 31, '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 52, '🇪🇸': 49, '🇮🇹': 48, '🇩🇪': 50, '🇫🇷': 51};
exports.regexpContry = new RegExp(exports.country.map(el => el.text).join("|"));

// View
exports.viewResult = [{ text: 'Турнирная таблица'}, { text: 'Результаты'}, { text: 'Календарь'}];
exports.viewResultCode = {'Турнирная таблица': 'tournament_table', 'Результаты': 'last_matches', 'Календарь': 'future_matches'};
exports.regexpViewResult = new RegExp(exports.viewResult.map(el => el.text).join("|"));

exports.mainKeyboard = Markup.keyboard(exports.mainMenu).oneTime().removeKeyboard().resize().extra();
exports.countryKeyboard = Markup.keyboard([exports.country]).oneTime().removeKeyboard().resize().extra();
exports.viewResultKeyboard = Markup.keyboard([exports.viewResult]).oneTime().removeKeyboard().resize().extra();
exports.noneKeyboard = Markup.keyboard(['Главное меню']).oneTime().removeKeyboard().resize().extra();

exports.mainButton = Markup.inlineKeyboard([
  // [Markup.callbackButton('🏴󠁧󠁢󠁥󠁮󠁧󠁿', 52)],
  // [Markup.callbackButton('🇪🇸', 49)],
  // [Markup.callbackButton('🇮🇹', 48)],
  // [Markup.callbackButton('🇩🇪', 50)],
  // [Markup.callbackButton('🇫🇷', 51)],
]).extra();