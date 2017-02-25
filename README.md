# gas, the complete CLI for Google Apps Script

[![NPM Version](http://img.shields.io/npm/v/google-apps-script.svg?style=flat)](https://www.npmjs.org/package/google-apps-script) [![NPM Downloads](https://img.shields.io/npm/dm/google-apps-script.svg?style=flat)](https://www.npmjs.org/package/google-apps-script)

# Installation

```
$ npm install google-apps-script
```

# Usage

Start with authenticating the Drive API. (Add '-f' to force reauthentication.)

```
$ gas auth [-f]
```

List your script files and their id's. You can add a string to filter on.

```
$ gas list [nameFilter]
```

Go to a folder and clone a project by specifying the file id. (see 'list' to find a specific file id)

```
$ gas clone <fileId>
```

Go to a folder and create a new project.

```
$ gas new <name>
```

When you have made some local changes you can deploy them.

```
$ gas deploy
```

When you have made some changes using the online editor you can pull them.

```
$ gas pull
```

<br><br>
<br>
That's all (so far)

Suggestions or questions?   
Tweet me [@MaartenDesnouck](https://twitter.com/MaartenDesnouck) or
create an issue on [github](https://github.com/MaartenDesnouck/google-apps-script/issues/new).
