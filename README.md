<img src="./images/logo/gas-logo.png" alt="gas logo" name="gas" align="right" height="96" width="96"/>

# gas, the Google Apps Script command-line tool

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

# Getting started

#### Enable the Apps Script API for your account

 - Visit https://script.google.com/home/usersettings and enable the Apps Script API

#### Authenticate the Drive API
 - Add -f to force reauthentication
 - Add -s to show the authentication url instead of opening a webbrowser

```
$ gas auth [-f][-s]
```

# Local development
- Standalone scripts can be referenced by name, container bound script projects must be referenced by projectId. 
- You can find a projectId from the url of a details page in [My Scripts](https://script.google.com/home/my)

#### Setup a new script project or clone an existing one

```
$ gas new <projectName>
$ gas clone <projectName|projectId>
```

#### List your remote standalone script projects and their ids
- There is an optional filter on projectName

```
$ gas get projects [filter]
```

#### Pull and push code from/to your remote script project
- Gas also supports shared scripts, Team Drives and container bound scripts
- Files in subfolders are mapped to their relative pathname in a project and the other way around
- You can specify to pull or push a single file by adding a filename to the command
- Delete a single remote file by adding -d to the push command

```
$ gas pull [fileName]
$ gas push [fileName] [-d]
```

#### Rename a remote script

```
$ gas rename <projectName|projectId> <newProjectName>
```

#### Linking a script to the current working directory
- See the last [example](#examples) for some context

```
$ gas link <projectName|projectId>
```

#### Open the linked or a specified project in the online editor

```
$ gas open [projectName|projectId]
```

#### Show some info about the linked or a specified project

````
$ gas show [projectName|projectId]
````

#### Check for differences between your local and remote project files
````
$ gas status
````

# Including libraries
- [How to use gas-include, from A to Z](./README/how-to-use-gas-include.md)
````
$ gas include
$ gas include -s packageName
````

# Managing projects, versions and deployments

#### Create, delete or get a remote project
- Create will always happen in the root of My Drive (for now)

```
$ gas create project <projectName>
$ gas delete project <projectName|projectId>
$ gas get projects [filter]
```

#### Create or get a version

```
$ gas create version [-d description] [-p projectName|projectId]
$ gas get versions [projectName|projectId]
```

#### Create or get a deployment

```
$ gas create deployment [-d description] [-v versionNumber] [-p projectName|projectId]
$ gas get deployments [projectName|projectId]
```

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
$ gas new myProject
$ cd myProject
$ gas open
```

```
$ gas get projects
$ gas clone myProject
$ cd myProject
```

```
$ gas create myProject2
$ mkdir src
$ cd src
$ gas link myProject2
$ gas show
$ gas pull
```

# .gitignore and .gasignore

Gas creates some extra files in a .gas folder. None should be checked into git,
 so a  [.gitignore](https://github.com/MaartenDesnouck/google-apps-script/blob/master/gas.gitignore) file gets added to your project if there isn't one present yet.

.gasignore has exacly the same purpose and functionality as .gitignore but for the Google Apps Script remote and gets created by default to ignore the node_modules folder.

````
$ cat .gasignore
````

<hr>
That's all (so far).

Suggestions or questions?<br>
Tweet me [@MaartenDesnouck](https://twitter.com/MaartenDesnouck) or create an issue on [github](https://github.com/MaartenDesnouck/google-apps-script/issues/new).
