import chalk from 'chalk';
import readline from 'readline';
import { VertexAI } from '@google-cloud/vertexai';
import { highlight } from 'cli-highlight';
import { CONFIG } from './config.js';
import { tools, toolDefinitions } from './tools.js';
import { SYSTEM_PROMPTS } from './prompts.js';

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: CONFIG.projectId,
  location: CONFIG.location,
});

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

// ... rest of the REPL implementation ...

export { startREPL };
