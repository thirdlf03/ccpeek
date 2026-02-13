import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { homedir } from 'node:os';
import matter from 'gray-matter';
import type { ClaudeConfig, ClaudeSettings, AgentMetadata, SkillMetadata, RuleMetadata } from './types.js';

export function scanClaudeConfig(cwd: string): ClaudeConfig {
  const config: ClaudeConfig = {
    agents: [],
    skills: [],
    rules: [],
  };

  const globalClaudeDir = join(homedir(), '.claude');

  // グローバル設定の読み込み
  const globalSettingsPath = join(globalClaudeDir, 'settings.json');
  if (existsSync(globalSettingsPath)) {
    config.globalSettings = JSON.parse(readFileSync(globalSettingsPath, 'utf-8')) as ClaudeSettings;
  }

  // グローバルのagents/skills/rulesを読み込み
  scanAgents(globalClaudeDir, config, 'global', homedir());
  scanSkills(globalClaudeDir, config, 'global', homedir());
  scanRules(globalClaudeDir, config, 'global', homedir());

  // プロジェクト設定の読み込み
  const projectClaudeDir = join(cwd, '.claude');
  if (!existsSync(projectClaudeDir)) {
    return config;
  }

  const projectSettingsPath = join(projectClaudeDir, 'settings.json');
  if (existsSync(projectSettingsPath)) {
    config.projectSettings = JSON.parse(readFileSync(projectSettingsPath, 'utf-8')) as ClaudeSettings;
  }

  // プロジェクトのagents/skills/rulesを読み込み
  scanAgents(projectClaudeDir, config, 'project', cwd);
  scanSkills(projectClaudeDir, config, 'project', cwd);
  scanRules(projectClaudeDir, config, 'project', cwd);

  return config;
}

function scanAgents(claudeDir: string, config: ClaudeConfig, scope: 'global' | 'project', basePath: string): void {
  const agentsDir = join(claudeDir, 'agents');
  if (!existsSync(agentsDir)) return;

  const files = readdirSync(agentsDir).filter((f: string) => f.endsWith('.md'));
  for (const file of files) {
    const filePath = join(agentsDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    config.agents.push({
      metadata: parsed.data as AgentMetadata,
      file: relative(basePath, filePath),
      scope,
    });
  }
}

function scanSkills(claudeDir: string, config: ClaudeConfig, scope: 'global' | 'project', basePath: string): void {
  const skillsDir = join(claudeDir, 'skills');
  if (!existsSync(skillsDir)) return;

  const dirs = readdirSync(skillsDir).filter((f: string) => {
    const stat = statSync(join(skillsDir, f));
    return stat.isDirectory();
  });
  for (const dir of dirs) {
    const skillPath = join(skillsDir, dir, 'SKILL.md');
    if (existsSync(skillPath)) {
      const content = readFileSync(skillPath, 'utf-8');
      const parsed = matter(content);
      config.skills.push({
        metadata: parsed.data as SkillMetadata,
        file: relative(basePath, skillPath),
        scope,
      });
    }
  }
}

function scanRules(claudeDir: string, config: ClaudeConfig, scope: 'global' | 'project', basePath: string): void {
  const rulesDir = join(claudeDir, 'rules');
  if (!existsSync(rulesDir)) return;

  const files = findMarkdownFiles(rulesDir);
  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    config.rules.push({
      metadata: parsed.data as RuleMetadata,
      file: relative(basePath, filePath),
      scope,
    });
  }
}

function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}
