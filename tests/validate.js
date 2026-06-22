const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/**
 * 校验脚本：检查项目结构、SKILL.md frontmatter、package.json
 * 与 bin/install.js 中的多 Agent 映射一致性
 */

const root = path.join(__dirname, '..');
const skillFile = path.join(root, 'SKILL.md');
const agentsFile = path.join(root, 'AGENTS.md');
const readmeFile = path.join(root, 'README.md');
const readmeEnFile = path.join(root, 'README_EN.md');
const packageFile = path.join(root, 'package.json');
const packageLockFile = path.join(root, 'package-lock.json');
const installFile = path.join(root, 'bin', 'install.js');
const rulesDir = path.join(root, 'rules');
const editorConfigFile = path.join(root, '.editorconfig');
const changelogFile = path.join(root, 'CHANGELOG.md');
const contributingFile = path.join(root, 'CONTRIBUTING.md');
const securityFile = path.join(root, 'SECURITY.md');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

function parseSimpleYaml(text) {
  const result = {};
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) {
      let value = m[2].trim();
      if (value === '>' || value === '|') {
        const blockStyle = value;
        const parts = [];
        i++;
        while (i < lines.length) {
          const blockLine = lines[i];
          if (/^([A-Za-z_][\w-]*):\s*/.test(blockLine)) {
            i--;
            break;
          }
          if (/^\s*$/.test(blockLine)) {
            parts.push('');
          } else if (/^\s+/.test(blockLine)) {
            parts.push(blockLine.trim());
          } else {
            i--;
            break;
          }
          i++;
        }
        value = blockStyle === '>' ? parts.filter(Boolean).join(' ') : parts.join('\n').trim();
      } else if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      result[m[1]] = value;
    }
  }
  return result;
}

function hasUtf8Bom(file) {
  const bytes = fs.readFileSync(file);
  return bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
}

function main() {
  // 1. 核心文件存在
  assert(fs.existsSync(skillFile), 'SKILL.md 存在');
  assert(fs.existsSync(agentsFile), 'AGENTS.md 存在');
  assert(fs.existsSync(readmeFile), 'README.md 存在');
  assert(fs.existsSync(readmeEnFile), 'README_EN.md 存在');
  assert(fs.existsSync(packageFile), 'package.json 存在');
  assert(fs.existsSync(packageLockFile), 'package-lock.json 存在');
  assert(fs.existsSync(installFile), 'bin/install.js 存在');
  assert(fs.existsSync(rulesDir), 'rules/ 目录存在');
  assert(fs.existsSync(editorConfigFile), '.editorconfig 存在');
  assert(fs.existsSync(changelogFile), 'CHANGELOG.md 存在');
  assert(fs.existsSync(contributingFile), 'CONTRIBUTING.md 存在');
  assert(fs.existsSync(securityFile), 'SECURITY.md 存在');

  const noBomFiles = [
    skillFile,
    agentsFile,
    readmeFile,
    readmeEnFile,
    packageFile,
    installFile,
    editorConfigFile,
    changelogFile,
    contributingFile,
    securityFile,
  ];
  for (const file of noBomFiles) {
    assert(!hasUtf8Bom(file), `${path.relative(root, file)} 不包含 UTF-8 BOM`);
  }

  // 2. 解析 SKILL.md frontmatter
  const skillContent = fs.readFileSync(skillFile, 'utf8');
  const match = skillContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert(match, 'SKILL.md 包含 YAML frontmatter');

  const frontmatter = parseSimpleYaml(match[1]);
  assert(frontmatter.name, `SKILL.md frontmatter 包含 name（当前值：${frontmatter.name}）`);
  assert(frontmatter.description, 'SKILL.md frontmatter 包含 description');
  const frontmatterKeys = Object.keys(frontmatter).sort();
  assert(
    frontmatterKeys.length === 2 && frontmatterKeys.includes('name') && frontmatterKeys.includes('description'),
    `SKILL.md frontmatter 仅包含 name 与 description（当前字段：${frontmatterKeys.join(', ')}）`
  );
  assert(frontmatter.description.length > 50, 'SKILL.md description 包含可用于触发的完整描述');
  assert(frontmatter.description.includes('踩坑记录') && frontmatter.description.includes('Lessons Learned'), 'SKILL.md description 包含关键触发词');

  // 3. package.json 一致性
  const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  assert(pkg.name === frontmatter.name, `package.json name（${pkg.name}）与 SKILL.md name（${frontmatter.name}）一致`);
  assert(pkg.bin && pkg.bin[pkg.name], 'package.json bin 字段包含与包名同名的入口');
  assert(pkg.bin[pkg.name] === 'bin/install.js', 'package.json bin 入口使用 npm 规范路径 bin/install.js');
  assert(pkg.scripts && pkg.scripts.validate === 'npm test', 'package.json 包含 validate 脚本并委托 npm test');
  assert(pkg.files && pkg.files.includes('SKILL.md'), 'package.json files 包含 SKILL.md');
  assert(pkg.files && pkg.files.includes('AGENTS.md'), 'package.json files 包含 AGENTS.md');
  assert(pkg.files && pkg.files.includes('README.md'), 'package.json files 包含 README.md');
  assert(pkg.files && pkg.files.includes('README_EN.md'), 'package.json files 包含 README_EN.md');
  assert(pkg.files && pkg.files.includes('rules/'), 'package.json files 包含 rules/');
  assert(!pkg.scripts || !pkg.scripts.postinstall, 'package.json 未配置 postinstall 自动安装脚本');

  // 4. 安装脚本一致性
  const installContent = fs.readFileSync(installFile, 'utf8');
  assert(installContent.includes(`'${frontmatter.name}'`), `bin/install.js 引用了 skill 名称 ${frontmatter.name}`);
  assert(installContent.includes('SUPPORTED_AGENTS'), 'bin/install.js 定义了 SUPPORTED_AGENTS 映射');
  assert(installContent.includes('UNIVERSAL_AGENTS'), 'bin/install.js 定义了 UNIVERSAL_AGENTS 映射');
  assert(installContent.includes('--universal'), 'bin/install.js 支持 --universal 参数');
  assert(installContent.includes('--universal-global'), 'bin/install.js 支持 --universal-global 参数');
  assert(installContent.includes('mergeAgentsMd'), 'bin/install.js 实现了 AGENTS.md 安全合并函数');
  assert(installContent.includes('lessons-evolve universal start'), 'bin/install.js 使用标记实现幂等更新');
  assert(installContent.includes('copyFileSync'), 'bin/install.js 使用 copyFileSync 复制文件');
  assert(installContent.includes('未知参数'), 'bin/install.js 会提示未知参数');

  const unknownArgResult = spawnSync(process.execPath, [installFile, '--unknown-option'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert(unknownArgResult.status !== 0, 'bin/install.js 遇到未知参数会失败退出');

  const missingAgentResult = spawnSync(process.execPath, [installFile, '--agent'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert(missingAgentResult.status !== 0, 'bin/install.js 遇到缺少 Agent 名称会失败退出');

  // 5. 解析 install.js 中的 SUPPORTED_AGENTS（简单正则提取数组内容，再 eval 前校验）
  // 由于 install.js 是 Node 脚本，直接用 require 执行会触发安装逻辑；这里用正则检查关键项
  const requiredAgents = ['claude', 'codex', 'opencode', 'mimocode', 'goose', 'hermes', 'openclaw', 'cursor', 'windsurf', 'cline', 'aider', 'gemini'];
  for (const agent of requiredAgents) {
    assert(installContent.includes(`name: '${agent}'`) || installContent.includes(`name: "${agent}"`), `bin/install.js 包含 Agent：${agent}`);
  }

  // 6. rules/ 下源文件存在
  const requiredRules = ['cursor.mdc', 'windsurf.md', 'cline.md', 'aider-instructions.md', 'gemini.md'];
  for (const file of requiredRules) {
    assert(fs.existsSync(path.join(rulesDir, file)), `rules/${file} 存在`);
  }

  // 7. 通用规则与项目级规则不得落后于 SKILL.md 的闭环语义
  const ruleFiles = [
    agentsFile,
    path.join(rulesDir, 'cursor.mdc'),
    path.join(rulesDir, 'windsurf.md'),
    path.join(rulesDir, 'cline.md'),
    path.join(rulesDir, 'aider-instructions.md'),
  ];
  for (const file of ruleFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    assert(content.includes('严格限定'), `${rel} 包含严格触发限定`);
    assert(content.includes('.lessons-evolve/lessons.yaml'), `${rel} 包含本地降级存储路径`);
    assert(content.includes('通知必输出'), `${rel} 包含通知必输出要求`);
    assert(!content.includes('自动完成，不打扰用户'), `${rel} 不包含旧版静默记录表述`);
  }

  // 8. README 中英文版本保持可互相跳转
  const readmeContent = fs.readFileSync(readmeFile, 'utf8');
  const readmeEnContent = fs.readFileSync(readmeEnFile, 'utf8');
  assert(readmeContent.includes('[English](README_EN.md)'), 'README.md 包含英文版跳转链接');
  assert(readmeEnContent.includes('[简体中文](README.md)'), 'README_EN.md 包含中文版跳转链接');

  console.log('\n🎉 所有校验通过');
}

main();
