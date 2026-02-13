# ccsetting

.claude configuration を可視化するCLIツール

## インストール

```bash
# npxで直接実行
npx ccsetting

# またはグローバルインストール
npm install -g ccsetting
```

## 使い方

```bash
# 全設定を表示
ccsetting
# または
ccsetting show

# サマリーのみ表示
ccsetting show --summary

# エージェント一覧のみ
ccsetting agents              # 全エージェント（グローバル＋プロジェクト）
ccsetting agents --global     # グローバルエージェントのみ
ccsetting agents --project    # プロジェクトエージェントのみ

# スキル一覧のみ
ccsetting skills              # 全スキル（グローバル＋プロジェクト）
ccsetting skills --global     # グローバルスキルのみ
ccsetting skills --project    # プロジェクトスキルのみ

# ルール一覧のみ
ccsetting rules               # 全ルール（グローバル＋プロジェクト）
ccsetting rules --global      # グローバルルールのみ
ccsetting rules --project     # プロジェクトルールのみ

# 設定のみ
ccsetting settings            # グローバル＋プロジェクト設定
ccsetting settings --global   # グローバル設定のみ
ccsetting settings --project  # プロジェクト設定のみ

# 特定のディレクトリを指定
ccsetting --dir /path/to/project

# エクスポート機能
ccsetting show --json config.json     # JSON形式でエクスポート
ccsetting show --markdown config.md   # Markdown形式でエクスポート
```

### スコープフラグ

すべてのコマンドで以下のフラグが使用できます：

- `--global` / `-g`: グローバル設定のみ表示
- `--project` / `-p`: プロジェクト設定のみ表示
- `--all` / `-a`: 全て表示（デフォルト）

`--all` の場合、各項目に `[global]` または `[project]` のバッジが表示されます。

## 出力例

```bash
$ ccsetting

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
