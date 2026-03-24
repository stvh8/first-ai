import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

async function testAPIConnection() {
  console.log('🔍 Testing Anthropic API Connection...\n');

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('❌ Error: ANTHROPIC_API_KEY not found in .env file');
    process.exit(1);
  }

  // Security: Display only minimal API key info
  console.log('✓ API Key found:', apiKey.substring(0, 7) + '***' + apiKey.substring(apiKey.length - 4) + '\n');

  const client = new Anthropic({
    apiKey: apiKey,
  });

  console.log('📡 Attempting API call with minimal tokens...\n');

  try {
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: 'Say hello',
        },
      ],
    });

    console.log('✅ SUCCESS! API is working correctly.\n');
    console.log('Response:', response.content[0].type === 'text' ? response.content[0].text : 'N/A');
    console.log('\n📊 Token Usage:');
    console.log(`   Input: ${response.usage.input_tokens} tokens`);
    console.log(`   Output: ${response.usage.output_tokens} tokens`);
    console.log(`   Total: ${response.usage.input_tokens + response.usage.output_tokens} tokens`);
    
    const cost = (
      (response.usage.input_tokens / 1_000_000) * 0.25 +
      (response.usage.output_tokens / 1_000_000) * 1.25
    ).toFixed(6);
    console.log(`   Cost: $${cost}\n`);

    console.log('✓ Your API key has active credits and is ready to use!\n');

  } catch (error: any) {
    console.error('❌ API Error:\n');
    
    if (error.status === 401) {
      console.error('Authentication failed. Your API key may be invalid.');
      console.error('Please check: https://console.anthropic.com/settings/keys\n');
    } else if (error.status === 400) {
      console.error('Bad Request. Details:', error.message);
      
      if (error.message.includes('credit balance')) {
        console.error('\n💡 Troubleshooting steps:');
        console.error('1. Wait 2-5 minutes for credits to propagate');
        console.error('2. Verify credits at: https://console.anthropic.com/settings/billing');
        console.error('3. Make sure you added credits to the correct account/workspace');
        console.error('4. Try generating a new API key if issue persists\n');
      }
    } else if (error.status === 429) {
      console.error('Rate limit exceeded. Please wait a moment and try again.\n');
    } else {
      console.error('Unexpected error:', error.message);
      console.error('Status code:', error.status);
      console.error('\nFull error:', error, '\n');
    }
    
    process.exit(1);
  }
}

testAPIConnection();
