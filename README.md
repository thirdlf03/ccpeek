# ccpeek

.claude configuration を可視化するCLIツール

## インストール

```bash
# npxで直接実行
npx ccpeek

# またはグローバルインストール
npm install -g ccpeek
```

## 使い方

```bash
# 全設定を表示
ccpeek
# または
ccpeek show

# サマリーのみ表示
ccpeek show --summary

# スコープフラグ（トップレベルで使用可能）
ccpeek -p              # プロジェクト設定のみ表示
ccpeek -g              # グローバル設定のみ表示

# エージェント一覧のみ
ccpeek agents              # 全エージェント（グローバル＋プロジェクト）
ccpeek agents --global     # グローバルエージェントのみ
ccpeek agents --project    # プロジェクトエージェントのみ

# スキル一覧のみ
ccpeek skills              # 全スキル（グローバル＋プロジェクト）
ccpeek skills --global     # グローバルスキルのみ
ccpeek skills --project    # プロジェクトスキルのみ

# ルール一覧のみ
ccpeek rules               # 全ルール（グローバル＋プロジェクト）
ccpeek rules --global      # グローバルルールのみ
ccpeek rules --project     # プロジェクトルールのみ

# 設定のみ
ccpeek settings            # グローバル＋プロジェクト設定
ccpeek settings --global   # グローバル設定のみ
ccpeek settings --project  # プロジェクト設定のみ

# 特定のディレクトリを指定
ccpeek --dir /path/to/project

# エクスポート機能
ccpeek --json                     # JSON形式で標準出力
ccpeek --json config.json         # JSON形式でファイルにエクスポート
ccpeek --markdown config.md       # Markdown形式でファイルにエクスポート
ccpeek agents --json              # エージェントのみJSON出力
ccpeek agents --json agents.json  # エージェントのみJSONファイルにエクスポート
```

### スコープフラグ

すべてのコマンドで以下のフラグが使用できます：

- `--global` / `-g`: グローバル設定のみ表示
- `--project` / `-p`: プロジェクト設定のみ表示
- `--all` / `-a`: 全て表示（デフォルト）

`--all` の場合、各項目に `[global]` または `[project]` のバッジが表示されます。

## 出力例

```bash
$ ccpeek

📋 Claude Code Configuration

🌍 Global Settings
  Language: japanase
  Model: sonnet
  Effort Level: medium
  Permissions:
    Default Mode: default
  Hooks: 3 types

📁 Project Settings
  Permissions:
    Allow (10):
      ✓ Edit(*)
      ✓ Write(*)
      ...
    Deny (3):
      ✗ Bash(rm -rf:*)
      ✗ Read(.env)
  Plugins: 5/6 enabled

🤖 Agents (5)
  • code-reviewer
    Comprehensive code quality reviewer...
    Tools: Read, Grep, Glob, Bash
    .claude/agents/code-reviewer.md

✨ Skills (9)
  • code-review
    Perform a comprehensive code quality review
    .claude/skills/code-review/SKILL.md

📜 Rules (7)
  • .claude/rules/common/code-style.md
    Applies to: **/*.ts, **/*.tsx
```

## 機能

- ✅ グローバル設定の表示 (`~/.claude/settings.json`)
- ✅ プロジェクト設定の表示 (`.claude/settings.json`)
- ✅ カスタムエージェント一覧
- ✅ スキル一覧
- ✅ ルール一覧
- ✅ Permissions/Hooks/Plugins の要約表示
- ✅ JSON/Markdown エクスポート（全コマンド対応）
- ✅ スコープフィルタリング（グローバル/プロジェクト）

## 開発

```bash
# 依存関係のインストール
pnpm install

# 開発モードで実行
pnpm dev

# ビルド
pnpm build
```

## ライセンス

MIT
