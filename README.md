<p align="center">
  <a href="https://addons.mozilla.org/en-US/firefox/addon/erp-auto-login-iitkgp/">
    <img src="./src/assets/images/ext_icon.png" alt="ERP Auto Login - IITKGP logo" width="64" height="64">
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

![Cover](/screenshots/cover.png)

# ERP Auto Login - IITKGP

Our default branch `master` is the source code to the recent stable release. Want to test beta versions? Head to the [`develop` branch](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/tree/develop) to view the latest updates and features before the official release.

> This extension `never` shares your credentials. It stays locally in your browser itself using the browser API [`storage.local`](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/local) by mozilla.

## Table of contents

-   [ERP Auto Login - IITKGP](#erp-auto-login---iitkgp)
    -   [Table of contents](#table-of-contents)
    -   [Status](#status)
    -   [Why Us?](#why-us)
    -   [Permissions Used](#permissions-used)
    -   [Installation](#installation)
    -   [Bugs and feature requests](#bugs-and-feature-requests)
    -   [Previous releases](#previous-releases)
    -   [Todos](#todos)
    -   [Contributing](#contributing)
    -   [Versioning](#versioning)
    -   [Thanks](#thanks)
    -   [Screenshots](#screenshots)
    -   [Copyright and License](#copyright-and-license)
    -   [Creator](#creator)

## Status

![Chrome Add-on](https://img.shields.io/chrome-web-store/users/hianmedhblomknonbbmalncjjffdligl?label=chrome-users)
![Mozilla Add-on](https://img.shields.io/amo/v/%7Bfa21e38a-41b3-4891-8f6b-8ba837e2df65%7D)
![Mozilla Add-on](https://img.shields.io/amo/users/%7Bfa21e38a-41b3-4891-8f6b-8ba837e2df65%7D?label=mozilla-users)
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

-   From Firefox/Chrome Stores (recommended)
    <p align="left">
        <a href="https://addons.mozilla.org/en-US/firefox/addon/erp-auto-login-iitkgp/">
            <img src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg" alt="ERP Auto Login - IITKGP logo" height="58">
        </a>
        <a href="https://chrome.google.com/webstore/detail/erp-auto-login-iitkgp/hianmedhblomknonbbmalncjjffdligl">
            <img src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png" alt="ERP Auto Login - IITKGP logo">
        </a>
    </p>

    > For android you can use extensions on the [Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix&hl=en&gl=US) version of Firefox. [follow this article](https://blog.mozilla.org/addons/2020/09/29/expanded-extension-support-in-firefox-for-android-nightly/) to set it up.

-   From GitHub

    -   [Click here](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/releases) to download the latest release `.xpi` for firefox and `.crx` for chrome
    -   Load the extension in `Firefox` as:
        1. Open Add-on Manager from options (or) by pressing <kbd>Ctrl/Cmd+Shift+A</kbd> on Widows/Mac
        2. Click the gear icon ⚙️ in the upper-right area of the Add-on Manager Extensions panel.
        3. Select Install Add-on from file... from the menu, then find and select the dowwloaded (.xpi) file.
    -   Load the extension in `Chrome` as:
        1. Goto `chrome://extensions/` in your chrome browser
        2. Enable developer mode by turning the switch on from the top right corner of the chrome browser
        3. Click on load unpacked and find and select the dowwloaded (.crx) file.

-   Build from source (for development)

    1. Clone the repository
        ```bash
        git clone https://github.com/siddsarkar/iitkgp-erp-auto-login-extension.git
        ```
    2. Cd into the repository
        ```bash
        cd iitkgp-erp-auto-login-extension
        ```
    3. Install dependencies
        ```bash
        yarn install
        ```
    4. Build the extension and watch for changes
        ```bash
        yarn dev:firefox # for firefox
        yarn dev:chrome # (or) for chrome
        ```
    5. The above step will create a `chrome` or a `firefox` folder with the extension in it.
    6. Run the extension using [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) as below
        ```bash
        npm install --global web-ext # install web-ext globally (once only)
        web-ext run # run the extension for firefox
        web-ext run -t chromium # (or) run the extension for chrome
        ```
    7. Check that the extension is loaded by opening the extensions page in Firefox `about:addons` or in Chrome `chrome://extensions/`.

## Bugs and feature requests

Have a bug or a feature request? Please first search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/issues/new).

## Previous releases

You can find all our [previous releases](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/releases) on releases page of the github repo or directly from [AMO Website](https://addons.mozilla.org/en-US/firefox/addon/erp-auto-login-iitkgp/versions/)

## Todos

-   [x] Add a reset warning
-   [x] Add autofill mode
-   [x] Show Changelogs on update
-   [ ] Add Overlay during autofill, show animation loader
-   [ ] Multiple users support
-   [ ] Add Uninstall, Install pages to show

## Contributing

For Contributing to this project please open a pull request describing the changes or features with proper documentation.

Editor preferences are available in the [editor config](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/blob/master/.editorconfig) for easy use in common text editors. Read more and download plugins at <https://editorconfig.org/>.

## Versioning

[The Semantic Versioning guidelines](https://semver.org/) is followed as far as versioning is concerned.

See [the Releases section of our GitHub project](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension/releases) for changelogs for each release version of this extension.

## Thanks

Thanks to [vs code](https://code.visualstudio.com/) and [web-ext](https://www.npmjs.com/package/web-ext) for providing the environment that allowed us to develop and test in real browsers!

## Screenshots

-   [Light](/screenshots/v4_light.png)
-   [Dark](/screenshots/v4_dark.png)

## Copyright and License

To the extent possible under law, [Siddhartha Sarkar](https://github.com/siddsarkar/iitkgp-erp-auto-login-extension) has waived all copyright and related or neighboring rights to ERP Auto Login - IITKGP. This work is published from: India.

[![CC0](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/cc-zero.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

## Creator

<img src="https://siddsarkar.github.io/assets/images/profile.jpg" style="height: 60px !important; border-radius: 50%;">

[**Siddhartha Sarkar**](https://siddsarkar.github.io)

[![Buy Me A Coffee](https://img.shields.io/badge/%E2%98%95-buymeacofee-yellow)](https://www.buymeacoffee.com/siddsarkar)
