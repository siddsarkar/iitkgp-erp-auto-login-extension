/**
 * * ------------ README FIRST ----------------
 *
 */

console.log("execute_c_script");

browser.storage.local.get().then((res) => {
  if (!res.authCredentials) {
    displayMessage("You have extension to automatic login. Please fill it");
  } else {
    let { authCredentials } = res;

    if (!authCredentials.autoLogin) {
      return displayMessage("AutoLogin is turned off");
    }

    if (
      authCredentials.username == "" &&
      authCredentials.password == "" &&
      authCredentials.q1 == "loading" &&
      authCredentials.q2 == "loading" &&
      authCredentials.q3 == "loading" &&
      authCredentials.a1 == "" &&
      authCredentials.a2 == "" &&
      authCredentials.a3 == ""
    ) {
      return displayMessage("Fill out credentials");
    }

    displayMessage("Logging you in..");
    const ssToken = window.location.search.replace(
      new RegExp(
        `^(?:.*[&\\?]${encodeURIComponent("sessionToken").replace(
          /[.+*]/g,
          "\\$&"
        )}(?:\\=([^&]*))?)?.*$`,
        "i"
      ),
      "$1"
    );
    const rURL = window.location.search.replace(
      new RegExp(
        `^(?:.*[&\\?]${encodeURIComponent("requestedUrl").replace(
          /[.+*]/g,
          "\\$&"
        )}(?:\\=([^&]*))?)?.*$`,
        "i"
      ),
      "$1"
    );

    let ans;

    // qes
    let params = `user_id=${authCredentials.username}`;
    let url = "https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm";
    let fetching = fetch(url, {
      method: "POST",
      headers: new Headers({
        "Content-type": "application/x-www-form-urlencoded",
      }),
      body: params,
    });
    fetching.then((q) => {
      console.log(q);
      q.text().then((str) => {
        if (str === authCredentials.q1) {
          ans = authCredentials.a1;
        } else if (str === authCredentials.q2) {
          ans = authCredentials.a2;
        } else {
          ans = authCredentials.a3;
        }

        let authParams = `user_id=${authCredentials.username}&password=${authCredentials.password}&answer=${ans}&sessionToken=${ssToken}&requestedUrl=${rURL}`;
        let authUrl = "https://erp.iitkgp.ac.in/SSOAdministration/auth.htm";

        let authenticating = fetch(authUrl, {
          method: "POST",
          headers: new Headers({
            "Content-type": "application/x-www-form-urlencoded",
          }),
          body: authParams,
        });

        authenticating.then((result) => {
          if (
            result.status == 200 &&
            result.statusText == "OK" &&
            result.redirected
          ) {
            console.log(result);
            location.href = result.url;
          } else {
            displayMessage(
              "Wrong Credentials set. Please update your credentials"
            );
          }
        });
      });
    });
  }
});

/**
 * @description Displays message on top of page
 * @param {string} message
 */
function displayMessage(message) {
  if (!document.getElementById("erpautologinmessage")) {
    const msg = document.createElement("div");
    msg.id = "erpautologinmessage";

    msg.setAttribute(
      "style",
      "background-image: linear-gradient(#6d94bf, #446e9b 50%, #3e648d);color: white; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center;flex-direction:row"
    );
    msg.textContent = message;
    document.body.prepend(msg);
  } else {
    document.getElementById("erpautologinmessage").textContent = message;
  }
}
