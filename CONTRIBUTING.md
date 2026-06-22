# 贡献指南

感谢关注 Lessons Evolve。提交变更前请先确认改动范围足够小，并能用现有命令验证。

## 本地检查

```bash
npm ci --ignore-scripts
npm test
npm pack --dry-run
```

## 贡献要求

- 文档、注释与说明使用简体中文。
- 不提交密钥、令牌、私有路径或内部链接。
- 修改 CLI 行为时同步更新 `README.md` 与 `tests/validate.js`。
- 新增 Agent 适配时同步更新 `bin/install.js`、`README.md`、`rules/` 和测试校验。
- 保持文件为 UTF-8 与 LF 换行，格式规则见 `.editorconfig`。

## 提交说明

建议使用 Conventional Commits，例如：

```text
feat: 支持新的 Agent 适配
fix: 修复安装脚本参数校验
docs: 更新使用说明
```
