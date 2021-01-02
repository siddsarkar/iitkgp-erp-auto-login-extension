//get elements of options page
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
// const _q1 = document.querySelector("#q1");
const _a1 = document.querySelector("#a1");
// const _q2 = document.querySelector("#q2");
const _a2 = document.querySelector("#a2");
// const _q3 = document.querySelector("#q3");
const _a3 = document.querySelector("#a3");
const body = document.querySelector("body");
const log = document.querySelector("#log");

function logger(message) {
  log.textContent = message;
}

// Open ERP button
const btnerp = document.getElementById("erpBtn");
const btnerp2 = document.getElementById("erpBtn2");
function callback() {
  window.close();
}
function openThis(callback) {
  window.open("https://erp.iitkgp.ac.in/");
  window.focus();
  callback();
}

btnerp.addEventListener("click", () => openThis(callback));
btnerp2.addEventListener("click", () => openThis(callback));

// Theme toggle Button
const head = document.getElementById("head");
function theme(isdark) {
  if (isdark) {
    document.getElementById("contact-us").classList.add("dark");
    body.setAttribute("style", "background:#1B1B1B; color: whitesmoke");
  } else {
    body.removeAttribute("style");
    document.getElementById("contact-us").classList.remove("dark");
  }
}
function toggler(isdark) {
  const data = isdark;
  //check current theme(!isdark)
  browser.storage.local.set({
    authCredentials: {
      ...data,
      dark: !isdark.dark,
    },
  });
  theme(!isdark.dark);
}

head.onclick = () => {
  browser.storage.local.get().then((res) => {
    toggler(res.authCredentials);
  });
};
// head.addEventListener("click", );

// Reset button
const reset = document.getElementById("reset");
reset.onclick = () => {
  logger("Data Cleared!");
  usernameInput.value = "";
  passwordInput.value = "";
  // _q1.value = "";
  _a1.value = "";
  // _q2.value =  "";
  _a2.value = "";
  // _q3.value = "";
  _a3.value = "";

  _a1.placeholder = "loading";
  _a2.placeholder = "loading";
  _a3.placeholder = "loading";

  passwordInput.setAttribute("disabled", true);
  _a1.setAttribute("disabled", true);
  _a2.setAttribute("disabled", true);
  _a3.setAttribute("disabled", true);

  browser.storage.local.set({
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
  });

  // var creating = browser.tabs.create({
  //   url: "https://erp.iitkgp.ac.in/IIT_ERP3/logout.htm",
  // });
  // creating.then(onCreated, onError);
  // function onCreated(tab) {
  //   console.log(`Created new tab: ${tab.id}`);
  // }
};
// reset.addEventListener("click", );

function questionsCallback(message, done) {
  if (done) {
    if (passwordInput.value == "") {
      logger(message + "enter password");
    } else if (_a1.value == "" || _a2.value == "" || _a3.value == "") {
      logger("Fill Security Answers");
    } else {
      logger("All Set!");
    }

    console.log("questionsCallback:%s", message);
    storeSettings();
  } else {
    console.log("questionsCallback:%s", message);
    getQuestions(questionsCallback);
  }
}

// get the qestions upon entering roll no.
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
      console.log("httpCallback:%s", message);
      if (
        _a1.placeholder == "loading" ||
        _a2.placeholder == "loading" ||
        _a3.placeholder == "loading"
      ) {
        return cb("re call getquestion", false);
      } else return cb("Got all Questions!", true);
    } else {
      console.log("httpCallback:%s", message);
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

  let q = await res.text();
  console.log(q);
  if (q != "FALSE") {
    passwordInput.removeAttribute("disabled");
    // console.log here to see respose
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

// Store the currently typed information on blur event
function storeSettings() {
  browser.storage.local.set({
    authCredentials: {
      username: usernameInput.value,
      password: passwordInput.value,
      // q1: _q1.value,
      q1: _a1.placeholder,
      a1: _a1.value,
      // q2: _q2.value,
      q2: _a2.placeholder,
      a2: _a2.value,
      // q3: _q3.value,
      q3: _a3.placeholder,
      a3: _a3.value,
    },
  });
}

// error-logger
function onError(e) {
  console.error(e);
}

//Update the options UI with the settings values retrieved from storage,
//or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  theme(restoredSettings.authCredentials.dark);
  usernameInput.value = restoredSettings.authCredentials.username || "";
  passwordInput.value = restoredSettings.authCredentials.password || "";
  // _q1.value = restoredSettings.authCredentials.q1 || "";
  _a1.value = restoredSettings.authCredentials.a1 || "";
  // _q2.value = restoredSettings.authCredentials.q2 || "";
  _a2.value = restoredSettings.authCredentials.a2 || "";
  // _q3.value = restoredSettings.authCredentials.q3 || "";
  _a3.value = restoredSettings.authCredentials.a3 || "";

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
// On opening the options page, fetch stored settings and update the UI with them.
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

// To get questions
// usernameInput.addEventListener("blur", getQuestions);

//On blur, save the currently selected settings.
var re = /[0-9]{2}[a-z|A-Z]{2}[0-9]{5}/;
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
  var OK = re.exec(usernameInput.value);
  if (!OK) {
    logger("Enter a valid Roll No");
    console.error(usernameInput.value + " isn't a roll number!");
  } else {
    console.log("Thanks, your roll number is " + OK[0]);
    logger("Getting Questions..");
    getQuestions(questionsCallback);
  }
}
usernameInput.addEventListener("keyup", testRoll);

passwordInput.addEventListener("blur", storeSettings);
// _q1.addEventListener("blur", storeSettings);
_a1.addEventListener("blur", storeSettings);
// _q2.addEventListener("blur", storeSettings);
_a2.addEventListener("blur", storeSettings);
// _q3.addEventListener("blur", storeSettings);
_a3.addEventListener("blur", storeSettings);
