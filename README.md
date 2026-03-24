# TypeScript Node.js Project

A TypeScript Node.js project with Claude AI Recipe Search Agent.

## Features

- 🍳 **Claude Recipe Search Agent** - An AI-powered recipe assistant that helps you find recipes based on ingredients, dietary preferences, and cuisine types
- 💬 **Interactive CLI** - Chat with Claude to get personalized recipe recommendations
- 🔄 **Conversation History** - Maintains context throughout your conversation
- 💰 **Cost-Optimized** - Uses Claude 3 Haiku model and smart token management to minimize API costs
- ⚡ **Quick Recipe Lookup** - Single-query mode for the fastest and cheapest recipe searches

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Anthropic API Key (get one at https://console.anthropic.com/)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables:

```bash
cp .env.example .env
```

3. Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### Usage

#### Recipe Search Agent (Interactive Mode)

Run the interactive recipe search agent with conversation history:

```bash
npm run recipe
```

**Cost Optimization Features:**
- Uses Claude 3 Haiku (most affordable model)
- Limited to 800 tokens per response
- Keeps only last 3 conversation turns in history
- Real-time token usage tracking

Example interactions:
- "I have chicken, tomatoes, and garlic. What can I make?"
- "Show me a vegetarian pasta recipe"
- "I need a quick dessert recipe under 30 minutes"
- "What's a good recipe for meal prep?"

**Commands:**
- `exit` - Quit and show total cost
- `clear` - Start a new conversation (saves tokens)
- `usage` - Check current token usage and estimated cost

#### Quick Recipe Lookup (Single Query Mode)

For the cheapest option, use quick lookup for one-off recipe searches:

```bash
npm run quick-recipe "your recipe question"
```

Examples:
```bash
npm run quick-recipe "quick pasta recipe"
npm run quick-recipe "vegetarian meal with chickpeas"
npm run quick-recipe "easy dessert under 30 minutes"
```

**Benefits:**
- No conversation history = minimal tokens
- Fastest response time
- Lowest cost per query (~$0.0001-0.0003 per query)
- Shows cost breakdown after each query

#### Development Mode

Run the main application in development mode:

```bash
npm run dev
```

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Run

Run the compiled JavaScript:

```bash
npm start
```

### Watch Mode

Compile TypeScript in watch mode:

```bash
npm run watch
```

## Project Structure

```
.
├── src/
│   ├── index.ts           # Main entry point
│   ├── recipeAgent.ts     # Claude AI Recipe Agent (interactive)
│   └── quickRecipe.ts     # Quick recipe lookup (single query)
├── dist/                  # Compiled JavaScript output
├── .env.example           # Environment variables template
├── .env                   # Your API keys (not committed)
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Cost Optimization Details

### Token Usage Comparison

**Quick Recipe Mode** (npm run quick-recipe):
- Average: 100-200 input tokens, 400-600 output tokens
- Cost per query: ~$0.0001-0.0003
- Best for: Single questions, no follow-up needed

**Interactive Mode** (npm run recipe):
- Initial query: ~150 input tokens, 600-800 output tokens
- Follow-up queries: 300-500 input tokens (includes history)
- Cost per conversation (3-5 turns): ~$0.001-0.003
- Best for: Complex queries, multiple follow-ups

### Cost Reduction Strategies Used

1. **Cheaper Model**: Claude 3 Haiku vs Sonnet saves ~80% on costs
2. **Token Limits**: Max 600-800 tokens vs 2048 reduces unnecessary verbosity
3. **History Pruning**: Keeps only 3 recent turns vs unlimited history
4. **Concise System Prompt**: Short system message saves ~50 tokens per request
5. **Single-query Mode**: No history overhead for simple lookups

### Pricing Reference (Claude 3 Haiku)
- Input: $0.25 per million tokens
- Output: $1.25 per million tokens

## Technologies

- **TypeScript** - Type-safe JavaScript
- **Node.js** - JavaScript runtime
- **Claude AI (Anthropic)** - Advanced AI assistant for recipe recommendations
- **dotenv** - Environment variable management
