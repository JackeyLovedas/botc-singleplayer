# 07 Twelve Player Setup 12人配板

访问日期：2026-07-06

验证状态：source-backed draft

## 基础构成

| 玩家数 | 镇民 | 外来者 | 爪牙 | 恶魔 | 总数 |
| --- | --- | --- | --- | --- | --- |
| 12 | 7 | 2 | 2 | 1 | 12 |

## 配置修正

- 方古：`[+1 Outsider]`，建模为增加 1 外来者、减少 1 镇民，最终总数仍为 12。
- 亡骨魔：`[-1 Outsider]`，建模为减少 1 外来者、增加 1 镇民，最终总数仍为 12。
- 如果同局存在多个配置修正，先按规则收集修正，再验证最终类型数量非负且总数为 12。

## 12人生成流程

```text
确定12名场上玩家
-> 建立7/2/2/1基础构成
-> 应用锁定/排除约束
-> 选择候选角色
-> 应用配置修正
-> 重新计算类型数量
-> 生成12个实际入场角色
-> 验证总数与类型
-> 生成恶魔伪装
-> 分配到12个座位
```

## 无解情况

- 锁定角色数量超过类型容量。
- 排除后某类型候选不足。
- 方古/亡骨魔修正导致所需外来者数量无法满足。
- 恶魔伪装候选不足。
- 指定真人角色不在实际配板或被排除。

## 来源

- Official Setup: https://wiki.bloodontheclocktower.com/Setup
- Fang Gu: https://wiki.bloodontheclocktower.com/Fang_Gu
- Vigormortis: https://wiki.bloodontheclocktower.com/Vigormortis
