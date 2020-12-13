const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');

const clubs = new Scene('clubs');
const stage = new Stage();

stage.register(clubs)

// Exports
module.exports = {
  clubs,
  stage,
}