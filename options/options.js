const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const _q1 = document.querySelector("#q1");
const _a1 = document.querySelector("#a1");
const _q2 = document.querySelector("#q2");
const _a2 = document.querySelector("#a2");
const _q3 = document.querySelector("#q3");
const _a3 = document.querySelector("#a3");

/*
Store the currently selected settings using browser.storage.local.
*/
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

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {
  usernameInput.value = restoredSettings.authCredentials.username || "";
  passwordInput.value = restoredSettings.authCredentials.password || "";
  _q1.value = restoredSettings.authCredentials.q1 || "";
  _a1.value = restoredSettings.authCredentials.a1 || "";
  _q2.value = restoredSettings.authCredentials.q2 || "";
  _a2.value = restoredSettings.authCredentials.a2 || "";
  _q3.value = restoredSettings.authCredentials.q3 || "";
  _a3.value = restoredSettings.authCredentials.a3 || "";
}

function onError(e) {
  console.error(e);
}

/*
On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
On blur, save the currently selected settings.
*/
usernameInput.addEventListener("blur", storeSettings);
passwordInput.addEventListener("blur", storeSettings);
_q1.addEventListener("blur", storeSettings);
_a1.addEventListener("blur", storeSettings);
_q2.addEventListener("blur", storeSettings);
_a2.addEventListener("blur", storeSettings);
_q3.addEventListener("blur", storeSettings);
_a3.addEventListener("blur", storeSettings);
