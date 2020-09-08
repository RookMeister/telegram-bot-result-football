const Markup = require('telegraf/markup');

class keyBoards {
  constructor() {
    this.mainMenu = [[{ text: 'Вчера'}, { text: 'Сегодня'}, { text: 'Завтра'}], [{ text: 'Чемпионаты'}]];
    this.viewResult = [{ text: 'Турнирная таблица'}, { text: 'Результаты'}, { text: 'Календарь'}];
    this.country = [{ text: '🇷🇺' }, { text: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { text: '🇪🇸' }, { text: '🇮🇹' }, { text: '🇩🇪' }, { text: '🇫🇷' }];
  }

  mainKeyboard() {
    return Markup.keyboard(this.mainMenu).oneTime().removeKeyboard().resize().extra();
  }

  countryKeyboard() {
    Markup.keyboard([this.country]).oneTime().removeKeyboard().resize().extra();
  }

  viewResultKeyboard() {
    Markup.keyboard([this.viewResult]).oneTime().removeKeyboard().resize().extra();
  }

  noneKeyboard() {
    Markup.keyboard(['Главное меню']).oneTime().removeKeyboard().resize().extra();
  }
}

module.exports = new keyBoards();

// exports.mainButton = Markup.inlineKeyboard([
  // [Markup.callbackButton('🏴󠁧󠁢󠁥󠁮󠁧󠁿', 52)],
  // [Markup.callbackButton('🇪🇸', 49)],
  // [Markup.callbackButton('🇮🇹', 48)],
  // [Markup.callbackButton('🇩🇪', 50)],
  // [Markup.callbackButton('🇫🇷', 51)],
// ]).extra();