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


bot.onText(/\/curse/, (msg, match) => {
  const chatId = msg.chat.id;
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
          // {
          //   text: 'BTC',
          //   callback_data: 'BTC'
          // }
        ]
      ]
    }
  });
});

bot.on('callback_query', query => {
  console.log(query);
  const id = query.message.chat.id;

  // ------ PrivatBank API ------------

  // const date = new Date();
  // const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
  // const month = date.getMonth() + 1 > 9 ? date.getMonth() : `0${date.getMonth()}`
  // request(`https://api.privatbank.ua/p24api/exchange_rates?json&date=${day}.${month}.${date.getFullYear()}`, function(err, response, body) {
  //   const data = JSON.parse(body);
  //   const result = data.exchangeRate.filter(item => item.currency === query.data)[0]
  //   console.log(result);
  //   const message = `
  //     *${result.currency} => ${result.baseCurrency}*
  //     Buy: __${result.purchaseRate}__
  //     Sale: __${result.saleRate}__
  //   `;
  //   bot.sendMessage(id, message, {parse_mode: 'Markdown'});
  // })

  // ----------- MonoBank API -----------
  request(`https://api.monobank.ua//bank/currency`, function(err, response, body) {
    const data = JSON.parse(body);
    const result = data.filter(item => +item.currencyCodeA === +query.data)[0];
    // console.log(result, query.data)
    const message = `
      *${currencyCodes[`${result.currencyCodeA}`].name} ${currencyCodes[`${result.currencyCodeA}`].emoji} 💱 ${currencyCodes[`${result.currencyCodeB}`].name} ${currencyCodes[`${result.currencyCodeB}`].emoji}*
      Buy: __${result.rateBuy}__
      Sale: __${result.rateSell}__
    `;
    bot.sendMessage(id, message, {parse_mode: 'Markdown'});
  })  
})

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });