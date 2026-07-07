# 23 Solo Game Adaptation 单机适配

访问日期：2026-07-06

验证状态：source-backed draft

## 适配目标

- 保持 12 名普通玩家的公开社会推理结构。
- 真人只拥有一个玩家视角，不读取说书人真相。
- 自动说书人执行规则、裁量和信息投影。
- AI 玩家通过合法视图推理、撒谎、私聊、提名和投票。

## 用户体验边界

- 本阶段不设计 UI。
- 本阶段不实现 AI。
- 本阶段只定义信息隔离、流程、状态和审计需求。

## 关键需求

- 固定随机种子保证复盘。
- 存档记录 canonical truth，但运行中只投影合法视图。
- 真相复盘必须显示角色历史、阵营历史、裁量记录和信息真值。
- 回放需要能重建公开时间线和每名玩家当时的认知状态。

## 来源

- Official Rules Explanation: https://wiki.bloodontheclocktower.com/Rules_Explanation
