# Refactor unused code (PHP)

**Motivation**

Ever found yourself migrating code from a project to another just to find out that some functions are not being used anymore? Or maybe you just want to clean up your code and remove some unused functions?

Well, this extension will help you to find out which functions are not being used anymore and help you to remove them.

## Features

**This extension will help you to remove unused code from your PHP project.**

1. Open the file you want to refactor
1. Press `Ctrl+Shift+P` or `Cmd+Shift+P` to open the command palette
1. Type `Show Unused Functions (this file)` 
1. Wait for the search to be completed
1. A `result.md` file will be created with the names of the functions that are found unused

**How it works?**

- The extension will search for all the functions in the file
- Then it will search on your workspace for the functions found
  - Since we're refactoring a PHP file, chances are that the function is called from another PHP file (or itself) OR from a HTML/JS file on an ajax call.
  - Given that, this extension will search the function usage on:
    - PHP files
    - HTML files
    - JS/JSX/TS files
- The output will be a `result.md` file with the functions found unused

## Extension Settings

As of now, no settings are available. But do notice that the extension will ignore some known folders in order to optimize the search:

- vendor
- node_modules
- libs
- dist
- writable

On the future I may add a setting to allow you to add your own folders to ignore.

## Donations are appreciated

- [PayPal](https://www.paypal.com/donate/?business=Z6YGYAFD932HE&no_recurring=0&item_name=Support+to+evolve+the+VS+Code+extension+%22Refactor+Unused+Code%22.&currency_code=BRL)


## Future goals

- [ ] Add support to setup "ignore list" settings
- [ ] Add support to setup "extension list" settings
- [ ] Add support to find unused functions within a folder
- [ ] Add support to other languages

## Release Notes

### 1.0.0

Initial release of PHP Refactor unused code.
