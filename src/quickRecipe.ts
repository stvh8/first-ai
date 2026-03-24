import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Security: Validate API key exists on startup
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ Error: ANTHROPIC_API_KEY not found in environment variables.');
  console.error('Please create a .env file with your API key.');
  console.error('See .env.example for template.\n');
  process.exit(1);
}

// Initialize Claude client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Quick Recipe Lookup - Single query with no conversation history
 * Most cost-effective option for simple recipe searches
 */
async function quickRecipeLookup(query: string): Promise<void> {
  console.log('\n🔍 Searching for recipe...\n');

  // Security: Input validation
  if (!query || query.trim().length === 0) {
    console.error('Error: Query cannot be empty.');
    process.exit(1);
  }

  if (query.length > 2000) {
    console.error('Error: Query too long. Please limit to 2000 characters.');
    process.exit(1);
  }

  // Sanitize: Remove control characters
  const sanitizedQuery = query.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  try {
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307', // Cheapest model
      max_tokens: 600, // Minimal tokens
      system: 'You are a recipe assistant. Provide concise recipes.',
      messages: [
        {
          role: 'user',
          content: sanitizedQuery,
        },
      ],
    });

    const answer = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Could not process request.';

    console.log(`🤖 Claude:\n${answer}\n`);

    // Show cost info
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const cost = (
      (inputTokens / 1_000_000) * 0.25 +
      (outputTokens / 1_000_000) * 1.25
    ).toFixed(6);

    console.log(`\n💰 Cost: $${cost} (${inputTokens + outputTokens} tokens)\n`);
  } catch (error) {
    if (error instanceof Error) {
      // Security: Sanitize error messages
      if (error.message.includes('credit balance')) {
        console.error('Error: Insufficient API credits. Please check your Anthropic account.');
      } else if (error.message.includes('rate limit')) {
        console.error('Error: Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message.includes('401') || error.message.includes('authentication')) {
        console.error('Error: Authentication failed. Please check your API key in .env file.');
      } else {
        console.error('Error: Unable to process request. Please try again later.');
      }
    } else {
      console.error('An unknown error occurred.');
    }
    process.exit(1);
  }
}

// CLI handler
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: npm run quick-recipe "your recipe question"');
  console.log('\nExamples:');
  console.log('  npm run quick-recipe "quick pasta recipe"');
  console.log('  npm run quick-recipe "vegetarian meal with chickpeas"');
  process.exit(1);
}

const query = args.join(' ');
quickRecipeLookup(query);
