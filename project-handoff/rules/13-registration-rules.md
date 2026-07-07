# 13 Registration Rules 登记规则

访问日期：2026-07-06

验证状态：source-backed draft

## 建模原则

- 登记是检查时投影，不是永久改变真实角色或真实阵营。
- 登记可影响信息能力、目标合法性、角色类型判断和阵营判断。
- 登记不授予被登记角色的能力。
- 登记通常由说书人在合法范围内选择，需记录每次选择。

## 字段草案

```text
RegistrationCheck(checkId, sourceAbility, targetPlayer, context,
  actualCharacter, actualAlignment, registeredCharacter,
  registeredAlignment, registeredType, storytellerChoice, ruleBasis)
```

## 与本阶段相关的检查

- 涡流要求镇民能力信息为假，需要先判定信息是否来自镇民能力。
- 诺-达鲺和亡骨魔的相邻镇民中毒需要按角色类型投影判断。
- 镜像双子、舞蛇人、方古、麻脸巫婆等改变真实角色或阵营，不能用登记代替。

## 待验证

- 梦殒春宵 25 个常规角色本身涉及的登记规则较少；跨剧本扩展需补充隐士、间谍等典型登记角色。

## 来源

- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
