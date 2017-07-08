<img src="https://raw.githubusercontent.com/MaartenDesnouck/google-apps-script/master/images/logo/gas-logo.png" alt="gas logo" title="gas" align="right" height="96" width="96"/>

# gas, for locally developing Google Apps Script projects


[![Codacy Badge](https://api.codacy.com/project/badge/Grade/fe9e115d56ab4dada6c22c804d5f2db9)](https://www.codacy.com/app/MaartenDesnouck/google-apps-script?utm_source=github.com&utm_medium=referral&utm_content=MaartenDesnouck/google-apps-script&utm_campaign=badger)
[![GitHub stars](https://img.shields.io/github/stars/MaartenDesnouck/google-apps-script.svg?style=social&label=Star)](https://github.com/MaartenDesnouck/google-apps-script)
[![NPM Downloads](https://img.shields.io/npm/dt/google-apps-script.svg?style=flat)](https://www.npmjs.org/package/google-apps-script)
[![Known Vulnerabilities](https://snyk.io/test/npm/google-apps-script/badge.svg?style=flat)](https://snyk.io/test/npm/google-apps-script)
[![Gemnasium](https://img.shields.io/gemnasium/MaartenDesnouck/google-apps-script.svg)](https://gemnasium.com/github.com/MaartenDesnouck/google-apps-script)

# Installation

```
$ npm i -g google-apps-script
```

# Usage

Authenticate the Drive API (add '-f' to force reauthentication):

```
$ gas auth [-f]
```

Create, delete or rename a project in your Google Drive:

```
$ gas create <name>
$ gas delete <fileName|fileId>
$ gas rename <fileName|fileId> <newName>
```

List your remote projects and their fileId's (optional filter on filename):

```
$ gas list [nameFilter]
```

Link a remote project to your current directory:

```
$ gas link <fileName|fileId>
```

Pull and push code from/to your remote project:
(We map files in local folders to their full path name in a project and the other way around)

```
$ gas pull
$ gas push
```

Some shortcuts for creating, linking and pulling projects all in one:

```
$ gas clone <fileName|fileId>
$ gas new <name>
```

Open the linked project or a specified project in the online editor:

```
$ gas open [fileName|fileId]
```

Get info about the linked project or a specified project:

````
$ gas info [fileName|fileId]
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
