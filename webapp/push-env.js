const { execSync } = require('child_process');
require('dotenv').config();

const configs = [
  { key: 'TELEGRAM_BOT_TOKEN', value: process.env.TELEGRAM_BOT_TOKEN },
  { key: 'TELEGRAM_CHAT_ID', value: process.env.TELEGRAM_CHAT_ID },
  { key: 'DATABASE_URL', value: process.env.DATABASE_URL },
  { key: 'JWT_SECRET', value: process.env.JWT_SECRET },
  { key: 'ADMIN_SECRET', value: process.env.ADMIN_SECRET },
  { key: 'NEXT_PUBLIC_BASE_URL', value: 'https://streamsaas.live' },
  { key: 'SMTP_HOST', value: process.env.SMTP_HOST },
  { key: 'SMTP_PORT', value: process.env.SMTP_PORT },
  { key: 'SMTP_USER', value: process.env.SMTP_USER },
  { key: 'SMTP_PASS', value: process.env.SMTP_PASS },
  { key: 'PASSWORD_RESET_FROM', value: process.env.PASSWORD_RESET_FROM },
];

console.log("Pushing ALL backend keys securely to Vercel...");

for (const config of configs) {
  if (!config.value) continue;
  try {
    try {
      execSync(`npx vercel env rm ${config.key} production -y`, { stdio: 'ignore' });
    } catch (e) { }

    execSync(`npx vercel env add ${config.key} production`, { input: config.value.trim() });
    console.log(`✅ Pushed ${config.key}`);
  } catch (err) {
    console.error(`❌ Failed on ${config.key}:`, err.message);
  }
}

console.log("Done. Initiating a new deployment to apply these keys...");
try {
  const result = execSync(`npx vercel --prod -y`).toString();
  console.log("✅ Redeployment successful: " + result);
} catch (e) {
  console.error("❌ Redeploy failed:", e.message);
}
