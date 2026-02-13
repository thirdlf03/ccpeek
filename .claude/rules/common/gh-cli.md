# GitHub CLI (gh)

- Use `gh` for all GitHub operations (PRs, issues, releases, CI, API)
- Default merge strategy: `--squash --delete-branch`

## Pitfalls

- `gh pr create` fails on unpushed branches — run `git push -u origin <branch>` first
- `--base` defaults to the repo's default branch when omitted (may not match intent)
- Do not guess `--json` field names — check `--help` for valid JSON FIELDS
- PR body containing `$` triggers shell expansion — always wrap with HEREDOC (`<<'EOF'`)
- `gh issue close --reason` accepts only `completed` or `"not planned"`
- `gh pr checks` exit code 1 may mean "no checks configured", not "checks failed"
- Filter large `gh api` responses with `--jq`
- Use `length > 0` instead of `!=` in jq (avoids bash escaping issues)
- `gh secret list` shows names only (values are not readable)

## Fetching PR Comments

```bash
# General PR comments — use the issues endpoint
gh api repos/{owner}/{repo}/issues/42/comments --jq '.[].body'

# Inline review comments — use the pulls endpoint
gh api repos/{owner}/{repo}/pulls/42/comments \
  --jq '.[] | {user: .user.login, path: .path, line: .line, body: .body}'
```
