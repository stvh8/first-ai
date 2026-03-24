import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

  try {
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307', // Cheapest model
      max_tokens: 600, // Minimal tokens
      system: 'You are a recipe assistant. Provide concise recipes.',
      messages: [
        {
          role: 'user',
          content: query,
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
      console.error(`Error: ${error.message}`);
    }
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
