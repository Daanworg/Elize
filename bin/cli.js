#!/usr/bin/env node

import { program } from 'commander';
import { startREPL } from '../src/repl.js';

program
  .name('google-code')
  .description('Google Code CLI - A Claude Code-like CLI tool powered by Google\'s Gemini models')
  .version('0.1.0');

program
  .command('start')
  .description('Start interactive session')
  .action(startREPL);

program.parse(process.argv);

// Default to interactive mode if no command is specified
if (!process.argv.slice(2).length) {
  startREPL();
}
