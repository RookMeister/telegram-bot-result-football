exports.welcome = `Добро пожаловать. Выбери чемпионат и что тебя интересует.`;
exports.help = `Выбирай`;

// Championats
exports.champions =  [
      // Россия
      'Россия - Премьер-Лига',
      'Кубок России',
      //Англия
      'Англия - Премьер-лига',
      'Кубок Англии',
      'Суперкубок Англии',
      // Германия
      'Суперкубок Германии',
      'Германия - Бундеслига',
      'Кубок Германии',
      // Италия
      'Суперкубок Италии',
      'Кубок Италии',
      'Италия - Серия А',
      // Испания
      'Испания - Примера',
      'Суперкубок Испании',
      // Франция
      'Франция - Лига 1',
      'Суперкубок Франции',
      // Европа
      'Лига чемпионов',
      'Лига Европы',
      // Сборные
      'Товарищеские матчи (сборные)',
      'Лига наций УЕФА',
    ];

// Country
exports.country = [{ text: '🇷🇺' }, { text: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { text: '🇪🇸' }, { text: '🇮🇹' }, { text: '🇩🇪' }, { text: '🇫🇷' }];
exports.countryCode = {'🇷🇺': 31, '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 52, '🇪🇸': 49, '🇮🇹': 48, '🇩🇪': 50, '🇫🇷': 51};
exports.regexpContry = new RegExp(exports.country.map(el => el.text).join("|"));

// View
exports.viewResult = [{ text: 'Турнирная таблица'}, { text: 'Результаты'}, { text: 'Календарь'}];
exports.viewResultCode = {'Турнирная таблица': 'tournament_table', 'Результаты': 'last_matches', 'Календарь': 'future_matches'};
exports.regexpViewResult = new RegExp(exports.viewResult.map(el => el.text).join("|"));