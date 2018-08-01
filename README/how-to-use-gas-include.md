<img src="../images/logo/gas-logo.png" alt="gas logo" name="gas" align="right" height="96" width="96"/>

# How to use gas-include, from A to Z

## What is it

Gas-include is a public package repository for Google Apps Script code.
Together with the 'gas include' command it allows for easy reuse of Google Apps Script code.

## How to use a package

E.g. usage of the 'sheet' package.

```
$ gas include -s sheet
```
This will add the latest version of the 'sheet' package to your gas-include.json file prefixed with a caret (^) and will then recalculate your gas-include folder according to semver rules.

Now you can use the methods of the package by prefixing them with the package name.   
So in case of 'sheet':   
- sheet_getValue(row, column, sheet)   
- sheet_setValue(row, column, sheet, value)

Available packages right now are:
 - [time](https://github.com/MaartenDesnouck/gas-include-time/blob/master/time.js)
 - [sheet](https://github.com/MaartenDesnouck/gas-include-sheet)


## How to publish a package to gas-include

Create a gas-include.json. Gas init can help you with that.
```
$ gas init
```
When your gas-include.json is ready you simply execute:
```
$ gas publish
```
