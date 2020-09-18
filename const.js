

// Country
exports.country = [{ text: '🇷🇺' }, { text: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { text: '🇪🇸' }, { text: '🇮🇹' }, { text: '🇩🇪' }, { text: '🇫🇷' }];
exports.countryCode = {'🇷🇺': 31, '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 52, '🇪🇸': 49, '🇮🇹': 48, '🇩🇪': 50, '🇫🇷': 51};
exports.regexpContry = new RegExp(exports.country.map(el => el.text).join("|"));

// View
exports.viewResult = [{ text: 'Турнирная таблица'}, { text: 'Результаты'}, { text: 'Календарь'}];
exports.viewResultCode = {'Турнирная таблица': 'tournament_table', 'Результаты': 'last_matches', 'Календарь': 'future_matches'};
exports.regexpViewResult = new RegExp(exports.viewResult.map(el => el.text).join("|"));