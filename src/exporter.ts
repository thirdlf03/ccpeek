import type { ClaudeConfig } from './types.js';

export function exportToJson(config: ClaudeConfig): string {
  return JSON.stringify(config, null, 2);
}

export function exportToMarkdown(config: ClaudeConfig): string {
  const lines: string[] = [];

  lines.push('# Claude Code Configuration\n');

  // Global Settings
  if (config.globalSettings) {
    lines.push('## Global Settings\n');
    if (config.globalSettings.language) {
      lines.push(`- **Language**: ${config.globalSettings.language}`);
    }
    if (config.globalSettings.model) {
      lines.push(`- **Model**: ${config.globalSettings.model}`);
    }
    if (config.globalSettings.effortLevel) {
      lines.push(`- **Effort Level**: ${config.globalSettings.effortLevel}`);
    }
    lines.push('');
  }

  // Project Settings
  if (config.projectSettings) {
    lines.push('## Project Settings\n');

    if (config.projectSettings.permissions?.allow) {
      lines.push('### Allowed Permissions\n');
      for (const perm of config.projectSettings.permissions.allow) {
        lines.push(`- ${perm}`);
      }
      lines.push('');
    }

    if (config.projectSettings.permissions?.deny) {
      lines.push('### Denied Permissions\n');
      for (const perm of config.projectSettings.permissions.deny) {
        lines.push(`- ${perm}`);
      }
      lines.push('');
    }

    if (config.projectSettings.enabledPlugins) {
      lines.push('### Plugins\n');
      for (const [plugin, enabled] of Object.entries(config.projectSettings.enabledPlugins)) {
        const status = enabled ? '✅' : '❌';
        lines.push(`- ${status} ${plugin}`);
      }
      lines.push('');
    }
  }

  // Agents
  if (config.agents.length > 0) {
    lines.push(`## Agents (${config.agents.length})\n`);
    for (const agent of config.agents) {
      lines.push(`### ${agent.metadata.name}\n`);
      lines.push(agent.metadata.description);
      lines.push('');
      if (agent.metadata.tools) {
        lines.push(`**Tools**: ${agent.metadata.tools}`);
        lines.push('');
      }
      if (agent.metadata.skills && agent.metadata.skills.length > 0) {
        lines.push(`**Skills**: ${agent.metadata.skills.join(', ')}`);
        lines.push('');
      }
      lines.push(`*File: ${agent.file}*`);
      lines.push('');
    }
  }

  // Skills
  if (config.skills.length > 0) {
    lines.push(`## Skills (${config.skills.length})\n`);
    for (const skill of config.skills) {
      lines.push(`### ${skill.metadata.name}\n`);
      lines.push(skill.metadata.description);
      lines.push('');
      if (skill.metadata['allowed-tools'] && skill.metadata['allowed-tools'].length > 0) {
        lines.push(`**Tools**: ${skill.metadata['allowed-tools'].join(', ')}`);
        lines.push('');
      }
      lines.push(`*File: ${skill.file}*`);
      lines.push('');
    }
  }

  // Rules
  if (config.rules.length > 0) {
    lines.push(`## Rules (${config.rules.length})\n`);
    for (const rule of config.rules) {
      lines.push(`### ${rule.file}\n`);
      if (rule.metadata.paths && rule.metadata.paths.length > 0) {
        lines.push(`**Applies to**: ${rule.metadata.paths.join(', ')}`);
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}
