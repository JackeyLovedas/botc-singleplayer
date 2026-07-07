# 24 Rule Priority 规则优先级

访问日期：2026-07-06

验证状态：source-backed draft

| 规则层 | 作用 | 边界 |
| --- | --- | --- |
| 基础规则 | 默认流程、胜利、提名、投票、死亡 | 被角色能力明确打破时让位 |
| 角色能力 | 可改变基础规则 | 需能力有效且来源未被抑制 |
| 配置修正 | 开局前改变类型数量 | 只发生在 setup 阶段 |
| 强制规则 | 必须执行 | 无说书人自由选择 |
| 强制真信息 | 必须为真 | 少见，逐角色验证 |
| 强制假信息 | 必须为假 | 涡流镇民能力信息 |
| 登记 | 检查时投影 | 不改变真实状态 |
| 醉酒 | 能力无效 | 可模拟流程 |
| 中毒 | 能力无效 | 可模拟流程 |
| 疯狂 | 行为约束和惩罚候选 | 不是关键词匹配 |
| 保护 | 阻止死亡或替代死亡 | 仍可能记录攻击尝试 |
| 死亡替代 | 替换死亡结果 | 如方古外来者转化 |
| 角色变化 | 改变 actualCharacter | 保留历史 |
| 阵营变化 | 改变 actualAlignment | 保留记忆 |
| 特殊胜利 | 胜利/失败修正 | 胜利检查时解析 |
| 同时触发 | 收集候选再排序 | 不要按代码顺序偶然决定 |
| 说书人裁量 | 只在合法候选内选择 | 必须记录依据 |

## 示例

- 方古配置修正发生在 setup 阶段；游戏中方古转移是死亡替代和角色/阵营变化，不是重新配板。
- 涡流强制假信息不能被醉酒/中毒的“可真可假”粗暴覆盖；必须共同生成合法候选集合。
- 处决和死亡分离，先记录 execution，再解析 death 是否实际发生。

## 来源

- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
- Official Setup: https://wiki.bloodontheclocktower.com/Setup
- Vortox: https://wiki.bloodontheclocktower.com/Vortox
- Fang Gu: https://wiki.bloodontheclocktower.com/Fang_Gu
