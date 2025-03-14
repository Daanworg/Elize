import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Search, FileText, Edit3, Terminal as TerminalIcon, Git, Code, Settings } from 'lucide-react';

// Define keyframe animations for dots
const dotAnimationStyle = `
  @keyframes dotAnimation {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }

  .dots::after {
    content: '';
    animation: dotAnimation 1.5s infinite;
  }
`;

const THINKING_MODES = {
  quick: { duration: 1000, depth: 'surface', color: 'text-blue-400' },
  normal: { duration: 2000, depth: 'standard', color: 'text-green-400' },
  deep: { duration: 4000, depth: 'comprehensive', color: 'text-yellow-400' },
  ultrathink: { duration: 6000, depth: 'exhaustive', color: 'text-purple-400' }
};

const TOOLS = {
  searchFiles: { icon: Search, color: 'text-blue-400', requiresPermission: false },
  readFile: { icon: FileText, color: 'text-green-400', requiresPermission: false },
  writeFile: { icon: Edit3, color: 'text-yellow-400', requiresPermission: true },
  executeCommand: { icon: TerminalIcon, color: 'text-purple-400', requiresPermission: true },
  git: { icon: Git, color: 'text-orange-400', requiresPermission: true },
  analyze: { icon: Code, color: 'text-cyan-400', requiresPermission: false },
  config: { icon: Settings, color: 'text-gray-400', requiresPermission: false }
};

const GoogleCodeDemo = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'system', 
      content: 'Welcome to Google Code CLI. Using Gemini 1.5 Pro for main interactions.',
      metadata: { type: 'init' }
    }
  ]);
  const [input, setInput] = useState('');
  const [thinkingMode, setThinkingMode] = useState('normal'); // normal, harder, deep
  const [isThinking, setIsThinking] = useState(false);
  const [config, setConfig] = useState({
    model: 'claude-3.7-sonnet',
    contextWindow: 200000,
    maxTokens: 4096
  });
  const [permissions, setPermissions] = useState({
    writeFile: false,
    executeCommand: false,
    git: false
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSpecialCommands = (text) => {
    if (text.startsWith('/think')) {
      const mode = text.split(' ')[1] || 'normal';
      setThinkingMode(mode);
      return true;
    }
    return false;
  };

  const handleCommand = (text) => {
    if (text.startsWith('/')) {
      const [command, ...args] = text.slice(1).split(' ');
      switch (command) {
        case 'think':
          setThinkingMode(args[0] || 'normal');
          return true;
        case 'config':
          setConfig(prev => ({ ...prev, [args[0]]: args[1] }));
          return true;
        case 'tool':
          executeTool(args[0], args.slice(1));
          return true;
      }
    }
    return false;
  };

  const executeTool = async (toolName, args) => {
    if (!TOOLS[toolName]) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Error: Unknown tool "${toolName}"`,
        metadata: { type: 'error' }
      }]);
      return;
    }

    if (TOOLS[toolName].requiresPermission && !permissions[toolName]) {
      const confirmed = window.confirm(`Grant permission to use ${toolName} tool?`);
      if (!confirmed) {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Permission denied for ${toolName}`,
          metadata: { type: 'error' }
        }]);
        return;
      }
      setPermissions(prev => ({ ...prev, [toolName]: true }));
    }

    setMessages(prev => [...prev, {
      role: 'system',
      content: `Executing ${toolName}...`,
      metadata: { 
        type: 'tool',
        tool: toolName,
        args,
        status: 'running'
      }
    }]);

    // Simulate tool execution
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `${toolName} completed successfully`,
        metadata: {
          type: 'tool',
          tool: toolName,
          args,
          status: 'complete'
        }
      }]);
    }, 1000);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    
    if (handleSpecialCommands(input) || handleCommand(input)) {
      setInput('');
      return;
    }

    const userMessage = { role: 'user', content: input, metadata: { type: 'message' } };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate thinking process with different durations based on mode
    const thinkingTime = THINKING_MODES[thinkingMode].duration;

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Processing...',
        metadata: { 
          type: 'thinking',
          mode: thinkingMode,
          tools: ['searchFiles', 'readFile']  // Example tool usage
        }
      }]);
      setIsThinking(false);
    }, thinkingTime);
  };

  return (
    <>
      <style>{dotAnimationStyle}</style>
      <div className="flex flex-col h-full bg-gray-900 text-gray-200 font-mono">
        <div className="p-2 border-b border-gray-700 flex items-center gap-2 text-xs">
          <Settings className="w-4 h-4" />
          <span>{config.model}</span>
          <span className="text-gray-500">|</span>
          <span>Context: {config.contextWindow}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              {message.metadata?.type === 'thinking' && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Terminal className="w-4 h-4" />
                  <span>Thinking Mode: {message.metadata.mode}</span>
                  {message.metadata.tools.map(tool => {
                    const ToolIcon = TOOLS[tool].icon;
                    return <ToolIcon key={tool} className={`w-4 h-4 ${TOOLS[tool].color}`} />;
                  })}
                </div>
              )}
              <span>{message.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 mb-2">
            Commands: /think, /config, /tool
          </div>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
          />
          {isThinking && (
            <div className="flex items-center gap-2 mt-2 text-gray-500">
              <Terminal className="w-4 h-4" />
              <span className="dots">Thinking</span>
              <span className="text-xs">({thinkingMode} mode)</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GoogleCodeDemo;