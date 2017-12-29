<img src="./images/logo/gas-logo.png" alt="gas logo" title="gas" align="right" height="96" width="96"/>

# gas, for locally developing Google Apps Script projects

[![npm](https://img.shields.io/npm/v/google-apps-script.svg)](https://www.npmjs.com/package/google-apps-script)
[![GitHub stars](https://img.shields.io/github/stars/MaartenDesnouck/google-apps-script.svg?style=social&label=Star)](https://github.com/MaartenDesnouck/google-apps-script)
[![NPM Downloads](https://img.shields.io/npm/dt/google-apps-script.svg?style=flat)](https://www.npmjs.org/package/google-apps-script)
[![Circle CI](https://circleci.com/gh/MaartenDesnouck/google-apps-script.svg?style=shield)](https://circleci.com/gh/MaartenDesnouck/google-apps-script)
[![Known Vulnerabilities](https://snyk.io/test/npm/google-apps-script/badge.svg?style=flat)](https://snyk.io/test/npm/google-apps-script)
[![David](https://img.shields.io/david/MaartenDesnouck/google-apps-script.svg)](https://david-dm.org/MaartenDesnouck/google-apps-script)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/fe9e115d56ab4dada6c22c804d5f2db9)](https://www.codacy.com/app/MaartenDesnouck/google-apps-script/dashboard)

# Installation

```
$ npm i -g google-apps-script
```

# Usage

#### Authenticate the Drive API
 - Add -f to force reauthentication
 - Add -s to show the authentication url instead of opening a webbrowser

```
$ gas auth [-f][-s]
```

#### Setup a new project or clone an existing one

```
$ gas new <projectName>
$ gas clone <projectName|projectId>
```

#### List your remote projects and their ids
- There is an optional filter on projectName

```
$ gas list [filter]
```

#### Pull and push code from/to your remote project
- Files in subfolders are mapped to their relative pathname in a project and the other way around
- You can specify to pull or push a single file by adding a filename to the command
- Delete a single remote file by adding -d to the push command

```
$ gas pull [fileName]
$ gas push [fileName] [-d]
```

#### Create, delete or rename a project in your Google Drive

```
$ gas create <projectName>
$ gas delete <projectName|projectId>
$ gas rename <projectName|projectId> <newProjectName>
```

#### Linking a project to the current working directory
- See the last [example](#examples) for some context

```
$ gas link <projectName|projectId>
```

#### Open the linked project or a specified project in the online editor

```
$ gas open [projectName|projectId]
```

#### Show some info about the linked project or a specified project

````
$ gas show [projectName|projectId]
````

#### Check for differences between your local files and Google Drive

````
$ gas status
````

# Config (optional)

#### Configure gas to use .gs as local extension or to use a custom Google OAuth2 client to do the API requests
- [How to setup a a custom Google OAuth2 client for gas, from A to Z](./README/how-to-setup-oauthclient.md)
- Add -e to export your current config to configFile.json
- Add -i to import a config from configFile.json
- Add -r to reset the config to the default values

```
$ gas config [-e][-i][-r] [configFile.json]
```

# Examples

```
$ gas new myScript
$ cd myScript
$ gas open
```

```
$ gas list
$ gas clone myScript
```

```
$ gas create myScript2
$ mkdir src
$ cd src
$ gas link myScript2
$ gas show
$ gas pull
```

# .gitignore

Gas creates some extra files in a .gas folder. None should be checked into git,
 so a  [.gitignore](https://github.com/MaartenDesnouck/google-apps-script/blob/master/gas.gitignore) file gets added to your project if there isn't one present yet.

<hr>
That's all (so far).

Suggestions or questions?<br>
Tweet me [@MaartenDesnouck](https://twitter.com/MaartenDesnouck) or create an issue on [github](https://github.com/MaartenDesnouck/google-apps-script/issues/new).
