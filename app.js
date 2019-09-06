const TelegramBot = require('node-telegram-bot-api');
const token = '858677831:AAEEm7cbSy5GV4J5Lr4ljagwXjAl3qMLQ-U';
const bot = new TelegramBot(token, { polling: true });
const request = require('request');


bot.onText(/\/curse/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Выберите валюту', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'EUR',
            callback_data: 'EUR'
          },
          {
            text: 'USD',
            callback_data: 'USD'
          },
          {
            text: 'RUB',
            callback_data: 'RUB'
          },
          {
            text: 'BTC',
            callback_data: 'BTC'
          }
        ]
      ]
    }
  });
});

bot.on('callback_query', query => {
  console.log(query);
  const id = query.message.chat.id;
  // fetch('https://api.monobank.ua/bank/currency', {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*'
  //   }
  // })
  //   .then(data => {
  //     console.log(data);
  //     bot.sendMessage(id, JSON.stringify(data));
  //   })
  //   .catch(err => {
  //     console.log('Error');
  //     bot.sendMessage(id, JSON.stringify(err));
  //   })
  const date = new Date();
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
  const month = date.getMonth() + 1 > 9 ? date.getMonth() : `0${date.getMonth()}`
  request(`https://api.privatbank.ua/p24api/exchange_rates?json&date=${day}.${month}.${date.getFullYear()}`, function(err, response, body) {
    const data = JSON.parse(body);
    const result = data.exchangeRate.filter(item => item.currency === query.data)[0]
    console.log(result);
    bot.sendMessage(id, JSON.stringify(result));
  })

  // const promise = new Promise((resolve, reject) => {
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('GET', 'https://api.monobank.ua/bank/currency');
  //   xhr.setRequestHeader("Content-Type", "application/json");
  //   xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  //   xhr.send();
  //   xhr.onreadystatechange = function() {
  //     if (xhr.status !== 200) {
  //       reject(`${xhr.status}: ${xhr.statusText}`);
  //     }
  //     if (!!xhr.response) {
  //       resolve(JSON.parse(xhr.response));
  //     }    
  //   }
  // })
  // promise.then(result => {
  //   console.log(result);
  // })
})

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });