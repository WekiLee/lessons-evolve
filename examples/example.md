# 使用示例

## 示例 1：开发流程 —— mvn -am 卡死

**第一次（项目 A）**

- AI 自动写 memory：
  ```
  踩坑: mvn -am 在 Mac + JDK17 下解析全量依赖会卡死
  触发: 项目 A 编译时运行 mvn -am
  原因: mvn -am 会递归构建整个仓库，依赖图过大时解析耗时极长
  解决: 改用 mvn -pl <module> -am
  标记: lesson
  ```
- 行为：自动完成，无打扰。

**第二次（项目 B）**

- AI：`第二次遇到 mvn -am 卡死了。要建个规则吗？`
- 用户确认后创建 skill `maven-build-safety`。

**第三次（项目 C）**

- AI：`已稳定拦了 3 次，要不要加到流程的编译检查项？`
- 用户确认后固化到编译质量门禁。

## 示例 2：运维 —— 磁盘告警

- 第一次：某台机器日志没轮转导致磁盘满 → memory lesson。
- 两个月后另一台机器同样告警 → 命中 lesson → 晋升 pattern，创建 skill `disk-monitor-checklist`。
- 第三台机器同样告警 → 晋升 instinct，固化到服务器初始化 SOP。

## 示例 3：写作/研究 —— LLM JSON 输出不稳定

- 第一次：DeepSeek 长上下文 JSON 输出偶尔缺少 closing brace → memory lesson。
- 第二次：类似文章再次遇到 → 晋升 pattern，创建 skill `llm-json-safety`。
- 第三次：固化到通用工具调用流程，每次 parse_json 自动带 fallback 校验。
