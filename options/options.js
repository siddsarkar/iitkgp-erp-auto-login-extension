//get elements of options page
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const _q1 = document.querySelector("#q1");
const _a1 = document.querySelector("#a1");
const _q2 = document.querySelector("#q2");
const _a2 = document.querySelector("#a2");
const _q3 = document.querySelector("#q3");
const _a3 = document.querySelector("#a3");
const body = document.querySelector("body");

// Open ERP button
const btnerp = document.getElementById("erpBtn");
function callback() {
  window.close();
}
function openThis(callback) {
  window.open("https://erp.iitkgp.ac.in/");
  window.focus();
  callback();
}
btnerp.addEventListener("click", () => openThis(callback));

// Theme toggle Button
const head = document.getElementById("head");
function theme(isdark) {
  if (isdark) {
    body.setAttribute("style", "background:#1B1B1B; color: whitesmoke");
  } else {
    body.removeAttribute("style");
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
head.addEventListener("click", (e) => {
  e.preventDefault();
  browser.storage.local.get().then((res) => {
    toggler(res.authCredentials);
  });
});

// Reset button
const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  browser.storage.local.set({
    authCredentials: {
      username: "",
      password: "",
      q1: "",
      q2: "",
      q3: "",
      a1: "",
      a2: "",
      a3: "",
      dark: false,
    },
  });
  var creating = browser.tabs.create({
    url: "https://erp.iitkgp.ac.in/IIT_ERP3/logout.htm",
  });
  creating.then(onCreated, onError);
  function onCreated(tab) {
    console.log(`Created new tab: ${tab.id}`);
  }
});

// get the qestions upon entering roll no.
function getQuestions() {
  let i = 0;
  while (_q1.value == "" || _q2.value == "" || _q3.value == "") {
    if (i == 10) break;
    let http = new XMLHttpRequest();
    let url = "https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm";
    let params = `user_id=${usernameInput.value}`;
    http.open("POST", url, false);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (
        http.readyState == 4 &&
        http.status == 200 &&
        http.responseText != "FALSE"
      ) {
        // console.log here to see respose
        if (_q1.value == "") {
          _q1.value = http.responseText;
        } else if (_q2.value == "" && http.responseText != _q1.value) {
          _q2.value = http.responseText;
        } else if (
          http.responseText != _q1.value &&
          http.responseText != _q2.value
        ) {
          _q3.value = http.responseText;
        }
      }
    };
    http.send(params);
    i++;
  }
}

// Store the currently typed information on blur event
function storeSettings() {
  browser.storage.local.set({
    authCredentials: {
      username: usernameInput.value,
      password: passwordInput.value,
      q1: _q1.value,
      a1: _a1.value,
      q2: _q2.value,
      a2: _a2.value,
      q3: _q3.value,
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
  _q1.value = restoredSettings.authCredentials.q1 || "";
  _a1.value = restoredSettings.authCredentials.a1 || "";
  _q2.value = restoredSettings.authCredentials.q2 || "";
  _a2.value = restoredSettings.authCredentials.a2 || "";
  _q3.value = restoredSettings.authCredentials.q3 || "";
  _a3.value = restoredSettings.authCredentials.a3 || "";
}
// On opening the options page, fetch stored settings and update the UI with them.
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

// To get questions
usernameInput.addEventListener("blur", getQuestions);

//On blur, save the currently selected settings.
usernameInput.addEventListener("blur", storeSettings);
passwordInput.addEventListener("blur", storeSettings);
_q1.addEventListener("blur", storeSettings);
_a1.addEventListener("blur", storeSettings);
_q2.addEventListener("blur", storeSettings);
_a2.addEventListener("blur", storeSettings);
_q3.addEventListener("blur", storeSettings);
_a3.addEventListener("blur", storeSettings);
