const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: String,
	timeZone: { type: String, default: '0' },
  chat_id: { type: Number, unique: true },
  onScheduler: { type: Boolean, default: false },
	createdAt: { type: String, default: new Date().toLocaleString('ru-RU', { hour12: false }) },
  // likeClub: [String],
});

const User = mongoose.model('user', UserSchema);

module.exports = User;