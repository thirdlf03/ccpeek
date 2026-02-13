---
name: resolve-reviews
description: "Fetch PR review comments and propose specific fixes"
argument-hint: "<PR number or URL>"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
context: fork
---

You are resolving PR review comments. Fetch all review feedback, analyze the code, and propose specific fixes.

**You do NOT modify files.** You analyze and propose only. The user decides what to apply.

## Instructions

### Step 1: Identify PR

- If the user provided a PR number or URL, use that
- Otherwise, auto-detect from current branch:
  ```bash
  gh pr view --json number --jq '.number'
  ```
- If no PR is found, inform the user and stop

### Step 2: Fetch PR Info

Run these in parallel:

```bash
# PR overview (title, base branch, changed files)
gh pr view <number> --json title,baseRefName,files,headRefName

# PR diff (to understand full changeset)
gh pr diff <number>
```

### Step 3: Fetch Review Comments

Fetch all 3 types of comments:

```bash
# 1. Inline review comments (file/line specific)
gh api repos/{owner}/{repo}/pulls/<number>/comments \
  --jq '.[] | {id, user: .user.login, path: .path, line: .line, body: .body}'

# 2. General PR comments (conversation)
gh api repos/{owner}/{repo}/issues/<number>/comments \
  --jq '.[] | {id, user: .user.login, body: .body}'

# 3. Review-level comments (top-level review body)
gh pr view <number> --json reviews \
  --jq '.reviews[] | select(.body | length > 0) | {user: .author.login, state: .state, body: .body}'
```

### Step 4: Filter & Classify

For each comment:

1. **Skip** bot comments (user contains `[bot]` or `github-actions`)
2. **Skip** approval-only reviews with no actionable feedback ("LGTM", "Approved" etc.)
3. **Classify** as:
   - **Inline**: Has `path` and `line` -> read the specific file
   - **General**: No file reference -> refer to PR diff for context

### Step 5: Analyze & Propose

For each actionable comment:

1. Read the relevant source file (for inline comments, focus on the referenced lines)
2. Understand what the reviewer is requesting
3. Propose a specific fix with a diff block

### Step 6: Output Report

Present the report in this format:

```markdown
## PR #<number> Review Resolution

**PR**: <title>
**Branch**: <head> → <base>
**Resolved**: N items (inline: X, general: Y)

---

### 1. [path/to/file.ts:42] Comment summary
**Reviewer**: @username
**Comment**:
> Original quote

**Proposal**:
\`\`\`diff
- before
+ after
\`\`\`
**Rationale**: Why this fix is appropriate

---

### 2. [General] Comment summary
**Reviewer**: @username
**Comment**:
> Original quote

**Proposal**: Specific resolution description

---
```

If there are no actionable comments, report:
```
No actionable review comments found.
```

## Rules

- NEVER modify files. You are read-only. Propose only.
- Always quote the original comment so the user can verify context
- Include file:line references for every inline comment
- If a comment is ambiguous, note the ambiguity and propose the most likely interpretation
- Group related comments on the same file together when possible
