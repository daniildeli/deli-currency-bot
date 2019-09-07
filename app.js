const TelegramBot = require('node-telegram-bot-api');
const token = '858677831:AAEEm7cbSy5GV4J5Lr4ljagwXjAl3qMLQ-U';
const bot = new TelegramBot(token, { polling: true });
const request = require('request');
const currencyCodes = {
  UAH: 980,
  USD: 840,
  EUR: 978,
  RUB: 643,
  '980': {name: 'UAH', emoji: '🇺🇦'},
  '840': {name: 'USD', emoji: '🇺🇸'},
  '978': {name: 'EUR', emoji: '🇪🇺'},
  '643': {name: 'RUB', emoji: '🇷🇺'}
}
require('http').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
  res.end('')
})

function defaultReply(chatId) {
  bot.sendMessage(chatId, 'Choose currency', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'EUR',
            callback_data: currencyCodes.EUR
          },
          {
            text: 'USD',
            callback_data: currencyCodes.USD
          },
          {
            text: 'RUB',
            callback_data: currencyCodes.RUB
          }
        ]
      ]
    }
  });
}
function monobankRequest(query, id) {
  request(`https://api.monobank.ua//bank/currency`, function(err, response, body) {
    const result = JSON.parse(body).filter(item => +item.currencyCodeA === +query.data)[0];
    const message = `
      *${currencyCodes[`${result.currencyCodeA}`].name} ${currencyCodes[`${result.currencyCodeA}`].emoji} 💱 ${currencyCodes[`${result.currencyCodeB}`].name} ${currencyCodes[`${result.currencyCodeB}`].emoji}*
      Buy: __${result.rateBuy}__
      Sale: __${result.rateSell}__
    `;
    bot.sendMessage(id, message, {parse_mode: 'Markdown'});
    setInterval(() => {
      defaultReply(id);
    }, 1);
  })  
}
bot.onText(/\/curse/, (msg, match) => {
  const chatId = msg.chat.id;
  defaultReply(chatId);
});
bot.on('callback_query', query => {
  const id = query.message.chat.id;
  monobankRequest(query, id);
})