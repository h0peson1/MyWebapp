require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function registerCommands() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`;
  
  const commands = [
    { command: 'start', description: 'Open Admin Dashboard' },
    { command: 'stats', description: 'View System Statistics' },
    { command: 'users', description: 'List Recent Users' },
    { command: 'remove', description: 'Remove a User (Requires email)' }
  ];

  console.log('Registering commands with Telegram...');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands })
    });

    const data = await response.json();
    if (data.ok) {
      console.log('✅ Commands successfully registered!');
    } else {
      console.error('❌ Registration failed:', data);
    }
  } catch (error) {
    console.error('❌ Error calling Telegram API:', error.message);
  }
}

registerCommands();
