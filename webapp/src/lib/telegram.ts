/**
 * Core Telegram Bot API Utilities
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendMessage(chatId: string | number, text: string, options: any = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...options,
    }),
  });
  return response.json();
}

export async function editMessage(chatId: string | number, messageId: number, text: string, options: any = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      ...options,
    }),
  });
  return response.json();
}

export async function editMessageCaption(chatId: string | number, messageId: number, caption: string, options: any = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      caption,
      parse_mode: 'HTML',
      ...options,
    }),
  });
  return response.json();
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string, showAlert = false) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    }),
  });
  return response.json();
}

export async function deleteMessage(chatId: string | number, messageId: number) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
    }),
  });
  return response.json();
}
