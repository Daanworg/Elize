import {
  Terminal,
  Search,
  FileText,
  Edit3,
  Code,
  Settings,
  GitBranch,
  Play,
  ChevronRight
} from 'lucide-react';

export const TOOL_ICONS = {
  searchFiles: {
    icon: Search,
    color: 'text-blue-400',
    requiresPermission: false
  },
  readFile: {
    icon: FileText,
    color: 'text-green-400',
    requiresPermission: false
  }
  // Additional tools can be added here following the same pattern
};
