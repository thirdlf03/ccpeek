#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { Command } from 'commander';
import chalk from 'chalk';
import type { Scope } from './types.js';
import { scanClaudeConfig } from './scanner.js';
import { displayConfig, displaySummary, displaySettings } from './viewer.js';
import { exportToJson, exportToMarkdown } from './exporter.js';

// ヘルパー関数
function filterByScope<T extends { scope: 'global' | 'project' }>(items: T[], scope: Scope): T[] {
  if (scope === 'all') return items;
  return items.filter(item => item.scope === scope);
}

const program = new Command();

program
  .name('ccsetting')
  .description('Visualize .claude configuration files')
  .version('0.2.0');

program
  .command('show', { isDefault: true })
  .description('Show the full configuration')
  .option('-s, --summary', 'Show summary only')
  .option('-d, --dir <directory>', 'Target directory', process.cwd())
  .option('-j, --json <file>', 'Export to JSON file')
  .option('-m, --markdown <file>', 'Export to Markdown file')
  .action((options) => {
    const config = scanClaudeConfig(options.dir);

    if (options.json) {
      const jsonContent = exportToJson(config);
      writeFileSync(options.json, jsonContent);
      console.log(`Exported to ${options.json}`);
      return;
    }

    if (options.markdown) {
      const markdownContent = exportToMarkdown(config);
      writeFileSync(options.markdown, markdownContent);
      console.log(`Exported to ${options.markdown}`);
      return;
    }

    if (options.summary) {
      displaySummary(config);
    } else {
      displayConfig(config);
    }
  });

program
  .command('agents')
  .description('Show agents only (-a: all, -g: global, -p: project)')
  .option('-d, --dir <directory>', 'Target directory', process.cwd())
  .option('-g, --global', 'Show global agents only')
  .option('-p, --project', 'Show project agents only')
  .option('-a, --all', 'Show all agents (default)', true)
  .action((options) => {
    const config = scanClaudeConfig(options.dir);
    const scope: Scope = options.global ? 'global' : options.project ? 'project' : 'all';
    const filteredAgents = filterByScope(config.agents, scope);

    if (filteredAgents.length === 0) {
      console.log('No agents found');
      return;
    }

    console.log(chalk.bold.yellow(`\n🤖 Agents (${filteredAgents.length})\n`));
    for (const agent of filteredAgents) {
      const scopeBadge = scope === 'all' ? chalk.dim(`[${agent.scope}] `) : '';
      console.log(chalk.green(`• ${scopeBadge}${agent.metadata.name}`));
      console.log(chalk.white(`  ${agent.metadata.description}`));
      console.log(chalk.cyan(`  ${agent.file}\n`));
    }
  });

program
  .command('skills')
  .description('Show skills only (-a: all, -g: global, -p: project)')
  .option('-d, --dir <directory>', 'Target directory', process.cwd())
  .option('-g, --global', 'Show global skills only')
  .option('-p, --project', 'Show project skills only')
  .option('-a, --all', 'Show all skills (default)', true)
  .action((options) => {
    const config = scanClaudeConfig(options.dir);
    const scope: Scope = options.global ? 'global' : options.project ? 'project' : 'all';
    const filteredSkills = filterByScope(config.skills, scope);

    if (filteredSkills.length === 0) {
      console.log('No skills found');
      return;
    }

    console.log(chalk.bold.yellow(`\n✨ Skills (${filteredSkills.length})\n`));
    for (const skill of filteredSkills) {
      const scopeBadge = scope === 'all' ? chalk.dim(`[${skill.scope}] `) : '';
      console.log(chalk.green(`• ${scopeBadge}${skill.metadata.name}`));
      console.log(chalk.white(`  ${skill.metadata.description}`));
      console.log(chalk.cyan(`  ${skill.file}\n`));
    }
  });

program
  .command('rules')
  .description('Show rules only (-a: all, -g: global, -p: project)')
  .option('-d, --dir <directory>', 'Target directory', process.cwd())
  .option('-g, --global', 'Show global rules only')
  .option('-p, --project', 'Show project rules only')
  .option('-a, --all', 'Show all rules (default)', true)
  .action((options) => {
    const config = scanClaudeConfig(options.dir);
    const scope: Scope = options.global ? 'global' : options.project ? 'project' : 'all';
    const filteredRules = filterByScope(config.rules, scope);

    if (filteredRules.length === 0) {
      console.log('No rules found');
      return;
    }

    console.log(chalk.bold.yellow(`\n📜 Rules (${filteredRules.length})\n`));
    for (const rule of filteredRules) {
      const scopeBadge = scope === 'all' ? chalk.dim(`[${rule.scope}] `) : '';
      console.log(chalk.cyan(`• ${scopeBadge}${rule.file}`));
      if (rule.metadata.paths && rule.metadata.paths.length > 0) {
        console.log(chalk.white(`  Applies to: ${rule.metadata.paths.join(', ')}\n`));
      }
    }
  });

program
  .command('settings')
  .description('Show settings only (-a: all, -g: global, -p: project)')
  .option('-d, --dir <directory>', 'Target directory', process.cwd())
  .option('-g, --global', 'Show global settings only')
  .option('-p, --project', 'Show project settings only')
  .option('-a, --all', 'Show all settings (default)', true)
  .action((options) => {
    const config = scanClaudeConfig(options.dir);
    const scope: Scope = options.global ? 'global' : options.project ? 'project' : 'all';

    console.log(chalk.bold.cyan('\n⚙️  Settings\n'));

    // グローバル設定
    if ((scope === 'global' || scope === 'all') && config.globalSettings) {
      console.log(chalk.bold.yellow('🌍 Global Settings'));
      displaySettings(config.globalSettings, '  ');
      console.log();
    } else if (scope === 'global' && !config.globalSettings) {
      console.log(chalk.dim('🌍 Global Settings: Not found\n'));
    }

    // プロジェクト設定
    if ((scope === 'project' || scope === 'all') && config.projectSettings) {
      console.log(chalk.bold.yellow('📁 Project Settings'));
      displaySettings(config.projectSettings, '  ');
      console.log();
    } else if (scope === 'project' && !config.projectSettings) {
      console.log(chalk.dim('📁 Project Settings: Not found\n'));
    }
  });

program.parse();
