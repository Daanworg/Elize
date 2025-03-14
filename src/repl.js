import chalk from 'chalk';
import readline from 'readline';
import { highlight } from 'cli-highlight';
import { VertexAI } from '@google-cloud/vertexai';
import { CONFIG } from './config.js';
import { tools, toolDefinitions } from './tools.js';
import { SYSTEM_PROMPTS } from './prompts.js';
import { startSpinner, stopSpinner } from './utils.js';
import { TOOL_ICONS } from './toolIcons.js';

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: CONFIG.projectId,
  location: CONFIG.location,
});

// Create model instances
const geminiModel = vertexAI.getGenerativeModel({
  model: CONFIG.modelName,
  generationConfig: {
    maxOutputTokens: CONFIG.maxTokens,
    temperature: CONFIG.temperature,
  },
});

const fastModel = vertexAI.getGenerativeModel({
  model: CONFIG.fastModelName,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: CONFIG.temperature,
  },
});

// Chat history management
let chatHistory = [];

// Command processing
async function processCommand(input) {
  try {
    startSpinner('Thinking...');
    const chat = geminiModel.startChat({
      history: chatHistory,
      context: SYSTEM_PROMPTS.default,
    });

    const result = await chat.sendMessage(input);
    const response = result.response;
    const text = response.text();
    
    stopSpinner();
    console.log(chalk.green('\nAI: ') + highlight(text));
    chatHistory.push({ role: 'user', parts: input });
    chatHistory.push({ role: 'assistant', parts: text });
  } catch (error) {
    stopSpinner();
    console.error(chalk.red('Error:'), error.message);
  }
}

// REPL implementation
const startREPL = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'google-code> '
  });

  console.log('Welcome to Google Code CLI! (Press Ctrl+C to exit)\n');
  rl.prompt();

  rl.on('line', async (input) => {
    if (input.trim()) {
      await processCommand(input);
    }
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
  });
};

export { startREPL };
