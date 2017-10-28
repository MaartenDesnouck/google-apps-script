<img src="https://raw.githubusercontent.com/MaartenDesnouck/google-apps-script/master/images/logo/gas-logo.png" alt="gas logo" title="gas" align="right" height="96" width="96"/>

# gas, for locally developing Google Apps Script projects

[![npm](https://img.shields.io/npm/v/google-apps-script.svg)](https://www.npmjs.com/package/google-apps-script)
[![GitHub stars](https://img.shields.io/github/stars/MaartenDesnouck/google-apps-script.svg?style=social&label=Star)](https://github.com/MaartenDesnouck/google-apps-script)
[![NPM Downloads](https://img.shields.io/npm/dt/google-apps-script.svg?style=flat)](https://www.npmjs.org/package/google-apps-script)
[![Known Vulnerabilities](https://snyk.io/test/npm/google-apps-script/badge.svg?style=flat)](https://snyk.io/test/npm/google-apps-script)
[![David](https://img.shields.io/david/MaartenDesnouck/google-apps-script.svg)](https://david-dm.org/MaartenDesnouck/google-apps-script)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/fe9e115d56ab4dada6c22c804d5f2db9)](https://www.codacy.com/app/MaartenDesnouck/google-apps-script/dashboard)
# Installation

```
$ npm i -g google-apps-script
```

# Usage

Authenticate the Drive API:   
(Add '-f' to force reauthentication, add '-s' to show the authentication url instead opening a webbrowser)

```
$ gas auth [-f][-s]
```

Create, delete or rename a project in your Google Drive:

```
$ gas create <projectName>
$ gas delete <projectName|projectId>
$ gas rename <projectName|projectId> <newProjectName>
```

List your remote projects and their id's (optional filter on projectName):

```
$ gas list [filter]
```

Link a remote project to your current working directory:

```
$ gas link <projectName|projectId>
```

Pull and push code from/to your remote project:   
(Files in local folders are mapped to their full path name in a project and the other way around)   
(You can specify to pull or push only a single file by adding a filename to the command)

```
$ gas pull [fileName]
$ gas push [fileName]
```

Some shortcuts for creating, linking and pulling projects all in one:

```
$ gas init <name>
$ gas clone <projectName|projectId>
```

Open the linked project or a specified project in the online editor:

```
$ gas open [projectName|projectId]
```

Show some info about the linked project or a specified project:

````
$ gas show [projectName|projectId]
````

Check if there are any differences between your local files and Google Drive:

````
$ gas status
````

There is also the beta feature of including specified external files
```
// Content of gas-include.js
'time.js' - 'https://raw.githubusercontent.com/MaartenDesnouck/google-apps-script-include/master/Time.js'

$ gas include
$ gas push
```

# Examples

```
$ gas init myScript
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
$ gas info
$ gas pull
```

# .gitignore

Gas creates some extra files in a .gas folder of which only 'ID' should be checked into git,   
 so a  [.gitignore](https://github.com/MaartenDesnouck/google-apps-script/blob/master/gas.gitignore) file gets added to your project if there isn't one present yet.

<hr>
That's all (so far).

Suggestions or questions?<br>
Tweet me [@MaartenDesnouck](https://twitter.com/MaartenDesnouck) or create an issue on [github](https://github.com/MaartenDesnouck/google-apps-script/issues/new).
