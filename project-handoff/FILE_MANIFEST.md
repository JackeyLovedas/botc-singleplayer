# File Manifest

说明：`FILE_MANIFEST.md` 和最终 ZIP 都存在自引用哈希问题，无法在不改变目标哈希的情况下把自身最终 SHA-256 写入自身。本清单记录除自身以外的交接包文件真实 SHA-256；最终 ZIP 的真实 SHA-256 写入同级 `botc-singleplayer-project-handoff-v1.sha256`，并在最终报告中列出。

ZIP SHA-256 记录位置：打包后生成：outputs/botc-singleplayer-project-handoff-v1.sha256

| relativePath | fileSize | lineCount | SHA256 | purpose | sourceVersion | requiredForNewProject |
| --- | --- | --- | --- | --- | --- | --- |
| 00-README-FIRST.md | 1132 | 40 | c563a4f3c9abfd7bc0081e70d4afe22ae60ccccbd57e2b5355df5742a0157163 | 新项目首读入口 | Phase One v2.1 | Yes |
| ARCHITECTURE_INPUT.md | 1942 | 99 | 3335321479520217c8c80b5c6b7befc2672092c979b463eac407df91f1ee8a6f | 第二阶段架构输入 | Phase One v2.1 | Yes |
| archives/phase-one-research-package-v2.zip | 62996 | 0 | 33dd4c90e3d5527f31e0a3c7c199a9698e697f5be6ea9fce373f17454a0d5e85 | 阶段归档材料 | Phase One v2.1 | Yes |
| archives/phase-one-research-report-v2.md | 2805 | 75 | 470a447b58bc64930ff9e38652a91f8a3648e0fbd0f93a58ff1fe8746d5bce7c | 阶段归档材料 | Phase One v2.1 | Yes |
| archives/phase-one-status-v2.1.md | 2506 | 57 | cf9591d79427ac203e49387fbd5a1a6cdd96d63359adbc1ddcb2bf10cc52ad99 | 阶段归档材料 | Phase One v2.1 | Yes |
| archives/phase-one-v2.1-patch.zip | 35624 | 0 | 27d492c4b53764bfd10d7b2472a1586cb5e12e4f0c7468279b9e427d9c2c95b8 | 阶段归档材料 | Phase One v2.1 | Yes |
| DEVELOPMENT_ROADMAP.md | 2806 | 20 | 9cba97404e76642c9efecb4f73e8b4dcc70c2c5c4c7ee6e204d3774a7f8a9d73 | 后续阶段路线图 | Phase One v2.1 | Yes |
| DOMAIN_GLOSSARY.md | 3210 | 32 | 877c47af95e0b690057a3cb39e42f3e2a80c951564d964733b0172eb4941d42e | 领域术语表 | Phase One v2.1 | Yes |
| IMPLEMENTATION_GUARDRAILS.md | 1179 | 22 | ce368e49a93d5d3cf0d5da6d9257825885c27f51d2a3d95847376a5f6a693bbf | 实现约束 | Phase One v2.1 | Yes |
| NEW_PROJECT_AGENTS.md | 1575 | 41 | aaf1944878ecdb0f92c6594d90c59ac3a826888762503e7e22adc58b8ae176b0 | 新项目 AGENTS.md 草案 | Phase One v2.1 | Yes |
| OPEN_RISKS.md | 2430 | 16 | c6f412e297a3714a88c21e0dcf3bfce9a0335ca9946e63419623ea6c836ec47e | 剩余风险清单 | Phase One v2.1 | Yes |
| PRODUCT_SCOPE.md | 947 | 58 | 41b487b72bb367e2984aaa0dd8bf5f2f9d187c0c6e772f65e8b310597fc1fccd | 第一版产品范围 | Phase One v2.1 | Yes |
| PROJECT_HANDOFF.md | 2168 | 77 | e42bb75bde00b3995a57e91d172f5f2d47ed41449f58671b4fdcab59ed752399 | 项目上下文总览 | Phase One v2.1 | Yes |
| rules/02-core-rules.md | 2780 | 35 | 8f8662c9d24908b95b0df672a2d9d6c6ab6c56341eefb7473d8ce598493b91fc | 规则基线文件 | Phase One v2.1 | Yes |
| rules/03-game-flow.md | 3205 | 37 | f64174fea1b5aecdd66302c1ddd42402ba0f8fea816709235425003a7d39a66f | 规则基线文件 | Phase One v2.1 | Yes |
| rules/04-terminology.md | 2767 | 45 | 271a4ea8deb82ef6d8cda71de82855cd5d02822ac4fb7d966502f47af92c68b4 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/05-script-setup-assignment.md | 1485 | 39 | b60f58d375ed38fe9c6905bf64240e73190750d73cb2e5c2b08954685e88cad6 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/06-custom-script.md | 2198 | 37 | 58eae10d7f5534a5e25e637d1f543232df94706fffc4bfd6290698454294be6d | 规则基线文件 | Phase One v2.1 | Yes |
| rules/07-twelve-player-setup.md | 1373 | 47 | 9fbff85c6be704d02b48cc953a8a2837b0e0f657695be612958eae51695bb52c | 规则基线文件 | Phase One v2.1 | Yes |
| rules/08-setup-generator.md | 1356 | 50 | 3e8471165716181be4e83e8fb4b1ca427ddab0f19b167dc65e973e44b2755bae | 规则基线文件 | Phase One v2.1 | Yes |
| rules/09-nomination-voting-execution.md | 1931 | 39 | faa76f97740a712b09c74e970fddc26c374de583f70b33929efc7e8dac65d2e5 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/10-night-order.md | 13018 | 51 | 6027b72807efc622e4e500530fc008e7c80789e80b0eb996e4d910518842acf3 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/11-drunk-and-poison.md | 2282 | 47 | ea5883e39e3d7a0f7812dceb68b8b0365b4fa76401514f26810961fbd688338b | 规则基线文件 | Phase One v2.1 | Yes |
| rules/12-information-model.md | 1697 | 44 | f2077cbfc2e44ccd9de53d4ac92c11579db78ea9ac96a2d285a8794e6ab130d3 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/13-registration-rules.md | 1202 | 35 | b712ee255e5a69b6b72323eae33266bb6672bf4f3fb7a382959c8c99213c2576 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/14-madness-system.md | 2491 | 52 | b3036562323e3c0da7d0162a41950f4884c420ca8ebdfc3969305c29205f81ea | 规则基线文件 | Phase One v2.1 | Yes |
| rules/15-character-and-alignment-changes.md | 1701 | 35 | 18807a1c8dafa572938422e9db22210a9bfc6666eb34c24da18e033c8a7ea2b1 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/16-storyteller-decisions.md | 1467 | 36 | 784635917fba43465cc19575d9fa917bdf72eaa4287d590a5cee4e3674b24ff7 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/17-character-data-model.md | 1682 | 74 | d5aad70e6b67af4220c4e63b32b99c4e7ba83df8fb1f0d2f103e4ce70984f8f1 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/18-sects-and-violets-roles.md | 28129 | 489 | 07dd8704cb2b3fddb0258740f0e1fb295928f43d82d0061f8f555fa2820df30b | 规则基线文件 | Phase One v2.1 | Yes |
| rules/19-sects-and-violets-demons.md | 5484 | 98 | 89108d42e4b5feb479de98d23862e5e914116c38f42025c01aeb2d8a135ed864 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/20-character-interactions.md | 1456 | 16 | 5817a3c6582cbc35867441b36c785bc1a46a5322526b4958f440aa3d7f05ba12 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/21-special-win-conditions.md | 1511 | 18 | d8e03fb0bf76a02cfc6acd10fecdbb43ae05ade441243875aa8e48749e97e8d8 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/22-twelve-player-ai-model.md | 1237 | 43 | 68dc3dc2eb654e54c90a3ba9928a0a5d50144c955cf2b8e576d99130b0e6b5fd | 规则基线文件 | Phase One v2.1 | Yes |
| rules/23-solo-game-adaptation.md | 939 | 30 | add4e4f5edc307947fb980b0d21de5d97f02a917d68ac889bbafad4fc2e1b33b | 规则基线文件 | Phase One v2.1 | Yes |
| rules/24-rule-priority.md | 1902 | 39 | c4eb9de26c59a92c934fb2b2bf4f84d53177a386f1690f342b2bf0589c2c943a | 规则基线文件 | Phase One v2.1 | Yes |
| rules/26-open-questions.md | 1019 | 20 | 786fceefc1c7429b0a9400281402e085f743d474d1cc7b5447035a60ad20d5f1 | 规则基线文件 | Phase One v2.1 | Yes |
| rules/30-v2.1-defect-resolution.md | 1615 | 18 | 6e63766e1740c72c1d5082b8e0ac191c9a348aa2687c521d34d698ccca9824a3 | 规则基线文件 | Phase One v2.1 | Yes |
| RULES_BASELINE.md | 9143 | 81 | 52e962af35561a8a7e658217569f141c9637d9cea044f805eee6ce7a31aaf835 | 规则基线和角色状态 | Phase One v2.1 | Yes |
| SOURCE_INDEX.md | 6464 | 50 | ba2eba3729170881808ca1440d82c90b1816a67813ad7ac50abe9d3ebb79c0a5 | 来源索引 | Phase One v2.1 | Yes |
| TEST_COVERAGE_SUMMARY.md | 2475 | 53 | d41bdcdd210aca1cedad4e7eceeba855f1b60bb18a76ae6e68e28d8f8ab8cb7f | 测试覆盖摘要 | Phase One v2.1 | Yes |
| tests/25-rule-test-cases.md | 69820 | 1530 | 784e261d096c649f8882192c315d711c097bba25bb0d7d9c7a425f234c9c4491 | 规则测试或覆盖报告 | Phase One v2.1 | Yes |
| tests/28-test-deduplication-report.md | 693 | 24 | 8e92f6ea97c986e222da1a47406b82f34b84a3ec1a12b830a4cf048b965a9d3e | 规则测试或覆盖报告 | Phase One v2.1 | Yes |
| tests/29-cross-reference-audit.md | 1656 | 17 | 2f8a9565fa7c8676990576d2a3787a20ddd0151ef27c19cbbc60eb561f37813e | 规则测试或覆盖报告 | Phase One v2.1 | Yes |
| tests/31-test-coverage-report.md | 1734 | 36 | a7f59836a43cd143b919c45bfa498facfeb5fa5f5641eeecc974f2c6e44bc997 | 规则测试或覆盖报告 | Phase One v2.1 | Yes |
