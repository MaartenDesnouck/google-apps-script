<img src="https://raw.githubusercontent.com/MaartenDesnouck/google-apps-script/master/images/logo/gas-logo.png" alt="gas logo" title="gas" align="right" height="96" width="96"/>

# gas, for locally developing Google Apps Script projects

[![NPM Version](http://img.shields.io/npm/v/google-apps-script.svg?style=flat)](https://www.npmjs.org/package/google-apps-script) [![NPM Downloads](https://img.shields.io/npm/dt/google-apps-script.svg?style=flat)](https://www.npmjs.org/package/google-apps-script)

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

<br>
That's all (so far)

Suggestions or questions?<br>
Tweet me [@MaartenDesnouck](https://twitter.com/MaartenDesnouck) or create an issue on [github](https://github.com/MaartenDesnouck/google-apps-script/issues/new).
