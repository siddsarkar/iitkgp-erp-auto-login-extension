import WebCrypto from "../libs/crypto";

/* Helpers */

function displayMessage(message, color = "#45a1ff") {
    if (document.getElementById("message")) {
        document.getElementById("message").remove();
    }

    const msg = document.createElement("div");
    msg.id = "message";
    msg.setAttribute(
        "style",
        `background: ${color};color: #ffffff;font-weight:500; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center;flex-direction:row`
    );
    msg.textContent = message;
    document.body.prepend(msg);
}

function extractToken(str, tokenName) {
    const m = str.match(/[#?](.*)/);
    if (!m || m.length < 1) {
        return null;
    }

    const params = new URLSearchParams(m[1].split("#")[0]);
    return params.get(tokenName);
}

/* Utils */

async function authRequest({ username, password, answer, requestedUrl, sessionToken }) {
    const params = `user_id=${username}&password=${password}&answer=${answer}&requestedUrl=${requestedUrl}&sessionToken=${sessionToken}`;
    const requestURL = "https://erp.iitkgp.ac.in/SSOAdministration/auth.htm";
    const requestHeaders = new Headers();
    requestHeaders.append("Content-type", "application/x-www-form-urlencoded");

    const driveRequest = new Request(requestURL, {
        method: "POST",
        headers: requestHeaders,
        body: params,
    });

    const response = await fetch(driveRequest);
    if (response.ok && response.status === 200) {
        return response;
    }

    throw response.status;
}

async function getSecurityQues(username) {
    const params = `user_id=${username}`;
    const requestURL = "https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm";
    const requestHeaders = new Headers();
    requestHeaders.append("Content-type", "application/x-www-form-urlencoded");

    const driveRequest = new Request(requestURL, {
        method: "POST",
        headers: requestHeaders,
        body: params,
    });

    const response = await fetch(driveRequest);
    if (response.ok && response.status === 200) {
        return response.text();
    }

    throw response.status;
}

const c = new WebCrypto();

async function exec(res) {
    if (!res.authCredentials) {
        return displayMessage("You have extension to automatic login. Please fill it", "#715100");
    }

    const { authCredentials } = res;
    const { requirePin } = authCredentials;
    let pin;

    if (!authCredentials.autoLogin) {
        return displayMessage("Automatic login is turned off!", "#4a4a4f");
    }

    if (
        authCredentials.username === "" ||
        authCredentials.password === "" ||
        authCredentials.q1 === "Your erp question 1" ||
        authCredentials.q2 === "Your erp question 2" ||
        authCredentials.q3 === "Your erp question 3" ||
        authCredentials.a1 === "" ||
        authCredentials.a2 === "" ||
        authCredentials.a3 === ""
    ) {
        if (authCredentials.partialFill) {
            /* Fill partially filled data */
            return chrome.runtime.sendMessage({
                action: "auto_fill",
            });
        }

        return;
    }

    if (
        authCredentials.username !== "" &&
        authCredentials.password !== "" &&
        authCredentials.q1 !== "Your erp question 1" &&
        authCredentials.q2 !== "Your erp question 2" &&
        authCredentials.q3 !== "Your erp question 3" &&
        authCredentials.a1 !== "" &&
        authCredentials.a2 !== "" &&
        authCredentials.a3 !== ""
    ) {
        displayMessage("Logging you in! please wait...");
    }

    if (authCredentials.requirePin) {
        // eslint-disable-next-line no-alert
        pin = prompt("Enter your 4 digit PIN");
    }

    const ssToken = extractToken(window.location.search, "sessionToken");
    const rURL = extractToken(window.location.search, "requestedUrl");
    let ans;
    let password;

    const str = await getSecurityQues(authCredentials.username);
    if (str === "FALSE") {
        displayMessage("Invalid username/password set! Please update your credentials", "#a4000f");
    } else {
        if (requirePin) {
            try {
                password = await c.decrypt(authCredentials.password, pin);
            } catch (_) {
                return displayMessage(
                    "Invorrect PIN!, Please reset if forgot or refresh page to retry.",
                    "#a4000f"
                );
            }
        } else {
            password = authCredentials.password;
        }

        if (str === authCredentials.q1) {
            ans = requirePin ? await c.decrypt(authCredentials.a1, pin) : authCredentials.a1;
        } else if (str === authCredentials.q2) {
            ans = requirePin ? await c.decrypt(authCredentials.a2, pin) : authCredentials.a2;
        } else {
            ans = requirePin ? await c.decrypt(authCredentials.a3, pin) : authCredentials.a3;
        }

        const result = await authRequest({
            username: authCredentials.username,
            password,
            answer: ans,
            sessionToken: ssToken,
            requestedUrl: rURL,
        });

        if (result.status === 200 && result.statusText === "OK" && result.redirected) {
            location.href = result.url;
        } else {
            displayMessage("Wrong credentials set! Please update your credentials", "#a4000f");
        }
    }
}

chrome.storage.local.get(["authCredentials"], exec);
