const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Championats
const tournaments = [
  // Россия
  'Россия - Премьер-Лига',
  //Англия
  'Англия - Премьер-лига',
  // Германия
  'Германия - Бундеслига',
  // Италия
  'Италия - Серия А',
  // Испания
  'Испания - Примера',
  // Франция
  'Франция - Лига 1',
  // Европа
  'Лига чемпионов',
  'Лига Европы',
  // Сборные
  'Лига наций УЕФА',
];

const UserSchema = new Schema({
	username: String,
	timeZone: { type: String, default: '0' },
  chat_id: { type: Number, unique: true },
  onScheduler: { type: Boolean, default: false },
	createdAt: { type: String, default: new Date().toLocaleString('ru-RU', { hour12: false }) },
  subscribeTournaments: { type: [String], default: tournaments },
  likeClub: [String],
});

const User = mongoose.model('user', UserSchema);

module.exports = User;