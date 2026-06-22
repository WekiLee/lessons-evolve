# Lessons Evolve

[简体中文](README.md)

Lessons Evolve is a multi-agent rule for turning lessons learned into durable agent behavior. It records the first non-obvious pitfall as a **lesson**, promotes a repeated issue into a **pattern**, and solidifies repeatedly validated behavior as an **instinct**.

It is useful during task wrap-ups, incident reviews, weekly or monthly retrospectives, and when you explicitly say things like "this happened again", "we saw this last time", or "capture this lesson".

## Quick Start

Install it into the Agent you are currently using:

```bash
npx lessons-evolve --agent claude
```

List supported targets if you are not sure which Agent paths are available:

```bash
npx lessons-evolve --list
```

If your Agent supports project-level `AGENTS.md`, enable the universal rule in the current project:

```bash
npx lessons-evolve --universal
```

Restart or refresh the target Agent after installation so the new rule can be loaded.

## Install for Different Agents

### Auto-detect Installation

```bash
npx lessons-evolve
```

The installer detects common Agent configuration directories and installs only into targets that already exist. It does not write to user directories during npm package installation.

### Install for Specific Agents

```bash
npx lessons-evolve --agent claude
npx lessons-evolve --agent codex
npx lessons-evolve --agent cursor
npx lessons-evolve --agent windsurf
npx lessons-evolve --agent cline
```

Install to multiple targets in one command:

```bash
npx lessons-evolve --agent claude --agent codex
```

### Install All Known Targets

```bash
npx lessons-evolve --all
```

`--all` creates default directories and writes rules for all known Agents. Use it only when you intentionally want a broad installation.

### Project-level Rules

Cursor, Windsurf, and Cline support project-level rule files:

```bash
npx lessons-evolve --project
```

This writes:

```text
.cursor/rules/lessons-evolve.mdc
.windsurf/rules/lessons-evolve.md
.clinerules/lessons-evolve.md
```

### Universal AGENTS.md Rule

Create or update `AGENTS.md` in the current project:

```bash
npx lessons-evolve --universal
```

Merge the universal rule into global `AGENTS.md` locations for Agents that support it:

```bash
npx lessons-evolve --universal-global
```

Force writing all supported global `AGENTS.md` locations:

```bash
npx lessons-evolve --all --universal-global
```

The merge uses `<!-- lessons-evolve universal start/end -->` markers, so repeated runs update the marked section without overwriting your other content.

### Global npm Installation

```bash
npm install -g lessons-evolve
lessons-evolve --agent claude
```

Global installation only provides the CLI command. The target Agent is selected by the command you run afterward.

### Install via Skills

```bash
npx skills add WekiLee/lessons-evolve
```

Use this in Agent ecosystems that support `npx skills add`.

## Daily Usage

The CLI only installs rules into the selected location. It does not run as a background daemon. Whether Lessons Evolve triggers automatically depends on whether your Agent loads the installed skill, rule, or `AGENTS.md`, and whether the conversation matches a trigger scenario.

Once the rule is loaded, you can usually talk to the Agent normally. If you are not sure whether it triggered, say explicitly:

```text
Use Lessons Evolve to summarize this pitfall and decide whether it should be captured.
```

You can also use the following prompts for different stages.

### First Occurrence

```text
Summarize the pitfall from this task.
```

The Agent should record a lesson with the issue, context, root cause, solution, and evidence ID.

### Second Occurrence

```text
We ran into this problem last time too.
```

The Agent should search existing lessons. If it finds a similar issue, it should ask whether to create a pattern rule. Promotion happens only after you confirm.

### Third or Repeated Validation

```text
This is the third time. Add it to the default checklist.
```

The Agent should ask whether to promote the rule into an instinct, such as a workflow checklist, default check, or project rule.

### Retrospective

```text
Review this task and tell me whether there are any lessons worth capturing.
```

The Agent should capture only non-obvious issues. It should not turn ordinary compiler errors, expected TDD failures, or obvious typos into lessons.

## Confirm That It Works

After installing the rule, restart or refresh the target Agent and send:

```text
Use Lessons Evolve to check whether this task has any lesson worth recording.
```

If the Agent responds using the lesson / pattern / instinct structure, the rule has been loaded. If nothing changes, first check the installed target path:

```bash
npx lessons-evolve --list
```

## What the Agent Does

Lessons Evolve has three levels:

| Level | Trigger | Output |
|---|---|---|
| lesson | First non-obvious occurrence | A structured lesson record |
| pattern | Second similar occurrence, after your confirmation | A skill, rule, or `AGENTS.md` rule section |
| instinct | Repeated validation, after your confirmation | A default check, workflow rule, or long-term knowledge |

Every promotion requires human confirmation. If you reject the same promotion twice, the Agent should stop reminding you about that lesson.

## Where Data Is Stored

Lessons Evolve first tries to use the current Agent's long-term memory or history search capability.

If those capabilities are unavailable, it falls back to a project-local file:

```text
.lessons-evolve/lessons.yaml
```

If file access is unavailable too, the Agent outputs the full record in the reply so you can save it manually.

## Common Commands

| Command | Purpose |
|---|---|
| `npx lessons-evolve --list` | List supported Agents and default target paths |
| `npx lessons-evolve --agent claude` | Install into a specific Agent |
| `npx lessons-evolve --project` | Write Cursor, Windsurf, and Cline project rules |
| `npx lessons-evolve --universal` | Create or update project-level `AGENTS.md` |
| `npx lessons-evolve --universal-global` | Merge into global `AGENTS.md` locations |
| `npx lessons-evolve --all` | Force installation into all known dedicated targets |
| `npx lessons-evolve --help` | Show CLI help |

## Supported Agents

| Agent | Installed Content | Default Target |
|---|---|---|
| Claude Code | `SKILL.md` | `~/.claude/skills/lessons-evolve/SKILL.md` |
| OpenAI Codex CLI | `SKILL.md` | `~/.codex/skills/lessons-evolve/SKILL.md` |
| OpenCode | `SKILL.md` | `~/.config/opencode/skills/lessons-evolve/SKILL.md` |
| MiMo Code | `SKILL.md` | `~/.config/mimocode/skills/lessons-evolve/SKILL.md` |
| Goose | `SKILL.md` | `~/.config/goose/skills/lessons-evolve/SKILL.md` |
| Hermes | `SKILL.md` | `~/.hermes/skills/lessons-evolve/SKILL.md` |
| OpenClaw | `SKILL.md` | `~/.openclaw/skills/lessons-evolve/SKILL.md` |
| Cursor | `.mdc` rule | `~/.cursor/rules/lessons-evolve.mdc` |
| Windsurf | `.md` rule | `~/.windsurf/rules/lessons-evolve.md` |
| Cline | `.md` rule | `~/.clinerules/lessons-evolve.md` |
| Aider | Instruction file | `~/.aider-instructions-lessons-evolve.md` |
| Gemini CLI | `SKILL.md` | Set through `GEMINI_SKILLS_DIR` |

Some default paths are based on common layouts. If your Agent version uses a different path, override it with an environment variable.

## Environment Variable Overrides

| Environment Variable | Purpose |
|---|---|
| `CLAUDE_SKILLS_DIR` | Claude Code skills parent directory |
| `CODEX_SKILLS_DIR` | Codex CLI skills parent directory |
| `OPENCODE_SKILLS_DIR` | OpenCode skills parent directory |
| `MIMOCODE_SKILLS_DIR` | MiMo Code skills parent directory |
| `GOOSE_SKILLS_DIR` | Goose skills parent directory |
| `HERMES_SKILLS_DIR` | Hermes skills parent directory |
| `OPENCLAW_SKILLS_DIR` | OpenClaw skills parent directory |
| `CURSOR_RULES_DIR` | Cursor rules directory |
| `WINDSURF_RULES_DIR` | Windsurf rules directory |
| `CLINE_RULES_DIR` | Cline rules directory |
| `AIDER_INSTRUCTIONS_DIR` | Aider instruction file directory |
| `GEMINI_SKILLS_DIR` | Gemini CLI skills parent directory |
| `CODEX_AGENTS_MD` | Codex CLI global `AGENTS.md` path |
| `OPENCODE_AGENTS_MD` | OpenCode global `AGENTS.md` path |
| `MIMOCODE_AGENTS_MD` | MiMo Code global `AGENTS.md` path |
| `HERMES_AGENTS_MD` | Hermes global `AGENTS.md` path |
| `OPENCLAW_AGENTS_MD` | OpenClaw global `AGENTS.md` path |

Example:

```bash
export CLAUDE_SKILLS_DIR=/path/to/custom/skills
npx lessons-evolve --agent claude
```

## Manual Installation

```bash
git clone https://github.com/WekiLee/lessons-evolve.git
```

Copy `SKILL.md` into an Agent skills directory:

```bash
mkdir -p ~/.claude/skills/lessons-evolve
cp lessons-evolve/SKILL.md ~/.claude/skills/lessons-evolve/SKILL.md
```

Copy the universal rule into the current project:

```bash
cp lessons-evolve/AGENTS.md ./AGENTS.md
```

Copy project-level rules:

```bash
mkdir -p .cursor/rules
cp lessons-evolve/rules/cursor.mdc .cursor/rules/lessons-evolve.mdc

mkdir -p .windsurf/rules
cp lessons-evolve/rules/windsurf.md .windsurf/rules/lessons-evolve.md

mkdir -p .clinerules
cp lessons-evolve/rules/cline.md .clinerules/lessons-evolve.md
```

## Validate Installation

Check that the CLI is available:

```bash
npx lessons-evolve --help
```

List target paths:

```bash
npx lessons-evolve --list
```

Validate the project structure:

```bash
npm test
```

## Troubleshooting

### Agent Not Detected

Run:

```bash
npx lessons-evolve --list
```

Check whether the target path matches your Agent version. If it does not, override it with the corresponding environment variable.

### Gemini CLI Installation Fails

Gemini does not have a fixed default path in this project. Set it explicitly:

```bash
export GEMINI_SKILLS_DIR=/path/to/gemini/skills
npx lessons-evolve --agent gemini
```

### Rule Does Not Take Effect

Confirm that the file was written to the target directory, then restart or refresh the Agent. Project-level `AGENTS.md` and rule files usually require reopening the project or refreshing the context.

## Repository Layout

```text
lessons-evolve/
├── SKILL.md
├── AGENTS.md
├── README.md
├── README_EN.md
├── LICENSE
├── package.json
├── bin/
│   └── install.js
├── rules/
│   ├── cursor.mdc
│   ├── windsurf.md
│   ├── cline.md
│   ├── aider-instructions.md
│   └── gemini.md
├── examples/
│   └── example.md
└── tests/
    └── validate.js
```

## Contributing

Issues and pull requests are welcome. If you know the rule path for another Agent, you can add it to the `SUPPORTED_AGENTS` mapping in `bin/install.js`.

Before submitting changes, run:

```bash
npm ci --ignore-scripts
npm test
npm pack --dry-run
```

## License

MIT
