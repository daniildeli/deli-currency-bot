const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const { BOT_TOKEN, APP_URL, } = process.env;

if (!BOT_TOKEN) {
  throw new Error('Please provide a correct bot token');
}

if (!APP_URL) {
  throw new Error('Please provide a correct app url');
}

const options = {
  webHook: {
    port: process.env.PORT,
  },
};

const bot = new TelegramBot(BOT_TOKEN, options);
bot.setWebHook(`${APP_URL}/bot${BOT_TOKEN}`);

const currencyCodes = {
  UAH: { code: 980, emoji: '🇺🇦', },
  USD: { code: 840, emoji: '🇺🇸', },
  EUR: { code: 978, emoji: '🇪🇺', },
};
function getTitleByCode(value) {
  return Object.keys(currencyCodes).find(key => currencyCodes[key].code === +value) || 'Unknown currency';
}
async function defaultReply(chatId) {
  await bot.sendMessage(chatId, 'Choose currency', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '€ - EUR',
            callback_data: currencyCodes.EUR.code,
          },
          {
            text: '$ - USD',
            callback_data: currencyCodes.USD.code,
          }
        ]
      ],
    },
  });
}
function monobankRequest(query, id) {
  request('https://api.monobank.ua/bank/currency', async function(err, response, body) {
    const result = JSON.parse(body).filter(item => +item.currencyCodeA === +query.data)[0];
    const currencyA = getTitleByCode(result.currencyCodeA);
    const currencyB = getTitleByCode(result.currencyCodeB);
    const message = `
      *${currencyA} ${currencyCodes[currencyA].emoji} 💱 ${currencyB} ${currencyCodes[currencyB].emoji}*
      Buy: __${result.rateBuy}__
      Sale: __${result.rateSell}__
    `;
    await bot.sendMessage(id, message, { parse_mode: 'Markdown', });
    await defaultReply(id);
  });
}
bot.onText(/\/curse/, async msg => {
  const chatId = msg.chat.id;
  await defaultReply(chatId);
});
bot.on('callback_query', query => {
  const id = query.message.chat.id;
  monobankRequest(query, id);
});
