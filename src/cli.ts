#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Command } from 'commander';
import chalk from 'chalk';
import type { ClaudeConfig, Scope } from './types.js';
import { scanClaudeConfig } from './scanner.js';
import { displayConfig, displaySummary, displaySettings } from './viewer.js';
import { exportToJson, exportToMarkdown } from './exporter.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

// ヘルパー関数
function filterByScope<T extends { scope: 'global' | 'project' }>(items: T[], scope: Scope): T[] {
  if (scope === 'all') return items;
  return items.filter(item => item.scope === scope);
}

function filterConfigByScope(config: ClaudeConfig, scope: Scope): ClaudeConfig {
  return {
    agents: filterByScope(config.agents, scope),
    skills: filterByScope(config.skills, scope),
    rules: filterByScope(config.rules, scope),
    globalSettings: (scope === 'all' || scope === 'global') ? config.globalSettings : undefined,
    projectSettings: (scope === 'all' || scope === 'project') ? config.projectSettings : undefined,
  };
}

function resolveOptions(command: Command): { scope: Scope; dir: string; json?: string | boolean; markdown?: string | boolean } {
  const opts = command.optsWithGlobals();
  const scope: Scope = opts.global ? 'global' : opts.project ? 'project' : 'all';
  return { scope, dir: opts.dir, json: opts.json, markdown: opts.markdown };
}

function outputOrWrite(content: string, target: string | boolean): void {
  if (typeof target === 'string') {
    writeFileSync(target, content);
    console.log(`Exported to ${target}`);
  } else {
    console.log(content);
  }
}

// プログラム定義
const program = new Command();

// 共通オプションを Command に追加するヘルパー
function addCommonOptions(cmd: Command): Command {
  return cmd
    .option('-g, --global', 'Show global scope only')
    .option('-p, --project', 'Show project scope only')
    .option('-a, --all', 'Show all scopes (default)')
    .option('-d, --dir <directory>', 'Target directory', process.cwd())
    .option('-j, --json [file]', 'Output as JSON (optionally to file)')
    .option('-m, --markdown [file]', 'Output as Markdown (optionally to file)');
}

addCommonOptions(program
  .name('ccpeek')
  .description('Visualize .claude configuration files')
  .version(version));

// show コマンド（デフォルト）
const showCmd = program
  .command('show', { isDefault: true })
  .description('Show the full configuration')
  .option('-s, --summary', 'Show summary only');
addCommonOptions(showCmd)
  .action((options, command) => {
    const { scope, dir, json, markdown } = resolveOptions(command);
    const config = scanClaudeConfig(dir);
    const filtered = filterConfigByScope(config, scope);

    if (json) {
      outputOrWrite(exportToJson(filtered), json);
      return;
    }
    if (markdown) {
      outputOrWrite(exportToMarkdown(filtered), markdown);
      return;
    }

    if (options.summary) {
      displaySummary(filtered);
    } else {
      displayConfig(filtered);
    }
  });

// リスト系サブコマンドのファクトリ
function registerListCommand(
  name: string,
  description: string,
  emoji: string,
  getItems: (config: ClaudeConfig) => Array<{ scope: 'global' | 'project'; [key: string]: any }>,
  displayItem: (item: any, scopeBadge: string) => void,
) {
  const cmd = program
    .command(name)
    .description(description);
  addCommonOptions(cmd)
    .action((_opts: any, command: Command) => {
      const { scope, dir, json } = resolveOptions(command);
      const config = scanClaudeConfig(dir);
      const items = filterByScope(getItems(config), scope);

      if (json) {
        outputOrWrite(JSON.stringify(items, null, 2), json);
        return;
      }

      if (items.length === 0) {
        console.log(`No ${name} found`);
        return;
      }

      console.log(chalk.bold.yellow(`\n${emoji} ${name.charAt(0).toUpperCase() + name.slice(1)} (${items.length})\n`));
      for (const item of items) {
        const badge = scope === 'all' ? chalk.dim(`[${item.scope}] `) : '';
        displayItem(item, badge);
      }
    });
}

registerListCommand('agents', 'Show agents', '\u{1F916}',
  (c) => c.agents,
  (a, badge) => {
    console.log(chalk.green(`\u2022 ${badge}${a.metadata.name}`));
    console.log(chalk.white(`  ${a.metadata.description}`));
    console.log(chalk.cyan(`  ${a.file}\n`));
  });

registerListCommand('skills', 'Show skills', '\u2728',
  (c) => c.skills,
  (s, badge) => {
    console.log(chalk.green(`\u2022 ${badge}${s.metadata.name}`));
    console.log(chalk.white(`  ${s.metadata.description}`));
    console.log(chalk.cyan(`  ${s.file}\n`));
  });

registerListCommand('rules', 'Show rules', '\u{1F4DC}',
  (c) => c.rules,
  (r, badge) => {
    console.log(chalk.cyan(`\u2022 ${badge}${r.file}`));
    if (r.metadata.paths && r.metadata.paths.length > 0) {
      console.log(chalk.white(`  Applies to: ${r.metadata.paths.join(', ')}\n`));
    }
  });

// settings コマンド（構造が異なるため個別定義）
const settingsCmd = program
  .command('settings')
  .description('Show settings');
addCommonOptions(settingsCmd)
  .action((_opts: any, command: Command) => {
    const { scope, dir, json } = resolveOptions(command);
    const config = scanClaudeConfig(dir);
    const filtered = filterConfigByScope(config, scope);

    if (json) {
      const settingsObj: Record<string, any> = {};
      if (filtered.globalSettings) settingsObj.global = filtered.globalSettings;
      if (filtered.projectSettings) settingsObj.project = filtered.projectSettings;
      outputOrWrite(JSON.stringify(settingsObj, null, 2), json);
      return;
    }

    console.log(chalk.bold.cyan('\n\u2699\uFE0F  Settings\n'));

    if ((scope === 'global' || scope === 'all') && filtered.globalSettings) {
      console.log(chalk.bold.yellow('\u{1F30D} Global Settings'));
      displaySettings(filtered.globalSettings, '  ');
      console.log();
    } else if (scope === 'global' && !filtered.globalSettings) {
      console.log(chalk.dim('\u{1F30D} Global Settings: Not found\n'));
    }

    if ((scope === 'project' || scope === 'all') && filtered.projectSettings) {
      console.log(chalk.bold.yellow('\u{1F4C1} Project Settings'));
      displaySettings(filtered.projectSettings, '  ');
      console.log();
    } else if (scope === 'project' && !filtered.projectSettings) {
      console.log(chalk.dim('\u{1F4C1} Project Settings: Not found\n'));
    }
  });

program.parse();
