# glcode-l10n

Translation of all Scratch projects is managed on the Transifex service: https://www.transifex.com/llk/public

This repository collects translations submitted to the Scratch projects on Transifex. **Please do not submit PRs. If you would like to contribute translations, please sign up to translate on Transifex.**

#### Basic Use

该项目是 fork 了 scratch-l10n，是 scratch 项目中用于添加修改文本(多语言 18n)的项目，目前 glcode 仅保留了中文，台湾，英语 3 种语言。
修改 glcode 中的文本的方式是在
editor\interface\zh-tw.json
editor\interface\en.json
editor\interface\zh-cn.json
这三个文件中修改对应的 key:value 之后，在本项目 glcode-18n 项目 npm run build 之后，将 editor,locales,src 三个文件夹复制粘贴到 glcode 项目中的 scripts/new_node_modules/scratch-l10n 路径下，再在 glcode 项目中执行 change-modules 命令/npm run start，start 命令包含了 change-modules

#### Useful Scripts

scratch-l10n provides:

- `build-i18n-src`: script that uses babel and plugins to extract all `FormattedMessage` strings for translation. Combines the message from all the source files into one `en.json`
- `tx-push-src`: script to push the `en.json` file to Transifex. Requires that the environment variable `TX_TOKEN` is set with a value that has developer access to the Scratch projects on Transifex (i.e. Scratch Team only)

#### Versioning

scratch-l10n uses semantic versioning - breaking changes will increment the major version number, and new features (e.g. a new language) will increment the minor version number. However, the patch number is actually a datetime string. That way it's easy to see how recently the translations were updated.

In general, changes that require a PR (new functionality, new language) should increment the minor version. Pulling new translations from Transifex is automated and will commit to master directly.

#### Deprecations

We are moving away from using the `tx` cli, so the `.tx/config` file will eventually be deprecated.
