const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.SMTP_PASS);

async function testEmail() {
  console.log("Testing Resend API Key:", process.env.SMTP_PASS);
  try {
    const response = await resend.emails.send({
      from: 'support@streamsaas.live',
      to: 'anyone-else-test@mailinator.com',
      subject: 'Global Delivery Test',
      html: '<p>Testing global delivery status.</p>'
    });
    console.log("Resend API Response:", JSON.stringify(response, null, 2));
  } catch (err) {
    console.error("Resend execution error:", err);
  }
}

testEmail();
