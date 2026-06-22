# Lessons Evolve（经验三级进化）

[English](README_EN.md)

Lessons Evolve 是一个多 Agent 经验沉淀规则：把一次踩坑记录为 **lesson**，把第二次重复问题晋升为 **pattern**，把多次验证有效的规则固化为 **instinct**。

它适合用于任务结项、故障复盘、周报/月报复盘，以及你明确说“又遇到了”“上次也这样”“把这次经验沉淀一下”的场景。

## 快速开始

最常用方式是直接用 `npx` 安装到当前使用的 Agent：

```bash
npx lessons-evolve --agent claude
```

如果你不确定当前环境支持哪些目标：

```bash
npx lessons-evolve --list
```

如果你的 Agent 支持项目级 `AGENTS.md`，可以在当前项目启用通用规则：

```bash
npx lessons-evolve --universal
```

安装后重启或刷新对应 Agent，使新规则被加载。

## 安装到不同 Agent

### 自动检测安装

```bash
npx lessons-evolve
```

脚本会检测常见 Agent 配置目录，只安装到已检测到的目标。它不会在包安装阶段自动写用户目录。

### 指定 Agent 安装

```bash
npx lessons-evolve --agent claude
npx lessons-evolve --agent codex
npx lessons-evolve --agent cursor
npx lessons-evolve --agent windsurf
npx lessons-evolve --agent cline
```

可以一次指定多个：

```bash
npx lessons-evolve --agent claude --agent codex
```

### 安装全部已知目标

```bash
npx lessons-evolve --all
```

`--all` 会为所有已知 Agent 创建默认目录并写入规则。只在你明确希望批量安装时使用。

### 项目级规则

Cursor、Windsurf、Cline 支持项目级规则文件：

```bash
npx lessons-evolve --project
```

这会在当前项目写入：

```text
.cursor/rules/lessons-evolve.mdc
.windsurf/rules/lessons-evolve.md
.clinerules/lessons-evolve.md
```

### AGENTS.md 通用规则

在当前项目创建或更新 `AGENTS.md`：

```bash
npx lessons-evolve --universal
```

将通用规则合并到支持 `AGENTS.md` 的 Agent 全局配置：

```bash
npx lessons-evolve --universal-global
```

强制写入所有支持 `AGENTS.md` 的全局配置：

```bash
npx lessons-evolve --all --universal-global
```

合并使用 `<!-- lessons-evolve universal start/end -->` 标记，重复执行会更新标记区间，不会覆盖你的其他内容。

### npm 全局安装

```bash
npm install -g lessons-evolve
lessons-evolve --agent claude
```

全局安装只提供 CLI 命令；是否写入哪个 Agent 由后续命令显式决定。

### 通过 Skills 安装

```bash
npx skills add WekiLee/lessons-evolve
```

适用于支持 `npx skills add` 的 Agent 生态。

## 日常怎么用

CLI 只负责把规则安装到对应位置，不会在后台常驻运行。安装后是否“自动触发”，取决于当前 Agent 是否加载了该 skill / rule / `AGENTS.md`，以及你的对话是否命中触发场景。

规则已加载时，通常直接和 Agent 对话即可。如果你不确定是否已触发，建议显式说：

```text
使用 Lessons Evolve，总结这次踩坑并判断是否需要沉淀。
```

你也可以用下面这些话术触发不同阶段。

### 第一次遇到问题

你可以说：

```text
总结下这次踩的坑。
```

Agent 应记录一条 lesson，包含问题、触发场景、根因、解决方式和证据 ID。

### 第二次遇到同类问题

你可以说：

```text
这个问题上次也遇到过。
```

Agent 应搜索历史 lesson。如果命中同类问题，会询问是否创建 pattern 规则。只有你确认后才会晋升。

### 第三次或多次验证

你可以说：

```text
第三次了，把它固化到默认检查里。
```

Agent 应确认是否把规则升级为 instinct，例如加入流程 checklist、默认检查项或项目规则。

### 主动复盘

你可以说：

```text
复盘一下这轮任务，有没有值得沉淀的经验？
```

Agent 应只记录非显然问题，不会把普通编译错误、TDD 预期失败或明显 typo 强行沉淀。

## 如何确认已生效

安装规则后，重启或刷新对应 Agent，然后发送：

```text
使用 Lessons Evolve，检查本轮任务有没有值得记录的 lesson。
```

如果 Agent 能按 lesson / pattern / instinct 的结构回应，说明规则已被加载。若没有明显变化，优先检查安装目标路径是否正确：

```bash
npx lessons-evolve --list
```

## Agent 会做什么

Lessons Evolve 的行为分为三层：

| 层级 | 触发 | 产物 |
|---|---|---|
| lesson | 第一次遇到非显然问题 | 一条结构化经验记录 |
| pattern | 第二次遇到同类问题，并经你确认 | 一个 skill、rule 或 `AGENTS.md` 规则段 |
| instinct | 多次验证有效，并经你确认 | 默认检查项、流程规则或长期知识 |

每次晋升都需要人工确认。用户连续拒绝两次后，同一问题不再反复提醒。

## 数据保存在哪里

Lessons Evolve 优先使用当前 Agent 的长期记忆或历史检索能力。

如果当前 Agent 没有对应能力，会降级到当前项目文件：

```text
.lessons-evolve/lessons.yaml
```

如果文件能力也不可用，Agent 会在回复里输出完整记录，让你自行保存。

## 常用命令

| 命令 | 作用 |
|---|---|
| `npx lessons-evolve --list` | 查看支持的 Agent 和默认目标路径 |
| `npx lessons-evolve --agent claude` | 安装到指定 Agent |
| `npx lessons-evolve --project` | 写入 Cursor/Windsurf/Cline 项目级规则 |
| `npx lessons-evolve --universal` | 在当前项目创建或更新 `AGENTS.md` |
| `npx lessons-evolve --universal-global` | 合并到支持 `AGENTS.md` 的全局配置 |
| `npx lessons-evolve --all` | 强制安装到所有已知专用目标 |
| `npx lessons-evolve --help` | 查看 CLI 帮助 |

## 支持的 Agent

| Agent | 安装内容 | 默认目标 |
|---|---|---|
| Claude Code | `SKILL.md` | `~/.claude/skills/lessons-evolve/SKILL.md` |
| OpenAI Codex CLI | `SKILL.md` | `~/.codex/skills/lessons-evolve/SKILL.md` |
| OpenCode | `SKILL.md` | `~/.config/opencode/skills/lessons-evolve/SKILL.md` |
| MiMo Code | `SKILL.md` | `~/.config/mimocode/skills/lessons-evolve/SKILL.md` |
| Goose | `SKILL.md` | `~/.config/goose/skills/lessons-evolve/SKILL.md` |
| Hermes | `SKILL.md` | `~/.hermes/skills/lessons-evolve/SKILL.md` |
| OpenClaw | `SKILL.md` | `~/.openclaw/skills/lessons-evolve/SKILL.md` |
| Cursor | `.mdc` 规则 | `~/.cursor/rules/lessons-evolve.mdc` |
| Windsurf | `.md` 规则 | `~/.windsurf/rules/lessons-evolve.md` |
| Cline | `.md` 规则 | `~/.clinerules/lessons-evolve.md` |
| Aider | 指令文件 | `~/.aider-instructions-lessons-evolve.md` |
| Gemini CLI | `SKILL.md` | 需通过 `GEMINI_SKILLS_DIR` 指定 |

部分 Agent 的默认路径基于常见配置整理。如果你的版本路径不同，可以用环境变量覆盖。

## 环境变量覆盖

| 环境变量 | 作用 |
|---|---|
| `CLAUDE_SKILLS_DIR` | Claude Code skills 父目录 |
| `CODEX_SKILLS_DIR` | Codex CLI skills 父目录 |
| `OPENCODE_SKILLS_DIR` | OpenCode skills 父目录 |
| `MIMOCODE_SKILLS_DIR` | MiMo Code skills 父目录 |
| `GOOSE_SKILLS_DIR` | Goose skills 父目录 |
| `HERMES_SKILLS_DIR` | Hermes skills 父目录 |
| `OPENCLAW_SKILLS_DIR` | OpenClaw skills 父目录 |
| `CURSOR_RULES_DIR` | Cursor 规则目录 |
| `WINDSURF_RULES_DIR` | Windsurf 规则目录 |
| `CLINE_RULES_DIR` | Cline 规则目录 |
| `AIDER_INSTRUCTIONS_DIR` | Aider 指令文件存放目录 |
| `GEMINI_SKILLS_DIR` | Gemini CLI skills 父目录 |
| `CODEX_AGENTS_MD` | Codex CLI 全局 `AGENTS.md` 路径 |
| `OPENCODE_AGENTS_MD` | OpenCode 全局 `AGENTS.md` 路径 |
| `MIMOCODE_AGENTS_MD` | MiMo Code 全局 `AGENTS.md` 路径 |
| `HERMES_AGENTS_MD` | Hermes 全局 `AGENTS.md` 路径 |
| `OPENCLAW_AGENTS_MD` | OpenClaw 全局 `AGENTS.md` 路径 |

示例：

```bash
export CLAUDE_SKILLS_DIR=/path/to/custom/skills
npx lessons-evolve --agent claude
```

## 手动安装

```bash
git clone https://github.com/WekiLee/lessons-evolve.git
```

复制 `SKILL.md` 到 Agent 的 skills 目录：

```bash
mkdir -p ~/.claude/skills/lessons-evolve
cp lessons-evolve/SKILL.md ~/.claude/skills/lessons-evolve/SKILL.md
```

复制通用规则到当前项目：

```bash
cp lessons-evolve/AGENTS.md ./AGENTS.md
```

复制项目级规则：

```bash
mkdir -p .cursor/rules
cp lessons-evolve/rules/cursor.mdc .cursor/rules/lessons-evolve.mdc

mkdir -p .windsurf/rules
cp lessons-evolve/rules/windsurf.md .windsurf/rules/lessons-evolve.md

mkdir -p .clinerules
cp lessons-evolve/rules/cline.md .clinerules/lessons-evolve.md
```

## 验证安装

查看 CLI 是否可用：

```bash
npx lessons-evolve --help
```

查看目标路径：

```bash
npx lessons-evolve --list
```

验证项目结构：

```bash
npm test
```

## 排错

### 没检测到 Agent

运行：

```bash
npx lessons-evolve --list
```

确认目标路径是否符合你的 Agent 版本。如果不一致，用对应环境变量覆盖。

### Gemini CLI 安装失败

Gemini 默认路径未固定，需要先设置：

```bash
export GEMINI_SKILLS_DIR=/path/to/gemini/skills
npx lessons-evolve --agent gemini
```

### 规则没有生效

确认文件已经写入目标目录，然后重启或刷新对应 Agent。项目级 `AGENTS.md` 或 rules 文件通常需要重新打开项目或刷新上下文后生效。

## 目录结构

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

## 贡献

欢迎提交 Issue 和 Pull Request。如果你知道其他 Agent 的规则路径，也可以补充到 `bin/install.js` 的 `SUPPORTED_AGENTS` 映射中。

提交前建议运行：

```bash
npm ci --ignore-scripts
npm test
npm pack --dry-run
```

## 许可证

MIT
