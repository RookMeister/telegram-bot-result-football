const Markup = require('telegraf/markup');

exports.welcome = `Добро пожаловать. Выбери чемпионат и что тебя интересует.`;
exports.help = `Выбирай`;

// Country
exports.country = [{ text: '🇷🇺' }, { text: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { text: '🇪🇸' }, { text: '🇮🇹' }, { text: '🇩🇪' }, { text: '🇫🇷' }];
exports.countryCode = {'🇷🇺': 31, '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 52, '🇪🇸': 49, '🇮🇹': 48, '🇩🇪': 50, '🇫🇷': 51};

// View
exports.viewResult = [{ text: 'Турнирная таблица'}, { text: 'Результаты'}, { text: 'Календарь'}];
exports.viewResultCode = {'Турнирная таблица': 'tournament_table', 'Результаты': 'last_matches', 'Календарь': 'future_matches'};

exports.countryKeyboard = Markup.keyboard([exports.country]).oneTime().removeKeyboard().resize().extra();
exports.viewResultKeyboard = Markup.keyboard([exports.viewResult]).oneTime().removeKeyboard().resize().extra();
exports.noneKeyboard = Markup.keyboard(['Повторить']).oneTime().removeKeyboard().resize().extra();

exports.mainButton = Markup.inlineKeyboard([
  // [Markup.callbackButton('🏴󠁧󠁢󠁥󠁮󠁧󠁿', 52)],
  // [Markup.callbackButton('🇪🇸', 49)],
  // [Markup.callbackButton('🇮🇹', 48)],
  // [Markup.callbackButton('🇩🇪', 50)],
  // [Markup.callbackButton('🇫🇷', 51)],
]).extra();