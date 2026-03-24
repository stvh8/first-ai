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

interface AgentConfig {
  model: string;
  maxTokens: number;
  maxHistoryTurns: number;
  enableHistory: boolean;
}

class RecipeSearchAgent {
  private conversationHistory: Message[] = [];
  private totalInputTokens: number = 0;
  private totalOutputTokens: number = 0;
  private config: AgentConfig;

  constructor(config?: Partial<AgentConfig>) {
    // Default config optimized for low credit usage
    this.config = {
      model: config?.model || 'claude-3-haiku-20240307', // Cheaper model
      maxTokens: config?.maxTokens || 800, // Reduced from 2048
      maxHistoryTurns: config?.maxHistoryTurns || 3, // Keep only last 3 turns
      enableHistory: config?.enableHistory ?? true,
    };
  }

  async searchRecipe(query: string): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: query,
    });

    // Trim history to save tokens (keep only recent turns)
    if (this.config.enableHistory && this.conversationHistory.length > this.config.maxHistoryTurns * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.config.maxHistoryTurns * 2);
    }

    // If history disabled, only keep current query
    const messages = this.config.enableHistory 
      ? this.conversationHistory 
      : [this.conversationHistory[this.conversationHistory.length - 1]];

    try {
      const response = await client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        // Shorter, more efficient system prompt
        system: `You are a recipe assistant. Provide concise recipes with ingredients and steps. Be brief but helpful.`,
        messages: messages,
      });

      // Track token usage
      this.totalInputTokens += response.usage.input_tokens;
      this.totalOutputTokens += response.usage.output_tokens;

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

  getTokenUsage(): { input: number; output: number; total: number; estimatedCost: string } {
    const total = this.totalInputTokens + this.totalOutputTokens;
    // Approximate cost calculation (Haiku: $0.25 per MTok input, $1.25 per MTok output)
    const estimatedCost = (
      (this.totalInputTokens / 1_000_000) * 0.25 +
      (this.totalOutputTokens / 1_000_000) * 1.25
    ).toFixed(6);
    
    return {
      input: this.totalInputTokens,
      output: this.totalOutputTokens,
      total,
      estimatedCost: `$${estimatedCost}`,
    };
  }

  getCurrentConfig(): AgentConfig {
    return { ...this.config };
  }
}

// Interactive CLI
async function main() {
  console.log('🍳 Claude Recipe Search Agent (Optimized) 🍳');
  console.log('===========================================\n');
  console.log('💰 Cost-saving features enabled:');
  console.log('   • Using Claude 3 Haiku (cheaper model)');
  console.log('   • Limited to 800 tokens per response');
  console.log('   • Keeps only last 3 conversation turns\n');
  console.log('Commands:');
  console.log('   • Type your recipe question');
  console.log('   • "exit" - Quit the application');
  console.log('   • "clear" - Start a new conversation');
  console.log('   • "usage" - Show token usage and cost\n');

  const agent = new RecipeSearchAgent();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      const query = input.trim();

      if (query.toLowerCase() === 'exit') {
        const usage = agent.getTokenUsage();
        console.log('\n📊 Final Token Usage:');
        console.log(`   Input tokens: ${usage.input}`);
        console.log(`   Output tokens: ${usage.output}`);
        console.log(`   Total tokens: ${usage.total}`);
        console.log(`   Estimated cost: ${usage.estimatedCost}`);
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

      if (query.toLowerCase() === 'usage') {
        const usage = agent.getTokenUsage();
        console.log('\n📊 Current Token Usage:');
        console.log(`   Input tokens: ${usage.input}`);
        console.log(`   Output tokens: ${usage.output}`);
        console.log(`   Total tokens: ${usage.total}`);
        console.log(`   Estimated cost: ${usage.estimatedCost}\n`);
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
