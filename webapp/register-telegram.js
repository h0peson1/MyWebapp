/**
 * Run this script to link your live production URL to your Telegram Bot.
 * Example: `node register-telegram.js https://your-live-domain.com`
 */
require('dotenv').config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const args = process.argv.slice(2);
let domain = args[0];

if (!botToken) {
  console.error("❌ TELEGRAM_BOT_TOKEN is missing in your .env file.");
  process.exit(1);
}

if (!domain) {
  console.error("❌ You must provide your live domain as an argument.");
  console.log("Usage: node register-telegram.js https://your-live-domain.com");
  process.exit(1);
}

// Remove trailing slash if present
domain = domain.replace(/\/$/, '');

const webhookUrl = `${domain}/api/telegram/webhook`;

console.log(`Setting Telegram Webhook to: ${webhookUrl} ...\n`);

fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: webhookUrl
    // optionally add 'secret_token' for extra security if configured
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log(`✅ Success! Telegram will now send button clicks to your domain.`);
      console.log(`Description: ${data.description}`);
    } else {
      console.error(`❌ Failed: ${data.description}`);
    }
  })
  .catch(err => {
    console.error(`❌ Network error while setting webhook:`, err.message);
  });
