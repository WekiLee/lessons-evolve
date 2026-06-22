# Gemini CLI 适配说明

由于 Gemini CLI 的技能/规则目录尚未在公开文档中明确，本 skill 提供以下两种使用方式：

1. **环境变量方式（推荐）**

   设置 `GEMINI_SKILLS_DIR` 指向 Gemini 识别的 skills 父目录，然后运行：

   ```bash
   npx lessons-evolve --agent gemini
   ```

   安装脚本会将 `SKILL.md` 复制到 `$GEMINI_SKILLS_DIR/lessons-evolve/SKILL.md`。

2. **手动复制**

   如果已知 Gemini CLI 加载自定义指令的文件位置，可直接将仓库根目录的 `SKILL.md` 或 `rules/gemini.md` 复制到对应位置。

> 注意：当 Gemini CLI 官方规范明确后，欢迎提交 PR 更新 `bin/install.js` 中的默认路径。
