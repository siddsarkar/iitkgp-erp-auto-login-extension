var loginid = document.getElementById("user_id");
var quesn = document.getElementById("question");
var answer = document.getElementById("answer");
var pass = document.getElementById("password");
var inject = document.getElementById("signin");
var btn = document.getElementsByClassName("btn btn-primary");

const getdata = async () => {
  let data = await browser.storage.local.get({ authCredentials });
  let cred = await data.authCredentials;
  authstart(cred);
  loginid.value = cred.username;
  pass.value = cred.password;
};
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    getdata();
  }
};
function authstart(cred) {
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
      } else {
        const msg = document.createElement("div");
        msg.setAttribute(
          "style",
          "background-color: black;color: white; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center"
        );
        msg.innerHTML = "BAD CREDENTIALS ! Please check again!";
        document.body.prepend(msg);
        setTimeout(() => {
          document.body.removeChild(msg);
        }, 5000);
        null;
      }
    }, 2000);
  } else {
    const msg = document.createElement("div");
    msg.setAttribute(
      "style",
      "background-color: black;color: white; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center"
    );
    msg.innerHTML = "Fill out your credentials !";
    document.body.prepend(msg);
    setTimeout(() => {
      document.body.removeChild(msg);
    }, 5000);
  }
}

/*
Default settings. Initialize storage to these values.
*/
var authCredentials = {
  username: "",
  password: "",
  q1: "",
  q2: "",
  q3: "",
  a1: "",
  a2: "",
  a3: "",
};

/*
Generic error logger.
*/
function onError(e) {
  console.error(e);
}

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/

function checkStoredSettings(storedSettings) {
  if (!storedSettings.authCredentials) {
    browser.storage.local.set({ authCredentials });
  }
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
