import chalk from 'chalk';
import ora from 'ora';

// Spinner instance for loading indicators
let spinner = null;

export function startSpinner(message) {
  if (spinner) {
    spinner.stop();
  }
  
  spinner = ora({
    text: message,
    color: 'blue',
  }).start();
}

export function stopSpinner(finalMessage) {
  if (spinner) {
    if (finalMessage) {
      spinner.succeed(finalMessage);
    } else {
      spinner.stop();
    }
    spinner = null;
  }
}

export function formatFileContent(content, filePath) {
  const lines = content.split('\n');
  const maxLineNumLength = String(lines.length).length;
  
  return lines
    .map((line, i) => {
      const lineNum = String(i + 1).padStart(maxLineNumLength, ' ');
      return chalk.gray(`${lineNum} |`) + ' ' + line;
    })
    .join('\n');
}

export function getFileType(filePath) {
  const extension = filePath.split('.').pop().toLowerCase();
  
  const typeMap = {
    js: 'JavaScript',
    jsx: 'React JSX',
    ts: 'TypeScript',
    tsx: 'React TSX',
    py: 'Python',
    // ...existing type mappings...
    dart: 'Dart',
    ex: 'Elixir',
    erl: 'Erlang'
  };
  
  return typeMap[extension] || 'Unknown';
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
