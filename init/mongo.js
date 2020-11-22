// Dependencies
const mongoose = require('mongoose')

/**
 * Setting up mongoose
 */
function setupMongoose() {
  // Connect to the db
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Reconnect on disconnect
  mongoose.connection.on('disconnected', () => {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
  });
}

// Exports
module.exports = setupMongoose;