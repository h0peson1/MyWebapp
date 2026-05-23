require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`)
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
