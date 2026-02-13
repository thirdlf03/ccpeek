import chalk from 'chalk';
import type { ClaudeConfig } from './types.js';

export function displayConfig(config: ClaudeConfig): void {
  console.log(chalk.bold.cyan('\n📋 Claude Code Configuration\n'));

  // グローバル設定
  if (config.globalSettings) {
    console.log(chalk.bold.yellow('🌍 Global Settings'));
    displaySettings(config.globalSettings, '  ');
    console.log();
  }

  // プロジェクト設定
  if (config.projectSettings) {
    console.log(chalk.bold.yellow('📁 Project Settings'));
    displaySettings(config.projectSettings, '  ');
    console.log();
  }

  // エージェント
  if (config.agents.length > 0) {
    console.log(chalk.bold.yellow(`🤖 Agents (${config.agents.length})`));
    for (const agent of config.agents) {
      console.log(chalk.green(`  • ${agent.metadata.name}`));
      console.log(chalk.white(`    ${agent.metadata.description}`));
      if (agent.metadata.tools) {
        console.log(chalk.white(`    Tools: ${agent.metadata.tools}`));
      }
      if (agent.metadata.model) {
        console.log(chalk.white(`    Model: ${agent.metadata.model}`));
      }
      if (agent.metadata.skills && agent.metadata.skills.length > 0) {
        console.log(chalk.white(`    Skills: ${agent.metadata.skills.join(', ')}`));
      }
      console.log(chalk.cyan(`    ${agent.file}`));
    }
    console.log();
  }

  // スキル
  if (config.skills.length > 0) {
    console.log(chalk.bold.yellow(`✨ Skills (${config.skills.length})`));
    for (const skill of config.skills) {
      console.log(chalk.green(`  • ${skill.metadata.name}`));
      console.log(chalk.white(`    ${skill.metadata.description}`));
      if (skill.metadata['allowed-tools'] && skill.metadata['allowed-tools'].length > 0) {
        console.log(chalk.green(`    Tools: ${skill.metadata['allowed-tools'].join(', ')}`));
      }
      if (skill.metadata.agent) {
        console.log(chalk.white(`    Agent: ${skill.metadata.agent}`));
      }
      console.log(chalk.cyan(`    ${skill.file}`));
    }
    console.log();
  }

  // ルール
  if (config.rules.length > 0) {
    console.log(chalk.bold.yellow(`📜 Rules (${config.rules.length})`));
    for (const rule of config.rules) {
      if (rule.metadata.paths && rule.metadata.paths.length > 0) {
        console.log(chalk.cyan(`  • ${rule.file}`));
        console.log(chalk.white(`    Applies to: ${rule.metadata.paths.join(', ')}`));
      } else {
        console.log(chalk.cyan(`  • ${rule.file}`));
      }
    }
    console.log();
  }
}

export function displaySettings(settings: any, indent: string): void {
  if (settings.language) {
    console.log(`${indent}${chalk.blue('Language:')} ${settings.language}`);
  }
  if (settings.model) {
    console.log(`${indent}${chalk.blue('Model:')} ${settings.model}`);
  }
  if (settings.effortLevel) {
    console.log(`${indent}${chalk.blue('Effort Level:')} ${settings.effortLevel}`);
  }
  if (settings.alwaysThinkingEnabled !== undefined) {
    console.log(`${indent}${chalk.blue('Always Thinking:')} ${settings.alwaysThinkingEnabled}`);
  }

  // Permissions
  if (settings.permissions) {
    console.log(`${indent}${chalk.blue('Permissions:')}`);
    if (settings.permissions.defaultMode) {
      console.log(`${indent}  Default Mode: ${settings.permissions.defaultMode}`);
    }
    if (settings.permissions.allow && settings.permissions.allow.length > 0) {
      console.log(`${indent}  Allow (${settings.permissions.allow.length}):`);
      for (const perm of settings.permissions.allow.slice(0, 5)) {
        console.log(chalk.green(`${indent}    ✓ ${perm}`));
      }
      if (settings.permissions.allow.length > 5) {
        console.log(chalk.dim(`${indent}    ... and ${settings.permissions.allow.length - 5} more`));
      }
    }
    if (settings.permissions.deny && settings.permissions.deny.length > 0) {
      console.log(`${indent}  Deny (${settings.permissions.deny.length}):`);
      for (const perm of settings.permissions.deny) {
        console.log(chalk.red(`${indent}    ✗ ${perm}`));
      }
    }
  }

  // Hooks
  if (settings.hooks) {
    const hookTypes = Object.keys(settings.hooks);
    console.log(`${indent}${chalk.blue('Hooks:')} ${hookTypes.length} types`);
    for (const hookType of hookTypes) {
      const hooks = settings.hooks[hookType];
      if (hooks && hooks.length > 0) {
        console.log(chalk.white(`${indent}  ${hookType} (${hooks.length})`));
      }
    }
  }

  // Enabled Plugins
  if (settings.enabledPlugins) {
    const enabledCount = Object.values(settings.enabledPlugins).filter(Boolean).length;
    const totalCount = Object.keys(settings.enabledPlugins).length;
    console.log(`${indent}${chalk.blue('Plugins:')} ${enabledCount}/${totalCount} enabled`);
    for (const [plugin, enabled] of Object.entries(settings.enabledPlugins)) {
      const status = enabled ? chalk.green('✓') : chalk.gray('○');
      console.log(chalk.white(`${indent}  ${status} ${plugin}`));
    }
  }

  // Status Line
  if (settings.statusLine) {
    console.log(`${indent}${chalk.blue('Status Line:')} ${settings.statusLine.command}`);
  }
}

export function displaySummary(config: ClaudeConfig): void {
  console.log(chalk.bold.cyan('\n📊 Configuration Summary\n'));

  const summary = {
    'Global Settings': config.globalSettings ? '✓' : '✗',
    'Project Settings': config.projectSettings ? '✓' : '✗',
    'Agents': config.agents.length,
    'Skills': config.skills.length,
    'Rules': config.rules.length,
  };

  for (const [key, value] of Object.entries(summary)) {
    console.log(`  ${chalk.blue(key + ':')} ${value}`);
  }
  console.log();
}
