const Markup = require('telegraf/markup');

module.exports = class keyBoards {
  constructor() {
    this.mainMenu = [[{ text: 'Вчера'}, { text: 'Сегодня'}, { text: 'Завтра'}], [{ text: 'Чемпионаты'}]];
    this.viewResult = [[{ text: 'Турнирная таблица'}, { text: 'Результаты'}, { text: 'Календарь'}],['Главное меню']];
    this.country = [[{ text: '🇷🇺' }, { text: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { text: '🇪🇸' }, { text: '🇮🇹' }, { text: '🇩🇪' }, { text: '🇫🇷' }],['Главное меню']];
  }

  mainKeyboard() {
    return Markup.keyboard(this.mainMenu).oneTime().resize().extra();
  }

  countryKeyboard() {
    return Markup.keyboard(this.country).oneTime().removeKeyboard().resize().extra();
  }

  viewResultKeyboard() {
    return Markup.keyboard(this.viewResult).oneTime().removeKeyboard().resize().extra();
  }

  noneKeyboard() {
    return Markup.keyboard(['Главное меню']).oneTime().removeKeyboard().resize().extra();
  }
}

// exports.mainButton = Markup.inlineKeyboard([
  // [Markup.callbackButton('🏴󠁧󠁢󠁥󠁮󠁧󠁿', 52)],
  // [Markup.callbackButton('🇪🇸', 49)],
  // [Markup.callbackButton('🇮🇹', 48)],
  // [Markup.callbackButton('🇩🇪', 50)],
  // [Markup.callbackButton('🇫🇷', 51)],
// ]).extra();