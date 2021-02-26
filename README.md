<p align="center">
  <a href="https://addons.mozilla.org/en-US/firefox/addon/erp-auto-login-iitkgp/">
    <img src="https://addons.cdn.mozilla.net/user-media/addon_icons/2657/2657362-64.png" alt="ERP Auto Login - IITKGP logo" width="64" height="64">
  </a>
</p>

<h3 align="center">ERP Auto Login - IITKGP</h3>

<p align="center">
  Minimial yet powerful and customizable autologin/autofill extension, for IIT Kharagpur enrolled students.
  <br>
  <a href="https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/issues/new">Report a bug</a>
  ·
  <a href="https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/issues/new">Request feature</a>
  ·
  <a href="https://addons.mozilla.org/en-US/firefox/addon/erp-auto-login-iitkgp/reviews">Feedback</a>
</p>

# ERP Auto Login - IITKGP

Our default branch `master` is the source code to the recent stable release. Want to test beta versions? Head to the [`develop` branch](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/tree/develop) to view the latest updates and features before the official release.

> This extension `never` shares your credentials. It stays locally in your browser itself using the browser API [`storage.local`](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/local) by mozilla.

## Table of contents

-   [Why Us?](#why-us)
-   [Permissions](#permissions-used)
-   [Installation](#installation)
-   [Bugs and feature requests](#bugs-and-feature-requests)
-   [Previous releases](#previous-releases)
-   [Todos](#to-do)
-   [Contributing](#contributing)
-   [Versioning](#versioning)
-   [Creator](#creator)
-   [Thanks](#thanks)
-   [Screenshots](#screenshots)
-   [Copyright and license](#copyright-and-license)

## Status

![Mozilla Add-on](https://img.shields.io/amo/v/%7Bfa21e38a-41b3-4891-8f6b-8ba837e2df65%7D)
![Mozilla Add-on](https://img.shields.io/amo/users/%7Bfa21e38a-41b3-4891-8f6b-8ba837e2df65%7D)
![Mozilla Add-on](https://img.shields.io/amo/dw/%7Bfa21e38a-41b3-4891-8f6b-8ba837e2df65%7D)
![GitHub](https://img.shields.io/github/license/siddsarkar/iitkgp-erp-auto-login-extension)
![Mozilla Add-on](https://img.shields.io/amo/rating/%7Bfa21e38a-41b3-4891-8f6b-8ba837e2df65%7D)
![Mozilla Add-on](https://img.shields.io/amo/stars/%7Bfa21e38a-41b3-4891-8f6b-8ba837e2df65%7D)
![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4)

## Why Us?

-   Local only extension (serverless)
-   No fancy permissions, minimum [permissions](#permissions-used) used to work.
-   Light on browser, size ~45-50 kilobytes
-   Updates every 2 months
-   Open source and documented code

## Permissions Used

-   [Storage Local](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/local) API by Mozilla.
-   Access to [erp.iitkgp.ac.in](https://erp.iitkgp.ac.in) to run script for automatic login

## Installation

Several Installation options are available:

-   From Official [AMO Website](https://addons.mozilla.org/en-US/firefox/addon/erp-auto-login-iitkgp/)
    -   Click on `Add to firefox` on the extension page.
-   Manual Installation (Beta users)
    -   [Download the latest release](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/releases) (.xpi) file to your computer.
    -   Open Add-on Manager from options (or) by pressing Ctrl/Cmd+Shift+A on Widows/Mac
    -   Click the gear icon gear icon in the upper-right area of the Add-on Manager Extensions panel.
    -   Select Install Add-on from file... from the menu, then find and select the dowwloaded (.xpi) file.

## Bugs and feature requests

Have a bug or a feature request? Please first search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/issues/new).

## Previous releases

You can find all our [previous releases](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/releases) on releases page of the github repo or directly from [AMO Website](https://addons.mozilla.org/en-US/firefox/addon/erp-auto-login-iitkgp/versions/)

## To do

-   [ ] Add Overlay during autofill, show animation loader
-   [x] Add a reset warning
-   [ ] Multiple users support
-   [x] Add autofill mode
-   [x] Show Changelogs on update
-   [ ] Add Uninstall, Install pages to show

## Contributing

For Contributing to this project please open a pull request describing the changes or features with proper documentation.

Editor preferences are available in the [editor config](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/blob/master/.editorconfig) for easy use in common text editors. Read more and download plugins at <https://editorconfig.org/>.

## Versioning

[The Semantic Versioning guidelines](https://semver.org/) is followed as far as versioning is concerned.

See [the Releases section of our GitHub project](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/releases) for changelogs for each release version of this extension.

## Creator

### **Siddhartha Sarkar**

-   <https://twitter.com/ssarkar791>
-   <https://github.com/siddsarkar>

## Thanks

Thanks to [vs code](https://code.visualstudio.com/) and [web-ext](https://www.npmjs.com/package/web-ext) for providing the environment that allowed us to develop and test in real browsers!

## Screenshots

-   v4_Light - Released!
    ![PC](https://raw.githubusercontent.com/siddsarkar/iitkgp-erp-auto-login-extension/master/screenshots/v4_light.png)

-   v4_Dark - Released!
    ![PC](https://raw.githubusercontent.com/siddsarkar/iitkgp-erp-auto-login-extension/master/screenshots/v4_dark.png)

## Copyright and license

Code and documentation copyright 2020–2021 Siddhartha Sarkar and the [Contributors](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/graphs/contributors). Code released under the [Mozilla Public License 2.0](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/blob/master/LICENSE)
