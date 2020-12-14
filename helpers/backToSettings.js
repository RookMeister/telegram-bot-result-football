const { settingsKBInline } = require('../helpers/keyboards');

function showSettings(ctx, editMessage = false, leave = false) {
  const options = settingsKBInline;
  const info = 'Здесь вы можете выбрать часовой пояс и узнать на какие пуши вы подписаны';
  editMessage ? ctx.editMessageText(info, options) : ctx.replyWithHTML(info, options);
  if (leave) {
    ctx.scene.leave();
  }
}

// Exports
module.exports = {
  showSettings,
}