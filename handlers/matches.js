const { dateKBInline } = require('../helpers/keyboards');
const { getData } = require('../helpers/api');
const { getDataMatches, conversionDataMatches } = require('../helpers/matches');
const { UserModel } = require('../models/user');

function setupMatches(bot) {
  bot.hears('Матч-центр', (ctx) => getMatches(ctx, 'now'));
  bot.action('Вчера', (ctx) => getMatches(ctx, 'prev', true));
  bot.action('Сегодня', (ctx) => getMatches(ctx, 'now', true));
  bot.action('Завтра', (ctx) => getMatches(ctx, 'next', true));
}

async function getMatches(ctx, date, editMessage) {
  const userData = ctx.session.user;
  const json = await getData('matches', { date });
  const data = getDataMatches({data: json, subscriptions: userData.subscribeTournaments, timeZone: Number(userData.timeZone)});
  const options = dateKBInline;
  options.disable_web_page_preview = true;
  const info = conversionDataMatches(data);
  if (ctx.session.lastInfo === info) {
    await ctx.answerCbQuery(ctx.i18n.t('lastInfo'));
    return;
  }
  ctx.session.lastInfo = info;
  if (editMessage) {
    options.parse_mode = 'HTML';
    ctx.editMessageText(info, options);
  } else {
    ctx.replyWithHTML(info, options);
  }

  await UserModel.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: { lastActionTime: new Date() } });
}

// Exports
module.exports = {
  setupMatches,
}