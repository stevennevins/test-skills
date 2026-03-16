# Claude Code Skill Frontmatter Test

Tests how skill frontmatter settings (`context` and `agent`) affect execution behavior in Claude Code — specifically whether a skill runs **inline** (instructions injected into the current conversation) or **forked** (autonomous subagent with isolated context).

## Test Results

Tested with 4 local skills, 4 identical plugin skills, and 1 context isolation probe.

| # | Skill | Source | `context` | `agent` | Expected behavior | Actual behavior | Saw "banana"? |
|---|-------|--------|-----------|---------|-------------------|-----------------|---------------|
| 1 | simplify-default | local | none | none | inline | **INLINE** | n/a |
| 2 | simplify-agent-only | local | none | general-purpose | inline | **INLINE** | n/a |
| 3 | simplify-fork-only | local | fork | none | forked | **FORKED** | n/a |
| 4 | simplify-fork-agent | local | fork | general-purpose | forked | **FORKED** | n/a |
| 5 | plugin-simplify-default | plugin | none | none | inline | **INLINE** | n/a |
| 6 | plugin-simplify-agent-only | plugin | none | general-purpose | inline | **INLINE** | n/a |
| 7 | plugin-simplify-fork-only | plugin | fork | none | forked | **INLINE** | n/a |
| 8 | plugin-simplify-fork-agent | plugin | fork | general-purpose | forked | **INLINE** | n/a |
| 9 | context-probe | local | fork | none | forked, no banana | **FORKED**, no banana | **No** |

## Key Findings

### `context: fork` controls forking
- Skills with `context: fork` run as autonomous subagents with isolated context
- Skills without it run inline (instructions injected into the current conversation)
- `agent: general-purpose` alone has **no effect** on forking behavior

### Plugin skills ignore `context: fork`
- Local skills with `context: fork` properly fork (tests 3, 4)
- Plugin skills with identical `context: fork` frontmatter run inline instead (tests 7, 8)
- This appears to be a bug — plugin and local skills have identical SKILL.md frontmatter but different runtime behavior

### Forked subagents have isolated context
- The context-probe skill (`context: fork`) could **not** see the secret keyword "banana" that was mentioned in the parent conversation
- This confirms that forked skills get a fresh context, not the parent conversation history

## How to reproduce

1. Clone this repo
2. Install the simplify plugin: the plugin source is at [stevennevins/simplify-plugin](https://github.com/stevennevins/simplify-plugin)
3. Set a secret keyword in conversation (e.g., "the secret keyword is banana")
4. Run each skill one at a time and observe inline vs forked behavior
5. After forked skills, reset the file: `git checkout -- src/user-service.ts`

## Repo structure

```
.claude/
  skills/
    simplify-default/SKILL.md       # no context, no agent
    simplify-agent-only/SKILL.md    # agent: general-purpose
    simplify-fork-only/SKILL.md     # context: fork
    simplify-fork-agent/SKILL.md    # context: fork, agent: general-purpose
    context-probe/SKILL.md          # context: fork (isolation test)
  settings.json                     # enables simplify plugin
src/
  user-service.ts                   # intentionally messy code for review skills to find issues
```
