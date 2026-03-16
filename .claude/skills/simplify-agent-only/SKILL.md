---
name: simplify-agent-only
description: Review changed code for reuse, quality, and efficiency, then fix any issues found. Test variant with agent field only (no context).
agent: general-purpose
---

# Simplify Code Review

Review recently changed code for quality issues and fix them.

## Process

1. Get the diff of changed files:
   ```bash
   git diff HEAD
   ```
   If no staged/unstaged changes, check last commit:
   ```bash
   git diff HEAD~1
   ```

2. For each changed file, review for:
   - **Reuse**: Is there existing code that already does this? Check for duplicated logic.
   - **Quality**: Are there bugs, unclear names, missing edge cases?
   - **Efficiency**: Any unnecessary loops, allocations, or redundant operations?

3. Fix any issues found directly in the code.

4. Summarize what was changed and why.

## Rules

- Only review files that were actually changed
- Only fix real problems, not style preferences
- Keep fixes minimal and focused
