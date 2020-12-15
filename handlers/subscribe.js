const { UserModel } = require('../models/user');
const { clubs, tornaments } = require('../init/scene');
const { clubsButtons, getDataClubs } = require('../helpers/clubs');
const { tournamentsButtons, getDataTournaments } = require('../helpers/tornaments');
const { countryKey, countryKBInline, subscribeKBInline, unSubscribeKBInline, backToKBInline } = require('../helpers/keyboards');
const { showSettings } = require('../helpers/backToSettings');

//Subscribe Every Day

async function isSubscribe(ctx, isSubscribe = false) {
  const string = isSubscribe ? 'Теперь после окончания матчей, вам будет приходить пуш с результатами матчей.' : 'Ты всегда можешь подписаться';
  const keyboard = isSubscribe ? unSubscribeKBInline : subscribeKBInline;
  const info = isSubscribe ? 'Вы подписались' : 'Вы отписались';
  const data = isSubscribe ? { onScheduler: true } : { onScheduler: false };
  await UserModel.findOneAndUpdate({chat_id: ctx.chat.id}, { $set: data }, function (err, data) {
    if (err) return console.log(err);
  });
  await ctx.answerCbQuery(info);
  ctx.editMessageText(string, keyboard);
}

//Subscribe Clubs

clubs.enter((ctx) => selectCountry(ctx));
clubs.action(new RegExp(countryKey.map(el => el.value).join("|")), (ctx) => getAllListSubscribe(ctx, 'clubs'));
clubs.action('🔙Назад к настройкам', (ctx) => showSettings(ctx, true, true));
clubs.on('callback_query', (ctx) => callbackQuery(ctx, 'clubs'));

function selectCountry(ctx) {
  const info = 'Выберите чемпионат.';
  const options =  countryKBInline;
  ctx.editMessageText(info, options);
}

//Subscribe Tornaments

tornaments.enter((ctx) => getAllListSubscribe(ctx, 'tornaments'));
tornaments.action('🔙Назад к настройкам', (ctx) => showSettings(ctx, true, true));
tornaments.on('callback_query', (ctx) => callbackQuery(ctx, 'tornaments'));

//

async function getAllListSubscribe(ctx, viewSubscribe) {
  try {
    const data = (viewSubscribe === 'clubs') ? await getDataClubs(ctx.match.input): await getDataTournaments();
    ctx.session.allData = data;
    listSubscribe(ctx, 1, viewSubscribe)
  } catch (err) {
    console.error('getAllListSubscribe', err);
    return 'Ошибка';
  }
}

async function listSubscribe(ctx, curentPage, viewSubscribe) {
  try {
    const current = curentPage || parseInt(ctx.callbackQuery.data.match(/\d+/))
    ctx.session.currentPagePagination = current;
    const allData = ctx.session.allData;
    const userData = (viewSubscribe === 'clubs') ? ctx.session.user.likeClub : ctx.session.user.subscribeTournaments;
    const options = (viewSubscribe === 'clubs')
                    ? await clubsButtons({current, userData, allData})
                    : await tournamentsButtons({current, userData, allData});
    options.reply_markup.inline_keyboard.push(backToKBInline.reply_markup.inline_keyboard[0]);
    const info = `${(viewSubscribe === 'clubs') ? 'Клубы. ' : 'Турниры. '}Страница №${current}`;
    ctx.editMessageText(info, options);
  } catch (err) {
    console.error('listSubscribe', err);
    return 'Ошибка';
  }
}

async function callbackQuery(ctx, viewSubscribe) {
  try {
    let userData = null;
    const allData = ctx.session.allData;
    const query = ctx.callbackQuery.data;
    const re = new RegExp('✅|🚫');
    if (re.test(query)) {
      let info = '';
      let data = null;
      const isReg = new RegExp('✅');
      const notIsReg = new RegExp('🚫');
      const val = query.replace(re, '').trim();
      const value = (viewSubscribe === 'clubs') ? { likeClub: val } : { subscribeTournaments: val };
      if (notIsReg.test(query)) {
        data = await UserModel.findOneAndUpdate({chat_id: ctx.chat.id}, { $addToSet : value}, { new: true } );
        info = 'Подписался';
      } else if (isReg.test(query)) {
        data = await UserModel.findOneAndUpdate({chat_id: ctx.chat.id}, { $pull : value}, { new: true });
        info = 'Отписался';
      }
      userData = (viewSubscribe === 'clubs') ? data.likeClub : data.subscribeTournaments;
      const current = ctx.session.currentPagePagination || 1;
      await ctx.answerCbQuery(info);
      const options = (viewSubscribe === 'clubs')
                      ? await clubsButtons({current, userData, allData})
                      : await tournamentsButtons({current, userData, allData});
      ctx.editMessageReplyMarkup(options.reply_markup);
    } else {
      listSubscribe(ctx, 0, viewSubscribe);
    }
  } catch (err) {
    console.error('callbackQuery', err);
    return 'Ошибка';
  }
}

function setupSubscribe(bot) {
  bot.action('✔Подписаться', (ctx) => isSubscribe(ctx, true));
  bot.action('✖Отписаться', (ctx) => isSubscribe(ctx));
  bot.action('Клубы', (ctx) => ctx.scene.enter('clubs'));
  bot.action('Турниры', (ctx) => ctx.scene.enter('tornaments'));
}

// Exports
module.exports = {
  setupSubscribe,
}