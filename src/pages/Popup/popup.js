import WebCrypto from "../../../libs/crypto";
import ERP from "../../../libs/erp";

// eslint-disable-next-line max-params
function logger(
    message,
    type = "info",
    actions = false,
    onClickYes = () => {},
    onclickCancel = () => {}
) {
    const log = document.getElementById("log");
    const logIcon = document.getElementById("logIcon");
    const logText = document.getElementById("logText");

    const status = document.getElementById("status");
    const statusIcon = document.getElementById("statusIcon");
    const statusText = document.getElementById("statusText");

    let iconId;
    log.className = type;

    status.style.backgroundColor = "yellow";
    switch (type) {
        case "warning":
            iconId = "warning";
            break;
        case "error":
            iconId = "cross";
            break;
        case "success":
            iconId = "check";
            status.style.backgroundColor = "lightgreen";
            break;

        default:
            iconId = "info";
            break;
    }

    logText.textContent = message;
    logIcon.setAttribute("href", chrome.runtime.getURL(`/assets/sprite.svg#${iconId || "info"}`));

    statusText.textContent = message;
    statusIcon.setAttribute(
        "href",
        chrome.runtime.getURL(`/assets/sprite.svg#${iconId || "info"}`)
    );

    if (actions) {
        // Removes previous actions
        document.querySelectorAll(".action").forEach((el) => el.remove());

        const actionBtnYes = document.createElement("div");
        actionBtnYes.className = "action";
        actionBtnYes.textContent = "Yes";

        const actionBtnCancel = document.createElement("div");
        actionBtnCancel.className = "action";
        actionBtnCancel.textContent = "Cancel";

        log.appendChild(actionBtnYes);
        log.appendChild(actionBtnCancel);

        actionBtnYes.onclick = () => {
            log.removeChild(actionBtnYes);
            log.removeChild(actionBtnCancel);
            onClickYes();
        };

        actionBtnCancel.onclick = () => {
            log.removeChild(actionBtnYes);
            log.removeChild(actionBtnCancel);
            onclickCancel();
        };
    }
}

const toggleCheckBox = (e) => {
    const { target } = e;
    chrome.storage.local.get(["authCredentials"], (result) => {
        if (result.authCredentials) {
            console.log(`curr ${target.id}:`, result.authCredentials[target.id]);
            chrome.storage.local.set(
                {
                    authCredentials: {
                        ...result.authCredentials,
                        [target.id]: !result.authCredentials[target.id],
                    },
                },
                () => {
                    console.log(`set ${target.id} to:`, !result.authCredentials[target.id]);

                    target.checked = !result.authCredentials[target.id];
                }
            );
        }
    });
};

/* Intialize Theme */
chrome.storage.local.get(["theme", "bg"], (result) => {
    const themeSelect = document.getElementById("theme_select");
    const themeBg = document.getElementById("theme-bg");

    if (
        result.theme === "dark" ||
        (!("theme" in result) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        document.documentElement.classList.add("dark");
        document.querySelector(".spinner-wrapper").style.backgroundColor = "#191919";
        themeSelect.value = "dark";
    } else {
        document.documentElement.classList.remove("dark");
        themeSelect.value = "light";
    }

    if (result.bg === "yes") {
        document.body.classList.toggle("pride-theme");
        themeBg.checked = true;
    } else {
        themeBg.checked = false;
    }

    themeBg.onchange = (ev) => {
        document.body.classList.toggle("pride-theme");
        chrome.storage.local.set({ bg: ev.target.checked ? "yes" : "no" });
    };

    themeSelect.onchange = (ev) => {
        document.documentElement.classList.toggle("dark");
        chrome.storage.local.set({ theme: ev.target.value });
    };
});

window.addEventListener("DOMContentLoaded", () => {
    let authCredentials = {
        requirePin: false,
        autoLogin: true,
        username: "",
        password: "",
        q1: "",
        q2: "",
        q3: "",
        a1: "",
        a2: "",
        a3: "",
    };

    // eslint-disable-next-line complexity
    chrome.storage.local.get(["authCredentials"], (result) => {
        if (result.authCredentials) {
            authCredentials = result.authCredentials;
        }

        console.log(authCredentials);

        const autologinToggleBtn = document.getElementById("autoLogin");
        const loader = document.getElementById("loader");
        const form = document.getElementById("form_add_user");
        const formResetBtn = document.getElementById("reset_form");
        const formSubmitBtn = document.getElementById("submit_form");
        const username = document.getElementById("username");
        const usernameSubmitBtn = document.getElementById("username_submit_button");
        const password = document.getElementById("password");
        const a1 = document.getElementById("question_one");
        const a2 = document.getElementById("question_two");
        const a3 = document.getElementById("question_three");
        const pin = document.getElementById("pin");
        const questions = document.querySelectorAll("input[name='question']");

        // Extras
        const container = document.querySelector(".box-container");
        const formToggleBtns = document.querySelectorAll(".left-button,.right-button");

        username.value = authCredentials.username || "";
        password.value = authCredentials.password || "";
        a1.value = authCredentials.a1 || "";
        a2.value = authCredentials.a2 || "";
        a3.value = authCredentials.a3 || "";
        a1.placeholder = authCredentials.q1 || "Your erp question 1";
        a2.placeholder = authCredentials.q2 || "Your erp question 2";
        a3.placeholder = authCredentials.q3 || "Your erp question 3";
        autologinToggleBtn.checked = authCredentials.autoLogin;

        if (authCredentials.requirePin) {
            pin.style.display = "none";
            const smallText = document.createElement("small");
            smallText.style = "margin-left: 50px";
            smallText.innerText = "PIN is set!";
            pin.after(smallText);
        }

        if (authCredentials.username === "") {
            logger("Enter Roll Number");
            username.removeAttribute("disabled");
        } else if (authCredentials.password === "") {
            logger("Enter Password", "warning");
            password.removeAttribute("disabled");
            password.addEventListener("keyup", () => {
                a1.removeAttribute("disabled");
                a2.removeAttribute("disabled");
                a3.removeAttribute("disabled");
                logger("Enter security answers!", "warning");
            });
            password.removeEventListener("keyup", null);
        } else if (a1.value !== "" && a2.value !== "" && a3.value !== "") {
            a1.disabled = true;
            a2.disabled = true;
            a3.disabled = true;
            logger(`You are all set! ${authCredentials.username}`, "success");
        } else {
            logger("Fill security answers!", "warning");
            a1.disabled = false;
            a2.disabled = false;
            a3.disabled = false;
        }

        const emptyFieldExists =
            authCredentials.username === "" ||
            authCredentials.password === "" ||
            authCredentials.a1 === "" ||
            authCredentials.q1 === "Your erp question 1" ||
            authCredentials.a2 === "" ||
            authCredentials.q2 === "Your erp question 2" ||
            authCredentials.a3 === "" ||
            authCredentials.q3 === "Your erp question 2";

        if (emptyFieldExists) {
            container.classList.toggle("right-open");
        }

        formToggleBtns.forEach((button) =>
            button.addEventListener("click", () => {
                container.classList.toggle("right-open");
            })
        );

        autologinToggleBtn.addEventListener("change", toggleCheckBox);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            loader.style.display = "flex";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);

            let credentials = {
                autoLogin: true,
                username: username.value,
                q1: a1.placeholder,
                q2: a2.placeholder,
                q3: a3.placeholder,
            };

            if (pin.value) {
                pin.style.display = "none";
                const smallText = document.createElement("small");
                smallText.style = "margin-left: 50px";
                smallText.innerText = "PIN is set!";
                pin.after(smallText);

                const crypto = new WebCrypto();

                let ans1;
                let ans2;
                let ans3;
                let pass;
                if (a1.value) {
                    ans1 = await crypto.encrypt(a1.value, pin.value);
                }

                if (a2.value) {
                    ans2 = await crypto.encrypt(a2.value, pin.value);
                }

                if (a3.value) {
                    ans3 = await crypto.encrypt(a3.value, pin.value);
                }

                if (password.value) {
                    pass = await crypto.encrypt(password.value, pin.value);
                }

                credentials = {
                    ...credentials,
                    requirePin: true,
                    password: pass,
                    a1: ans1,
                    a2: ans2,
                    a3: ans3,
                };
                chrome.storage.local.set({ authCredentials: credentials }, () => location.reload());
            } else {
                credentials = {
                    ...credentials,
                    requirePin: false,
                    password: password.value,
                    a1: a1.value,
                    a2: a2.value,
                    a3: a3.value,
                };
                chrome.storage.local.set({ authCredentials: credentials }, () => location.reload());
            }
        });

        formResetBtn.addEventListener("click", (e) => {
            e.preventDefault();

            logger(
                "Are you sure!",
                "warning",
                true,
                () => {
                    console.log("yes");
                    document.forms[0].reset();
                    // eslint-disable-next-line max-nested-callbacks
                    chrome.storage.local.remove(["authCredentials"], () => {
                        location.reload();
                    });
                },
                () => {
                    logger("Cancelled.");
                }
            );
        });

        username.addEventListener("keyup", (e) => {
            e.preventDefault();

            if (username.value.length !== 9) {
                if (username.value.length === 8 || username.value.length === 10) {
                    questions.forEach((q, i) => {
                        q.placeholder = `Your erp question ${i + 1}`;
                        q.value = "";
                        q.disabled = true;
                    });

                    password.value = "";
                    pin.value = "";

                    password.disabled = true;
                    pin.disabled = true;
                }

                return;
            }
        });

        usernameSubmitBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            logger("Getting questions, wait...");

            const erpUser = new ERP(username.value);
            erpUser.getAllSecurityQues().then((res) => {
                if (res === false) {
                    logger("Invalid RollNo!", "error");
                } else {
                    logger("Questions fetched!", "success");
                    password.removeAttribute("disabled");
                    pin.removeAttribute("disabled");
                    formSubmitBtn.removeAttribute("disabled");
                }
            });

            let idx = 0;
            erpUser.onGetSecurityQues = (q) => {
                questions[idx].removeAttribute("disabled");
                questions[idx].placeholder = q;
                idx++;
            };
        });

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    });
});
