const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');

const clubs = new Scene('clubs');
const tornaments = new Scene('tornaments');
const stage = new Stage();

stage.register(clubs);
stage.register(tornaments);

// Exports
module.exports = {
  tornaments,
  clubs,
  stage,
}