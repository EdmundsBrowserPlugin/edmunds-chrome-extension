# Edmunds Chrome Extension

[![Build Status](https://travis-ci.org/EdmundsBrowserPlugin/edmunds-chrome-extension.png?branch=dev)](https://travis-ci.org/EdmundsBrowserPlugin/edmunds-chrome-extension)
[![devDependency Status](https://david-dm.org/EdmundsBrowserPlugin/edmunds-chrome-extension/dev-status.png)](https://david-dm.org/EdmundsBrowserPlugin/edmunds-chrome-extension#info=devDependencies)

## What you need to work with the extension

You need to have installed the latest version of Node.js/npm and git 1.7 or later.

For Windows you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users should install [Homebrew](http://mxcl.github.com/homebrew/). Once Homebrew is installed, run `brew install git` to install git, and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install git and Node.js.

## Cloning the repository

At first, make sure you have permissions to make changes in the main repository then clone a copy of the main git repo by running:

    git clone https://github.com/EdmundsBrowserPlugin/edmunds-chrome-extension.git

If you don't have permissions to make changes, [fork](https://help.github.com/articles/fork-a-repo) the repository and then clone your copy:

    git clone https://github.com/[your_user_name]/edmunds-chrome-extension.git

You can find more details how to push your changes using a pull requests here: [Using Pull Requests](https://help.github.com/articles/using-pull-requests).

## Installing the dependencies

Install the [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli) and [bower](http://bower.io/) packages if you haven't before. These should be done as global installs:

    npm install -g grunt-cli bower

Make sure you have `grunt` and `bower` installed:

    grunt -version
    bower -version

Go to the working directory and install the Node and Bower dependencies:

    cd edmunds-chrome-extension && npm install

## How to load the extension

Chrome gives a quick way of loading up your working directory for testing. Let's do that.

1. Open Chrome and go to the Extensions page (chrome://extensions), and ensure that the Developer mode checkbox in the top right-hand corner is checked.
2. Click the **Load unpacked extension…** button to pop up a file-selection dialog.
3. Navigate to the **../edmunds-chrome-extension/src** and select it.

## Running the tests

Make sure you have the necessary dependencies:

    npm install

Validate js/json files and run the Unit Tests by following:

    npm test

## Tricks and tips

* Start `grunt watch` or just `grunt` to auto-run jshint, jsonlint tasks whenever watched files are added, changed or removed.
* Add `[skip ci]` or `[skip ci]` to the commit message to prevent your push from being built on Travis CI.
