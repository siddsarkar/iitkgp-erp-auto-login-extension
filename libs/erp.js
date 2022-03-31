function ERP(roll) {
    let username = roll || "";
    let password = "";
    const securityQuestions = {};

    this.onGetSecurityQues = function (question) {
        console.log({ question });
    };

    Object.defineProperties(this, {
        username: {
            get() {
                return username;
            },
        },

        // eslint-disable-next-line accessor-pairs
        password: {
            set(pass) {
                password = pass;
            },
        },

        securityQuestions: {
            set(ques) {
                if (ques instanceof Object) {
                    for (const q in ques) {
                        if (Object.keys(securityQuestions).includes(q)) {
                            securityQuestions[q] = ques[q];
                        }
                    }
                }
            },
            get() {
                return securityQuestions;
            },
        },

        data: {
            get() {
                return { username, password, securityQuestions };
            },
        },

        load: {
            value(user) {
                const { username: id, password: pass, securityQuestions: ques } = user;

                if (id) {
                    username = id;
                }

                if (pass) {
                    password = pass;
                }

                if (ques) {
                    for (const q in ques) {
                        if (Object.prototype.hasOwnProperty.call(ques, q)) {
                            securityQuestions[q] = ques[q];
                        }
                    }
                }

                console.info("user loaded:", {
                    username,
                    password,
                    securityQuestions,
                });
            },
        },

        getAllSecurityQues: {
            async value() {
                if (Object.keys(securityQuestions).length >= 3) {
                    return Object.keys(securityQuestions);
                }

                let question;
                try {
                    question = await this.getSecurityQues(username);
                } catch (error) {
                    console.error(error);
                    return false;
                }

                if (question === "FALSE") {
                    console.error(new Error("Invalid username"));
                    return false;
                }

                if (Object.keys(securityQuestions).length < 3) {
                    if (!Object.keys(securityQuestions).includes(question)) {
                        this.onGetSecurityQues(question);
                    }

                    securityQuestions[question] = "";
                    await this.getAllSecurityQues();
                }

                return Object.keys(securityQuestions);
            },
        },

        login: {
            async value(options) {
                let { sessionToken, requestedUrl } = options || {};

                /* Set a default target url */
                if (!requestedUrl) {
                    requestedUrl = "https://erp.iitkgp.ac.in/IIT_ERP3/";
                }

                /* Check login status */
                const isLoggedIn = await this.isLoggedIn(requestedUrl);
                console.log({ isLoggedIn });
                if (isLoggedIn) {
                    return requestedUrl;
                }

                /* Get security question */
                let question;
                try {
                    question = await this.getSecurityQues(username);
                } catch (error) {
                    console.error(error);
                    return false;
                }

                console.log("authSecurityQues:", question);

                /* Pick answer to the security question */
                const answer = securityQuestions[question] || "";

                /* Request for login */
                const redirectedUrl = await this.authRequest({
                    username,
                    password,
                    answer,
                    sessionToken,
                    requestedUrl,
                });

                return redirectedUrl;
            },
        },
    });

    /**
     * Logout user
     * @returns redirected url
     */
    this.logout = async function () {
        const url = "https://erp.iitkgp.ac.in/IIT_ERP3/logout.htm";
        const response = await processRequest(new Request(url));

        if (response.redirected) {
            return response.url;
        }

        Promise.reject(new Error("Logout failed"));
    };

    /**
     * Get user login status
     * @param {string} requestedUrl url to load
     * @returns login status
     */
    this.isLoggedIn = async function (requestedUrl) {
        if (!requestedUrl) {
            requestedUrl = "https://erp.iitkgp.ac.in/IIT_ERP3/";
        }

        const res = await processRequest(new Request(requestedUrl));
        if (!res.redirected) {
            return true;
        }

        return false;
    };

    /**
     * Authentication request
     * @param {{username:string,password:string,answer:string,requestedUrl:string,sessionToken:string}} authcred login credentials
     * @returns redirected url
     */
    this.authRequest = async function (authcred) {
        const { username, password, answer, sessionToken, requestedUrl } = authcred;

        if (!username || !password || !answer) {
            throw new Error("Username or Password or Answer is missing!");
        }

        let body = `user_id=${username}&password=${password}&answer=${answer}`;
        if (sessionToken) {
            body += `&sessionToken=${sessionToken}`;
        }

        if (requestedUrl) {
            body += `&requestedUrl=${requestedUrl}`;
        } else {
            body += "&requestedUrl=https://erp.iitkgp.ac.in/IIT_ERP3/";
        }

        const url = "https://erp.iitkgp.ac.in/SSOAdministration/auth.htm";
        const method = "POST";

        console.log("req_body:", body);

        const response = await processRequest(new Request(url, { method, body }));

        if (response.redirected) {
            return response.url;
        }

        Promise.reject(new Error("Invalid credentials"));
    };

    /**
     * Fetch a security question for rollno
     * @param {string} iitkgploginid institute login id
     * @returns security question
     */
    this.getSecurityQues = async function (iitkgploginid) {
        /* Validate arguments */
        if (!iitkgploginid) {
            throw new Error("Please provide login id");
        }

        const url = "https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm";
        const method = "POST";
        const body = `user_id=${iitkgploginid}`;

        const response = await processRequest(new Request(url, { method, body }));

        return response ? response.text() : "FALSE";
    };

    /**
     * Global http request handler
     * @param {Request} request a request object
     * @returns fetch response
     */
    const processRequest = async function (request) {
        let ts = Date.now();
        const { url, method } = request;
        const { pathname, search } = new URL(url);

        const response = await nativeFetch(request);
        ts -= Date.now();

        console.log(`${method + response.status}: ${-ts}ms ${pathname + search}`);

        if (response.ok && response.status === 200) {
            return response;
        }

        Promise.reject(new Error("Api returned status:", status));
    };

    /**
     * Fetch wrapper
     * @param {Request} request new Request() instance
     * @returns Promise<Response>
     */
    const nativeFetch = function (request) {
        if (request.method === "POST") {
            request.headers.set("Content-type", "application/x-www-form-urlencoded");
        }

        return fetch(request);
    };
}

export default ERP;
