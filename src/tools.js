import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

export const tools = {
  async searchFiles(pattern, options = {}) {
    try {
      const files = globSync(pattern, { 
        ignore: ['node_modules/**', '.git/**'],
        ...options
      });
      return files;
    } catch (error) {
      return `Error searching files: ${error.message}`;
    }
  },
  
  async readFile(filePath) {
    try {
      return readFileSync(filePath, 'utf8');
    } catch (error) {
      return `Error reading file: ${error.message}`;
    }
  },
  
  async writeFile(filePath, content) {
    try {
      writeFileSync(filePath, content, 'utf8');
      return `File ${filePath} written successfully`;
    } catch (error) {
      return `Error writing file: ${error.message}`;
    }
  },
  
  async executeCommand(command) {
    try {
      const output = execSync(command, { encoding: 'utf8' });
      return output;
    } catch (error) {
      return `Error executing command: ${error.message}`;
    }
  }
};

export const toolDefinitions = [
  {
    name: "searchFiles",
    description: "Search for files matching a pattern",
    parameters: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          description: "Glob pattern to search for files"
        },
        options: {
          type: "object",
          description: "Additional glob options"
        }
      },
      required: ["pattern"]
    }
  },
  // ...existing tool definitions...
];
