import Anthropic from '@anthropic-ai/sdk';
import twilio from 'twilio';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function generateCompliment() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `Today is ${today}. Write a single warm, genuine, and heartfelt compliment from a husband to his wife.

        Guidelines:
        - Keep it to 1-3 sentences
        - Make it feel personal and sincere, not generic
        - Vary the theme (her kindness, strength, beauty, humor, intelligence, the little things she does, etc.)
        - No emojis
        - Don't start with "You are" every time — vary the opening
        - Sign it with "Love, your husband"

        Return only the compliment text, nothing else.`,
      },
    ],
  });

  return message.content[0].text.trim();
}

async function sendSMS(compliment) {
  const result = await twilioClient.messages.create({
    body: compliment,
    from: process.env.TWILIO_FROM_NUMBER,
    to: process.env.WIFE_PHONE_NUMBER,
  });

  console.log(`Message sent successfully! SID: ${result.sid}`);
  return result;
}

async function main() {
  console.log('Generating compliment...');
  const compliment = await generateCompliment();
  console.log(`Compliment: ${compliment}`);

  console.log('Sending SMS...');
  await sendSMS(compliment);

  console.log('Done!');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
