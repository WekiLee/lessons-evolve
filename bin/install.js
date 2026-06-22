#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * 多 Agent 安装脚本
 * 默认：自动检测已安装的 Agent，并将 skill 复制到对应目录
 * 参数：
 *   --agent, -a <name>   仅安装指定 Agent（可多次使用）
 *   --all                为所有已知 Agent 创建目录并安装
 *   --project            将 Cursor/Windsurf/Cline 规则复制到当前项目目录
 *   --universal          将 AGENTS.md 合并到当前项目目录（跨 Agent 通用规则）
 *   --universal-global   将 AGENTS.md 合并到支持 AGENTS.md 的 Agent 全局配置
 *   --list               列出支持的 Agent
 *   --help, -h           显示帮助
 */

const skillName = 'lessons-evolve';
const rootDir = path.join(__dirname, '..');
const homeDir = os.homedir();

const MARKER_START = '<!-- lessons-evolve universal start -->';
const MARKER_END = '<!-- lessons-evolve universal end -->';

function envPath(name) {
  return process.env[name] ? path.resolve(process.env[name]) : null;
}

const SUPPORTED_AGENTS = [
  {
    name: 'claude',
    label: 'Claude Code',
    isSkillDir: true,
    defaultDir: path.join(homeDir, '.claude', 'skills', skillName),
    fileName: 'SKILL.md',
    source: 'SKILL.md',
    env: 'CLAUDE_SKILLS_DIR',
  },
  {
    name: 'codex',
    label: 'OpenAI Codex CLI',
    isSkillDir: true,
    defaultDir: path.join(homeDir, '.codex', 'skills', skillName),
    fileName: 'SKILL.md',
    source: 'SKILL.md',
    env: 'CODEX_SKILLS_DIR',
  },
  {
    name: 'opencode',
    label: 'OpenCode',
    isSkillDir: true,
    defaultDir: path.join(homeDir, '.config', 'opencode', 'skills', skillName),
    fileName: 'SKILL.md',
    source: 'SKILL.md',
    env: 'OPENCODE_SKILLS_DIR',
  },
  {
    name: 'mimocode',
    label: 'MiMo Code',
    isSkillDir: true,
    defaultDir: path.join(homeDir, '.config', 'mimocode', 'skills', skillName),
    fileName: 'SKILL.md',
    source: 'SKILL.md',
    env: 'MIMOCODE_SKILLS_DIR',
  },
  {
    name: 'goose',
    label: 'Goose',
    isSkillDir: true,
    defaultDir: path.join(homeDir, '.config', 'goose', 'skills', skillName),
    fileName: 'SKILL.md',
    source: 'SKILL.md',
    env: 'GOOSE_SKILLS_DIR',
  },
  {
    name: 'hermes',
    label: 'Hermes',
    isSkillDir: true,
    defaultDir: path.join(homeDir, '.hermes', 'skills', skillName),
    fileName: 'SKILL.md',
    source: 'SKILL.md',
    env: 'HERMES_SKILLS_DIR',
  },
  {
    name: 'openclaw',
    label: 'OpenClaw',
    isSkillDir: true,
    defaultDir: path.join(homeDir, '.openclaw', 'skills', skillName),
    fileName: 'SKILL.md',
    source: 'SKILL.md',
    env: 'OPENCLAW_SKILLS_DIR',
  },
  {
    name: 'cursor',
    label: 'Cursor',
    defaultDir: path.join(homeDir, '.cursor', 'rules'),
    fileName: `${skillName}.mdc`,
    source: path.join('rules', 'cursor.mdc'),
    env: 'CURSOR_RULES_DIR',
    projectDir: path.join(process.cwd(), '.cursor', 'rules'),
  },
  {
    name: 'windsurf',
    label: 'Windsurf',
    defaultDir: path.join(homeDir, '.windsurf', 'rules'),
    fileName: `${skillName}.md`,
    source: path.join('rules', 'windsurf.md'),
    env: 'WINDSURF_RULES_DIR',
    projectDir: path.join(process.cwd(), '.windsurf', 'rules'),
  },
  {
    name: 'cline',
    label: 'Cline',
    defaultDir: path.join(homeDir, '.clinerules'),
    fileName: `${skillName}.md`,
    source: path.join('rules', 'cline.md'),
    env: 'CLINE_RULES_DIR',
    projectDir: path.join(process.cwd(), '.clinerules'),
  },
  {
    name: 'aider',
    label: 'Aider',
    defaultDir: homeDir,
    fileName: `.aider-instructions-${skillName}.md`,
    source: path.join('rules', 'aider-instructions.md'),
    env: 'AIDER_INSTRUCTIONS_DIR',
  },
  {
    name: 'gemini',
    label: 'Gemini CLI',
    isSkillDir: true,
    defaultDir: null,
    fileName: 'SKILL.md',
    source: 'SKILL.md',
    env: 'GEMINI_SKILLS_DIR',
  },
];

// 支持 AGENTS.md 作为全局规则层的 Agent
const UNIVERSAL_AGENTS = [
  {
    name: 'codex',
    label: 'OpenAI Codex CLI',
    defaultFile: path.join(homeDir, '.codex', 'AGENTS.md'),
    env: 'CODEX_AGENTS_MD',
  },
  {
    name: 'opencode',
    label: 'OpenCode',
    defaultFile: path.join(homeDir, '.config', 'opencode', 'AGENTS.md'),
    env: 'OPENCODE_AGENTS_MD',
  },
  {
    name: 'mimocode',
    label: 'MiMo Code',
    defaultFile: path.join(homeDir, '.config', 'mimocode', 'AGENTS.md'),
    env: 'MIMOCODE_AGENTS_MD',
  },
  {
    name: 'hermes',
    label: 'Hermes',
    defaultFile: path.join(homeDir, '.hermes', 'AGENTS.md'),
    env: 'HERMES_AGENTS_MD',
  },
  {
    name: 'openclaw',
    label: 'OpenClaw',
    defaultFile: path.join(homeDir, '.openclaw', 'AGENTS.md'),
    env: 'OPENCLAW_AGENTS_MD',
  },
];

function resolveDir(agent) {
  const env = envPath(agent.env);
  if (env) {
    return agent.isSkillDir ? path.join(env, skillName) : env;
  }
  return agent.defaultDir;
}

function resolveUniversalFile(agent) {
  const env = envPath(agent.env);
  if (env) return env;
  return agent.defaultFile;
}

function parentExists(dir) {
  if (!dir) return false;
  const parent = path.dirname(dir);
  return fs.existsSync(parent);
}

function shouldAutoInstall(agent) {
  if (envPath(agent.env)) return true;
  if (agent.name === 'aider') return false; // Aider 不自动写入 home，避免打扰
  if (agent.name === 'gemini') return false; // Gemini 默认路径未确认
  if (['cursor', 'windsurf', 'cline'].includes(agent.name)) {
    return parentExists(agent.defaultDir);
  }
  return parentExists(agent.defaultDir);
}

function installAgent(agent, targetDir, forceCreate = false, requireInstall = false) {
  const dir = targetDir || resolveDir(agent);
  if (!dir) {
    if (requireInstall) {
      console.error(`❌ [${agent.label}] 无法安装：未设置 ${agent.env}，请设置后重试`);
      return { error: true };
    }
    console.log(`⏭️  [${agent.label}] 未设置 ${agent.env}，跳过（Gemini 等需手动配置）`);
    return { skipped: true };
  }

  if (!forceCreate && !fs.existsSync(path.dirname(dir))) {
    console.log(`⏭️  [${agent.label}] 未检测到配置目录，跳过（可用 --all 或 --agent ${agent.name} 强制安装）`);
    return { skipped: true };
  }

  const sourceFile = path.join(rootDir, agent.source);
  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ [${agent.label}] 源文件不存在：${sourceFile}`);
    return { error: true };
  }

  fs.mkdirSync(dir, { recursive: true });
  const targetFile = path.join(dir, agent.fileName);
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`✅ [${agent.label}] 已安装到 ${targetFile}`);
  return { ok: true };
}

/**
 * 安全合并 AGENTS.md：通过标记实现幂等更新，不覆盖用户已有内容
 */
function mergeAgentsMd(targetFile, sourceFile) {
  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ 源文件不存在：${sourceFile}`);
    return { error: true };
  }

  const sourceContent = fs.readFileSync(sourceFile, 'utf8').trim();
  const section = `\n${MARKER_START}\n\n${sourceContent}\n\n${MARKER_END}\n`;

  let targetContent = '';
  let existing = false;
  if (fs.existsSync(targetFile)) {
    targetContent = fs.readFileSync(targetFile, 'utf8');
    existing = true;
  }

  const startIndex = targetContent.indexOf(MARKER_START);
  const endIndex = targetContent.indexOf(MARKER_END);

  let newContent;
  let action;
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    // 替换已有标记区间
    newContent = targetContent.slice(0, startIndex) + section + targetContent.slice(endIndex + MARKER_END.length);
    action = existing ? '更新' : '写入';
  } else if (existing) {
    // 追加到文件末尾
    newContent = targetContent.trimEnd() + '\n' + section;
    action = '追加';
  } else {
    // 新建文件
    newContent = section;
    action = '写入';
  }

  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, newContent, 'utf8');
  console.log(`✅ [${path.basename(targetFile)}] 已${action}到 ${targetFile}`);
  return { ok: true };
}

function installUniversalProject() {
  const sourceFile = path.join(rootDir, 'AGENTS.md');
  const targetFile = path.join(process.cwd(), 'AGENTS.md');
  return mergeAgentsMd(targetFile, sourceFile);
}

function installUniversalGlobal(forceCreate = false) {
  const sourceFile = path.join(rootDir, 'AGENTS.md');
  let installed = 0;
  let skipped = 0;
  let errors = 0;

  for (const agent of UNIVERSAL_AGENTS) {
    const targetFile = resolveUniversalFile(agent);
    if (!forceCreate && !parentExists(targetFile)) {
      console.log(`⏭️  [${agent.label}] 未检测到配置目录，跳过全局 AGENTS.md（可用 --universal-global 配合 --all 强制）`);
      skipped++;
      continue;
    }
    const result = mergeAgentsMd(targetFile, sourceFile);
    if (result.ok) installed++;
    else if (result.error) errors++;
  }

  return { installed, skipped, errors };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    agents: [],
    all: false,
    project: false,
    universal: false,
    universalGlobal: false,
    list: false,
    help: false,
    errors: [],
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--agent' || arg === '-a') {
      const value = args[++i];
      if (!value || value.startsWith('-')) {
        options.errors.push(`${arg} 需要提供 Agent 名称`);
        if (value && value.startsWith('-')) i--;
      } else {
        options.agents.push(value);
      }
    } else if (arg === '--all') {
      options.all = true;
    } else if (arg === '--project') {
      options.project = true;
    } else if (arg === '--universal') {
      options.universal = true;
    } else if (arg === '--universal-global') {
      options.universalGlobal = true;
    } else if (arg === '--list') {
      options.list = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      options.errors.push(`未知参数：${arg}`);
    }
  }
  return options;
}

function printHelp() {
  console.log(`
${skillName} 多 Agent 安装器

用法：
  npx ${skillName} [选项]

选项：
  --agent, -a <name>   仅安装指定 Agent（可多次使用）
  --all                普通安装时为所有已知 Agent 创建目录并安装；与 --universal-global 组合时强制写入全局 AGENTS.md
  --project            将 Cursor/Windsurf/Cline 规则复制到当前项目目录
  --universal          将 AGENTS.md 合并到当前项目目录（跨 Agent 通用规则）
  --universal-global   将 AGENTS.md 合并到支持 AGENTS.md 的 Agent 全局配置
  --list               列出支持的 Agent
  --help, -h           显示本帮助

环境变量（用于覆盖默认路径）：
  CLAUDE_SKILLS_DIR、CODEX_SKILLS_DIR、OPENCODE_SKILLS_DIR、
  MIMOCODE_SKILLS_DIR、GOOSE_SKILLS_DIR、HERMES_SKILLS_DIR、
  OPENCLAW_SKILLS_DIR、CURSOR_RULES_DIR、WINDSURF_RULES_DIR、
  CLINE_RULES_DIR、AIDER_INSTRUCTIONS_DIR、GEMINI_SKILLS_DIR、
  CODEX_AGENTS_MD、OPENCODE_AGENTS_MD、MIMOCODE_AGENTS_MD、
  HERMES_AGENTS_MD、OPENCLAW_AGENTS_MD
`);
}

function printList() {
  console.log('支持的 Agent（专用格式）：');
  for (const agent of SUPPORTED_AGENTS) {
    const dir = resolveDir(agent);
    console.log(`  - ${agent.name.padEnd(10)} ${agent.label}`);
    const target = dir ? `${dir}${agent.fileName ? path.sep + agent.fileName : ''}` : '（需通过环境变量指定）';
    console.log(`    默认目标：${target}`);
    console.log(`    环境变量：${agent.env}`);
  }
  console.log('\n支持 AGENTS.md 通用规则的 Agent：');
  for (const agent of UNIVERSAL_AGENTS) {
    const file = resolveUniversalFile(agent);
    console.log(`  - ${agent.name.padEnd(10)} ${agent.label}`);
    console.log(`    默认目标：${file}`);
    console.log(`    环境变量：${agent.env}`);
  }
}

function main() {
  const options = parseArgs();

  if (options.errors.length > 0) {
    for (const error of options.errors) {
      console.error(`❌ ${error}`);
    }
    console.error(`使用 --help 查看用法`);
    process.exit(1);
  }

  if (options.help) {
    printHelp();
    return;
  }

  if (options.list) {
    printList();
    return;
  }

  console.log(`[${skillName}] 开始安装...\n`);

  // universal 模式
  if (options.universal || options.universalGlobal) {
    let installed = 0;
    let skipped = 0;
    let errors = 0;

    if (options.universal) {
      const result = installUniversalProject();
      if (result.ok) installed++;
      else if (result.error) errors++;
    }

    if (options.universalGlobal) {
      const globalResult = installUniversalGlobal(options.all);
      installed += globalResult.installed;
      skipped += globalResult.skipped;
      errors += globalResult.errors;
    }

    console.log(`\n[${skillName}] universal 安装汇总：成功 ${installed}，跳过 ${skipped}，失败 ${errors}`);
    if (errors > 0) process.exit(1);
    if (installed > 0) {
      console.log(`[${skillName}] 提示：重启对应 Agent 后规则将生效`);
    }
    return;
  }

  // 项目级安装（仅 Cursor / Windsurf / Cline）
  if (options.project) {
    for (const agent of SUPPORTED_AGENTS) {
      if (agent.projectDir) {
        installAgent(agent, agent.projectDir, true);
      }
    }
    console.log(`\n[${skillName}] 项目级规则安装完成`);
    return;
  }

  let agentsToInstall = [];
  if (options.all) {
    agentsToInstall = SUPPORTED_AGENTS;
  } else if (options.agents.length > 0) {
    for (const name of options.agents) {
      const agent = SUPPORTED_AGENTS.find(a => a.name === name);
      if (!agent) {
        console.error(`❌ 不支持的 Agent：${name}，使用 --list 查看列表`);
        process.exit(1);
      }
      agentsToInstall.push(agent);
    }
  } else {
    agentsToInstall = SUPPORTED_AGENTS.filter(shouldAutoInstall);
  }

  if (agentsToInstall.length === 0) {
    console.log('未检测到已安装的 Agent，也未指定 --agent/--all。');
    console.log('可用命令：');
    console.log(`  npx ${skillName} --all           # 为所有已知 Agent 安装`);
    console.log(`  npx ${skillName} --agent claude  # 仅安装到 Claude Code`);
    console.log(`  npx ${skillName} --universal     # 在当前项目创建 AGENTS.md`);
    console.log(`  npx ${skillName} --list          # 查看支持的 Agent`);
    return;
  }

  let installed = 0;
  let skipped = 0;
  let errors = 0;
  const explicitlyRequested = options.agents.length > 0;
  for (const agent of agentsToInstall) {
    const result = installAgent(agent, null, options.all || explicitlyRequested, explicitlyRequested);
    if (result.ok) installed++;
    else if (result.skipped) skipped++;
    else if (result.error) errors++;
  }

  console.log(`\n[${skillName}] 安装汇总：成功 ${installed}，跳过 ${skipped}，失败 ${errors}`);
  if (errors > 0) process.exit(1);
  if (installed > 0) {
    console.log(`[${skillName}] 提示：重启对应 Agent 后规则将生效`);
  }
}

main();
