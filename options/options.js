/**
 * ! Function Definitions
 * ? [step] Flow Comments
 * * Line Definition
 *
 * ! Copyright ©2020 Siddhartha Sarkar. All Rights Reserved.
 * ? This source code is licensed under the MIT license found in the
 * ? LICENSE file in the root directory of this source tree.
 */

//* grab elements of popup html
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const _a1 = document.querySelector("#a1");
const _a2 = document.querySelector("#a2");
const _a3 = document.querySelector("#a3");
const body = document.querySelector("body");
const log = document.querySelector("#log");
const btnerp = document.getElementById("erpBtn");
const head = document.getElementById("head");
const reset = document.getElementById("reset");
const copyright = document.getElementById("copyright");
// const _q1 = document.querySelector("#q1");  //moved to placeholder
// const _q2 = document.querySelector("#q2");  //moved to placeholder
// const _q3 = document.querySelector("#q3");  //moved to placeholder

//* Add the copyright text
let year = new Date().getFullYear();
copyright.textContent = `copyright@${year}`;

//! use current theme colors if exist to set theme.
function setTheme(colors) {
  if (!colors) {
    //default theme case: else lookfor media queries
    var preferDarkQuery = "(prefers-color-scheme: dark)";
    var mql = window.matchMedia(preferDarkQuery);
    var supportsColorSchemeQuery = mql.media === preferDarkQuery;
    if (supportsColorSchemeQuery && mql.matches) {
      // prefers dark
      document
        .getElementById("contact-us")
        .setAttribute(
          "style",
          "background:hsl(240, 1%, 20%); color: whitesmoke"
        );
      body.setAttribute("style", "background:#4a4a4f; color: whitesmoke");
    } else {
      // prefers light
      document
        .getElementById("contact-us")
        .setAttribute("style", "background:#d3d3d3; color: whitesmoke");
      body.setAttribute("style", "background:#f8f4e5; color: whitesmoke");
    }
  } else {
    //custom theme case: use theme colors
    body.setAttribute("style", `background:${colors.popup};color: whitesmoke`);
    document
      .getElementById("contact-us")
      .setAttribute("style", `background:${colors.toolbar};color: whitesmoke `);
  }
}

// Toggle dark state of stored settings
function toggleDark(isdark) {
  const data = isdark;
  // get current theme and set it's inverse to storage
  browser.storage.local.set({
    authCredentials: {
      ...data,
      dark: !isdark.dark,
    },
  });
  // update the theme
  // theme(!isdark.dark);
}

// error-logger
function onError(e) {
  console.error(e);
}

// message-display on UI
function logger(message) {
  log.textContent = message;
}

// opens a new tab with url and close the popup
function openThis(url) {
  browser.tabs
    .create({
      url,
    })
    .then(() => window.close(), onError);
}

/**
 * ? If all placeholders are not loading --> http-req is sent ?
 *      ! httpCallback-false--> [exit] not a valid roll no.
 *      * httpCallback-true-->  if any of the placeholders are 'loading' ?
 *              ! --nope--> questionsCallback-true--> all questions got [END]
 *              * --yes--> questionsCallback-false--> call getQuestion again [REPEAT FROM START]
 */

function questionsCallback(message, done) {
  if (done) {
    if (passwordInput.value == "") {
      logger(message + "enter password");
    } else if (_a1.value == "" || _a2.value == "" || _a3.value == "") {
      logger("Fill Security Answers");
    } else {
      logger("All Set!");
    }
    // console.log("questionsCallback:%s", message);
    storeSettings();
  } else {
    // console.log("questionsCallback:%s", message);
    getQuestions(questionsCallback);
  }
}

async function getQuestions(cb) {
  if (
    _a1.placeholder !== "loading" &&
    _a2.placeholder !== "loading" &&
    _a3.placeholder !== "loading"
  ) {
    return cb("Question already loaded!", true);
  }

  function httpCallback(message, done) {
    if (done) {
      // console.log("httpCallback:%s", message);
      if (
        _a1.placeholder == "loading" ||
        _a2.placeholder == "loading" ||
        _a3.placeholder == "loading"
      ) {
        return cb("re call getquestion", false);
      } else return cb("Got all Questions!", true);
    } else {
      // console.log("httpCallback:%s", message);
      logger(message);
      return;
    }
  }

  let params = `user_id=${usernameInput.value}`;
  let url = "https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm";
  let res = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-type": "application/x-www-form-urlencoded",
    }),
    body: params,
  });

  let q = await res.text(); //q --> question

  // console.log(q);
  if (q != "FALSE") {
    passwordInput.removeAttribute("disabled");
    if (_a1.placeholder == "loading") {
      _a1.placeholder = q;
      _a1.removeAttribute("disabled");
    } else if (_a2.placeholder == "loading" && q != _a1.placeholder) {
      _a2.placeholder = q;
      _a2.removeAttribute("disabled");
    } else if (q != _a1.placeholder && q != _a2.placeholder) {
      _a3.placeholder = q;
      _a3.removeAttribute("disabled");
    }
    return httpCallback("continue to get", true);
  } else {
    return httpCallback("Not a valid Roll no, Retry!", false);
  }
}
/**
 * !MAIN LOGIC END
 */

// Store the currently typed information on blur event
function storeSettings() {
  browser.storage.local.set({
    authCredentials: {
      username: usernameInput.value,
      password: passwordInput.value,
      q1: _a1.placeholder,
      a1: _a1.value,
      q2: _a2.placeholder,
      a2: _a2.value,
      q3: _a3.placeholder,
      a3: _a3.value,
      // q2: _q2.value,
      // q3: _q3.value,
      // q1: _q1.value,
    },
  });
}

//! Update the popup UI with the settings values retrieved from storage,
//! or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  // theme(restoredSettings.authCredentials.dark);
  usernameInput.value = restoredSettings.authCredentials.username || "";
  passwordInput.value = restoredSettings.authCredentials.password || "";
  _a1.value = restoredSettings.authCredentials.a1 || "";
  _a2.value = restoredSettings.authCredentials.a2 || "";
  _a3.value = restoredSettings.authCredentials.a3 || "";
  // _q1.value = restoredSettings.authCredentials.q1 || "";
  // _q2.value = restoredSettings.authCredentials.q2 || "";
  // _q3.value = restoredSettings.authCredentials.q3 || "";

  _a1.placeholder = restoredSettings.authCredentials.q1 || "loading";
  _a2.placeholder = restoredSettings.authCredentials.q2 || "loading";
  _a3.placeholder = restoredSettings.authCredentials.q3 || "loading";

  if (restoredSettings.authCredentials.username == "") {
    logger("Enter Roll Number");
  } else if (restoredSettings.authCredentials.password == "") {
    logger("Enter Password");
    passwordInput.removeAttribute("disabled");
    passwordInput.addEventListener("keyup", () => {
      _a1.removeAttribute("disabled");
      _a2.removeAttribute("disabled");
      _a3.removeAttribute("disabled");
      logger("Enter security answers!");
    });
    passwordInput.removeEventListener("keyup", null);
  } else if (_a1.value != "" && _a2.value != "" && _a3.value != "") {
    _a1.setAttribute("disabled", true);
    _a2.setAttribute("disabled", true);
    _a3.setAttribute("disabled", true);
    logger("You are all set!");
  } else {
    logger("Fill security answers!");
    _a1.removeAttribute("disabled");
    _a2.removeAttribute("disabled");
    _a3.removeAttribute("disabled");
  }
}

//! check whether we have stored settings.
function checkStoredSettings(storedSettings) {
  if (!storedSettings.authCredentials) {
    // If we don't, then store the default settings and updateUI with it.
    let authCredentials = {
      username: "",
      password: "",
      q1: "loading",
      q2: "loading",
      q3: "loading",
      a1: "",
      a2: "",
      a3: "",
      dark: false,
    };
    browser.storage.local
      .set({ authCredentials })
      .then(() => updateUI({ authCredentials }), onError);
  } else {
    // else updateUI with stored settings.
    updateUI(storedSettings);
  }
}

//On blur, save the currently selected settings.

//! Check if roll number matches the pattern
function testRoll() {
  if (usernameInput.value.length !== 9) {
    if (usernameInput.value.length == 8 || usernameInput.value.length == 10) {
      _a1.placeholder = "loading";
      _a2.placeholder = "loading";
      _a3.placeholder = "loading";
      _a1.value = "";
      _a2.value = "";
      _a3.value = "";
      passwordInput.value = "";
    }
    logger("Enter a valid Roll No");
    return;
  }
  var re = /[0-9]{2}[a-z|A-Z]{2}[0-9]{5}/; //? regex for IITKGP ROLL-NUMBERS
  var OK = re.exec(usernameInput.value);
  if (!OK) {
    //* if not display message
    // console.error(usernameInput.value + " isn't a roll number!");
    logger("Enter a valid Roll No");
  } else {
    //* if matched get questions
    // console.log("roll number is " + OK[0]);
    logger("Getting Questions..");
    getQuestions(questionsCallback);
  }
}

/**
 * ?CALLERS
 */
const gettingStoredSettings = browser.storage.local
  .get()
  .then(checkStoredSettings, onError);

const gettingThemeColors = browser.theme
  .getCurrent()
  .then((theme) => setTheme(theme.colors), onError);

/**
 * !EVENT LISTENERS
 */

usernameInput.addEventListener("keyup", testRoll);
passwordInput.addEventListener("blur", storeSettings);
_a1.addEventListener("blur", storeSettings);
_a2.addEventListener("blur", storeSettings);
_a3.addEventListener("blur", storeSettings);
// _q1.addEventListener("blur", storeSettings);
// _q2.addEventListener("blur", storeSettings);
// _q3.addEventListener("blur", storeSettings);

/**
 * *ONCLICKS
 */

btnerp.onclick = () => openThis("https://erp.iitkgp.ac.in/");
head.onclick = () => {
  openThis(
    "https://addons.mozilla.org/en-US/firefox/addon/erp-auto-login-iitkgp/"
  );
  // browser.storage.local.get().then((res) => {
  //   toggler(res.authCredentials);
  // });
};
reset.onclick = () => {
  logger("Data Cleared!");
  usernameInput.value = "";
  passwordInput.value = "";
  _a1.value = "";
  _a2.value = "";
  _a3.value = "";
  // _q1.value = "";
  // _q2.value =  "";
  // _q3.value = "";

  _a1.placeholder = "loading";
  _a2.placeholder = "loading";
  _a3.placeholder = "loading";

  passwordInput.setAttribute("disabled", true);
  _a1.setAttribute("disabled", true);
  _a2.setAttribute("disabled", true);
  _a3.setAttribute("disabled", true);

  browser.storage.local
    .set({
      authCredentials: {
        username: "",
        password: "",
        q1: "loading",
        q2: "loading",
        q3: "loading",
        a1: "",
        a2: "",
        a3: "",
        dark: false,
      },
    })
    .then(() => {
      browser.tabs
        .create({
          url: "https://erp.iitkgp.ac.in/IIT_ERP3/logout.htm",
        })
        .then(function onCreated(tab) {
          console.log("Successfully logged Out!");
        }, onError);
    });
};
