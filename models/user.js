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
  isSendMatches: { type: Boolean, default: false },
  isSendLikeClub: { type: Boolean, default: false },
  subscribeTournaments: { type: [String], default: tournaments },
  likeClub: [String],
}, {
  timestamps: true,
});

const UserModel = mongoose.model('user', UserSchema);

async function findUser({id, username}) {
  let user = await UserModel.findOne({ chat_id: id })
  if (!user) {
    try {
      user = await new UserModel({ chat_id: id, username }).save()
      console.log(`Сохранен пользователь ${username}`);
    } catch (err) {
      user = await UserModel.findOne({ chat_id: id })
    }
  }
  return user
}

async function findAllUsers() {
  return  UserModel.find({});
}

module.exports = { UserModel, findUser, findAllUsers };