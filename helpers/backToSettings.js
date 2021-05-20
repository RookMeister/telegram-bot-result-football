const { settingsKBInline } = require('../helpers/keyboards');

function showSettings(ctx, editMessage = false, leave = false) {
  const options = settingsKBInline;
  const info = ctx.i18n.t('titleTimeZone');
  editMessage ? ctx.editMessageText(info, options) : ctx.replyWithHTML(info, options);
  if (leave) {
    ctx.scene.leave();
  }
}

// Exports
module.exports = {
  showSettings,
}