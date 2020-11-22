const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const UserSchema = new Schema({
	username: String,
  chat_id: Number,
  onScheduler: { type: Boolean, default: false },
	createdAt: { type: String, default: new Date().toLocaleString('ru-RU', { hour12: false }) },
  // likeClub: [String],
});

const User = mongoose.model('user', UserSchema);

module.exports = User;