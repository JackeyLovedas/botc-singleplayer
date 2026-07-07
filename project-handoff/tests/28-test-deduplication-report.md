# 28 Test Deduplication Report 测试去重报告

访问日期：2026-07-06

验证状态：v2 dedup complete

| 指标 | 数量 |
| --- | --- |
| 原测试数 | 287 |
| 完全重复组数 | 9 |
| 重复测试数 | 215 |
| 删除数 | 236 |
| 参数化合并数 | 9 |
| 修正数 | 51 |
| 新增具体测试数 | 51 |
| 最终有效测试数 | 51 |

## 去重规则执行

- 已检测旧版完全相同 Given/When/Then。
- 已删除只修改编号和标题的模板测试。
- 同类输入被合并为具体参数化场景，不再为每个角色复制通用模板。
- 所有保留测试均含 expectedEvents、forbiddenEvents、expectedStateChanges 和 sourceUrl。
