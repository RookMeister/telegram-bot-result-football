const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Championats
const champions =  [
  // Россия
  'Россия - Премьер-Лига',
  'Кубок России',
  //Англия
  'Англия - Премьер-лига',
  'Кубок Англии',
  'Суперкубок Англии',
  'Англия - Кубок лиги',
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

const UserSchema = new Schema({
	username: String,
  chat_id: Number,
  onScheduler: { type: Boolean, default: false },
	subscriptions: { type: [String], default: champions },
	createdAt: { type: String, default: new Date().toLocaleString('ru-RU', { hour12: false }) },
  // likeClub: [String],
});

const User = mongoose.model('user', UserSchema);

module.exports = User;