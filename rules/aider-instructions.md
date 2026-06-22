# Aider 适配：Lessons Evolve（经验三级进化）

把一次非显然踩坑记录为 **lesson**，第二次同类问题经用户确认晋升为 **pattern**，第三次验证后经用户确认固化为 **instinct**。

## 触发时机（严格限定）

- 本轮任务出现非显然修正：不是 typo、不是 TDD 预期失败、不是普通编译报错。
- 用户表达重复问题：例如“又遇到了”“上次也这样”“怎么又踩这个坑”。
- 故障恢复、周报/月报、结项复盘后，用户要求沉淀经验。
- 用户主动要求总结踩坑、沉淀规则或检查 lesson。

普通常规步骤、显而易见的配置疏忽、每次任务都有的操作不触发。

## 执行流程

1. 先检查当前 Agent 是否具备长期记忆、历史检索、文件搜索/读取能力。
2. 选择数据通道：长期记忆能力 → 当前项目 `.lessons-evolve/lessons.yaml` → 回复正文。
3. 提取问题的 `symptom`、`root_cause`、`solution`；若不是非显然问题，输出“经验检查完毕，本次无新经验需要记录”。
4. 搜索历史 lesson：优先历史检索；有文件能力时同时搜索 `.lessons-evolve/lessons.yaml`。
5. 判断晋升：
   - 无命中：记录 lesson，并通知证据 ID 与存储位置。
   - 命中 1 次且拒绝计数 `< 2`：询问是否创建 pattern 规则。
   - 命中 2 次以上且拒绝计数 `< 2`：询问是否固化为 instinct。
   - 拒绝计数 `>= 2`：不再提醒同一 lesson 晋升。
6. 通知必输出：说明新增、跳过、拒绝、固化或无变化的结果。

## 同类判定

症状相同、根因相同、解决方案相同，满足任一即视为同类。

## 配置方式

将本文件路径加入 `~/.aider.conf.yml` 的 `read:` 列表：

```yaml
read:
  - ~/.aider-instructions-lessons-evolve.md
```

或在启动 aider 时通过 `--read ~/.aider-instructions-lessons-evolve.md` 加载。
