import Anthropic from '@anthropic-ai/sdk';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Claude client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

class RecipeSearchAgent {
  private conversationHistory: Message[] = [];

  async searchRecipe(query: string): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: query,
    });

    try {
      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: `You are a helpful cooking assistant specializing in recipe recommendations and cooking advice. 
Your goal is to help users find recipes based on their preferences, dietary restrictions, ingredients they have, 
or cuisine types they're interested in. Provide detailed, easy-to-follow recipes with ingredients and step-by-step instructions.
Be friendly, creative, and accommodating to dietary needs.`,
        messages: this.conversationHistory,
      });

      const assistantMessage = response.content[0].type === 'text'
        ? response.content[0].text
        : 'Sorry, I could not process that request.';

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return assistantMessage;
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred.';
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}

// Interactive CLI
async function main() {
  console.log('🍳 Claude Recipe Search Agent 🍳');
  console.log('================================\n');
  console.log('Ask me anything about recipes! Type "exit" to quit, "clear" to start a new conversation.\n');

  const agent = new RecipeSearchAgent();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      const query = input.trim();

      if (query.toLowerCase() === 'exit') {
        console.log('\nGoodbye! Happy cooking! 👨‍🍳\n');
        rl.close();
        return;
      }

      if (query.toLowerCase() === 'clear') {
        agent.clearHistory();
        console.log('\n[Conversation history cleared]\n');
        askQuestion();
        return;
      }

      if (!query) {
        askQuestion();
        return;
      }

      console.log('\n🤖 Claude: Thinking...\n');
      const response = await agent.searchRecipe(query);
      console.log(`🤖 Claude: ${response}\n`);

      askQuestion();
    });
  };

  askQuestion();
}

// Run the agent
if (require.main === module) {
  main();
}

export { RecipeSearchAgent };
