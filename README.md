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

List your script files with their id's. You can add a string to filter on.

```
$ gas list [nameFilter]
```

Go to an empty folder and clone a project by specifying the file id. (see 'list' to find a specific file id)

```
$ gas clone <fileId>
```

When you have made some changes in the online editor you can pull them.

```
$ gas pull
```

When you have made some local changes you can deploy them.

```
$ gas deploy
```



<br><br>
<br>
That's all (so far)
