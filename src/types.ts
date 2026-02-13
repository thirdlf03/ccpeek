export interface ClaudeSettings {
  env?: Record<string, string>;
  permissions?: {
    allow?: string[];
    deny?: string[];
    defaultMode?: string;
  };
  hooks?: Record<string, Hook[]>;
  enabledPlugins?: Record<string, boolean>;
  plansDirectory?: string;
  statusLine?: {
    type: string;
    command: string;
    padding?: number;
  };
  language?: string;
  alwaysThinkingEnabled?: boolean;
  effortLevel?: string;
  model?: string;
}

export interface Hook {
  matcher?: string;
  hooks?: {
    type: string;
    command: string;
    timeout?: number;
    async?: boolean;
    once?: boolean;
  }[];
}

export interface AgentMetadata {
  name: string;
  description: string;
  tools?: string;
  model?: string;
  color?: string;
  skills?: string[];
}

export interface SkillMetadata {
  name: string;
  description: string;
  'allowed-tools'?: string[];
  context?: string;
  agent?: string;
}

export interface RuleMetadata {
  paths?: string[];
}

export interface ClaudeConfig {
  globalSettings?: ClaudeSettings;
  projectSettings?: ClaudeSettings;
  agents: Array<{ metadata: AgentMetadata; file: string; scope: 'global' | 'project' }>;
  skills: Array<{ metadata: SkillMetadata; file: string; scope: 'global' | 'project' }>;
  rules: Array<{ metadata: RuleMetadata; file: string; scope: 'global' | 'project' }>;
}

export type Scope = 'global' | 'project' | 'all';
