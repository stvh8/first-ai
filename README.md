# TypeScript Node.js Project

A TypeScript Node.js project with Claude AI Recipe Search Agent.

## Features

- 🍳 **Claude Recipe Search Agent** - An AI-powered recipe assistant that helps you find recipes based on ingredients, dietary preferences, and cuisine types
- 💬 **Interactive CLI** - Chat with Claude to get personalized recipe recommendations
- 🔄 **Conversation History** - Maintains context throughout your conversation

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

#### Recipe Search Agent

Run the interactive recipe search agent:

```bash
npm run recipe
```

Example interactions:
- "I have chicken, tomatoes, and garlic. What can I make?"
- "Show me a vegetarian pasta recipe"
- "I need a quick dessert recipe under 30 minutes"
- "What's a good recipe for meal prep?"

Type `exit` to quit or `clear` to start a new conversation.

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
│   └── recipeAgent.ts     # Claude AI Recipe Search Agent
├── dist/                  # Compiled JavaScript output
├── .env.example           # Environment variables template
├── .env                   # Your API keys (not committed)
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Technologies

- **TypeScript** - Type-safe JavaScript
- **Node.js** - JavaScript runtime
- **Claude AI (Anthropic)** - Advanced AI assistant for recipe recommendations
- **dotenv** - Environment variable management
