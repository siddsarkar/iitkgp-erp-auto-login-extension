// grab elements of the page
const loginid = document.getElementById("user_id");
const quesn = document.getElementById("question");
const answer = document.getElementById("answer");
const pass = document.getElementById("password");
const inject = document.getElementById("signin");
const btn = document.getElementsByClassName("btn btn-primary");

const ans = document.getElementById("answer_div");

//process of filling info to the page
function process() {
  browser.storage.local.get().then((res) => {
    authstart(res.authCredentials);
  });
}

// case-1 refresh on page
if (document.readyState == "complete") {
  process();
}

//case-2 on new tab creation
function stateEvent() {
  document.removeEventListener("readystatechange", stateEvent);
  if (document.readyState == "complete") {
    process();
  }
}

//listen to state of page
// document.addEventListener("readystatechange", stateEvent);

function authstart(cred) {
  //check if all fields are filled.
  if (
    cred.username != "" &&
    cred.password != "" &&
    cred.q1 != "" &&
    cred.q2 != "" &&
    cred.q3 != "" &&
    cred.a1 != "" &&
    cred.a2 != "" &&
    cred.a3 != ""
  ) {
    inject.focus();
    loginid.focus();
    loginid.value = cred.username;
    loginid.blur();
    pass.value = cred.password;
    setTimeout(() => {
      if (quesn.innerHTML == cred.q1) {
        answer.value = cred.a1;
        setTimeout(() => {
          btn[0].click();
        }, 100);
      } else if (quesn.innerHTML == cred.q2) {
        answer.value = cred.a2;
        setTimeout(() => {
          btn[0].click();
        }, 100);
      } else if (quesn.innerHTML == cred.q3) {
        answer.value = cred.a3;
        setTimeout(() => {
          btn[0].click();
        }, 100);
      }
    }, 1000);
  } else {
    //if not show error msg on the page.
    const msg = document.createElement("div");
    msg.setAttribute(
      "style",
      "background-color: red;color: white; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center;"
    );
    msg.innerHTML = "Fill out your credentials on extension !";
    document.body.prepend(msg);
    setTimeout(() => {
      document.body.removeChild(msg);
    }, 5000);
  }
}

//Default settings. Initialize storage to these values.
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

//error-logger
function onError(e) {
  console.error(e);
}

//On startup, check whether we have stored settings.
function checkStoredSettings(storedSettings) {
  if (!storedSettings.authCredentials) {
    //If we don't, then store the default settings.
    browser.storage.local.set({ authCredentials });
  }
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
