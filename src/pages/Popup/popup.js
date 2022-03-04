// eslint-disable-next-line max-params
function logger(
	message,
	type = 'info',
	actions = false,
	onClickYes = () => {},
	onclickCancel = () => {},
) {
	const log = document.getElementById('log');
	const logIcon = document.getElementById('logIcon');
	const logText = document.getElementById('logText');

	const status = document.getElementById('status');
	const statusIcon = document.getElementById('statusIcon');
	const statusText = document.getElementById('statusText');

	let iconId;
	log.className = type;

	status.style.backgroundColor = 'yellow';
	switch (type) {
		case 'warning':
			iconId = 'warning';
			break;
		case 'error':
			iconId = 'cross';
			break;
		case 'success':
			iconId = 'check';
			status.style.backgroundColor = 'green';
			break;

		default:
			iconId = 'info';
			break;
	}

	logText.textContent = message;
	logIcon.setAttribute(
		'href',
		chrome.runtime.getURL(`/assets/sprite.svg#${iconId || 'info'}`),
	);

	statusText.textContent = message;
	statusIcon.setAttribute(
		'href',
		chrome.runtime.getURL(`/assets/sprite.svg#${iconId || 'info'}`),
	);

	if (actions) {
		// Removes previous actions
		document.querySelectorAll('.action').forEach(el => el.remove());

		const actionBtnYes = document.createElement('div');
		actionBtnYes.className = 'action';
		actionBtnYes.textContent = 'Yes';

		const actionBtnCancel = document.createElement('div');
		actionBtnCancel.className = 'action';
		actionBtnCancel.textContent = 'Cancel';

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

function ERP(roll) {
	if (
		!/^[0-9]{2}[a-z|A-Z]{2}[0-9|a-zA-Z][a-z|A-Z0-9]{2}[0-9]{2}$/.exec(roll)
	) {
		throw new Error('Please input a valid Roll Number!');
	}

	let username = roll;
	let password = '';
	const securityQuestions = {};

	this.onGetSecurityQues = function (question) {
		console.log({question});
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
				return {username, password, securityQuestions};
			},
		},

		load: {
			value(user) {
				const {
					username: id,
					password: pass,
					securityQuestions: ques,
				} = user;

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

				console.info('user loaded:', {
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

				if (question === 'FALSE') {
					console.error(new Error('Invalid username'));
					return false;
				}

				if (Object.keys(securityQuestions).length < 3) {
					if (!Object.keys(securityQuestions).includes(question)) {
						this.onGetSecurityQues(question);
					}

					securityQuestions[question] = '';
					await this.getAllSecurityQues();
				}

				return Object.keys(securityQuestions);
			},
		},

		login: {
			async value(options) {
				let {sessionToken, requestedUrl} = options || {};

				/* Set a default target url */
				if (!requestedUrl) {
					requestedUrl = 'https://erp.iitkgp.ac.in/IIT_ERP3/';
				}

				/* Check login status */
				const isLoggedIn = await this.isLoggedIn(requestedUrl);
				console.log({isLoggedIn});
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

				console.log('authSecurityQues:', question);

				/* Pick answer to the security question */
				const answer = securityQuestions[question] || '';

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
		const url = 'https://erp.iitkgp.ac.in/IIT_ERP3/logout.htm';
		const response = await processRequest(new Request(url));

		if (response.redirected) {
			return response.url;
		}

		Promise.reject(new Error('Logout failed'));
	};

	/**
     * Get user login status
     * @param {string} requestedUrl url to load
     * @returns login status
     */
	this.isLoggedIn = async function (requestedUrl) {
		if (!requestedUrl) {
			requestedUrl = 'https://erp.iitkgp.ac.in/IIT_ERP3/';
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
		const {username, password, answer, sessionToken, requestedUrl}
            = authcred;

		if (!username || !password || !answer) {
			throw new Error('Username or Password or Answer is missing!');
		}

		let body = `user_id=${username}&password=${password}&answer=${answer}`;
		if (sessionToken) {
			body += `&sessionToken=${sessionToken}`;
		}

		if (requestedUrl) {
			body += `&requestedUrl=${requestedUrl}`;
		} else {
			body += '&requestedUrl=https://erp.iitkgp.ac.in/IIT_ERP3/';
		}

		const url = 'https://erp.iitkgp.ac.in/SSOAdministration/auth.htm';
		const method = 'POST';

		console.log('req_body:', body);

		const response = await processRequest(
			new Request(url, {method, body}),
		);

		if (response.redirected) {
			return response.url;
		}

		Promise.reject(new Error('Invalid credentials'));
	};

	/**
     * Fetch a security question for rollno
     * @param {string} iitkgploginid institute login id
     * @returns security question
     */
	this.getSecurityQues = async function (iitkgploginid) {
		/* Validate arguments */
		if (!iitkgploginid) {
			throw new Error('Please provide login id');
		}

		const url
            = 'https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm';
		const method = 'POST';
		const body = `user_id=${iitkgploginid}`;

		const response = await processRequest(
			new Request(url, {method, body}),
		);

		return response ? response.text() : 'FALSE';
	};

	/**
     * Global http request handler
     * @param {Request} request a request object
     * @returns fetch response
     */
	const processRequest = async function (request) {
		let ts = Date.now();
		const {url, method} = request;
		const {pathname, search} = new URL(url);

		const response = await nativeFetch(request);
		ts -= Date.now();

		console.log(
			`${method + response.status}: ${-ts}ms ${pathname + search}`,
		);

		if (response.ok && response.status === 200) {
			return response;
		}

		Promise.reject(new Error('Api returned status:', status));
	};

	/**
     * Fetch wrapper
     * @param {Request} request new Request() instance
     * @returns Promise<Response>
     */
	const nativeFetch = function (request) {
		if (request.method === 'POST') {
			request.headers.set(
				'Content-type',
				'application/x-www-form-urlencoded',
			);
		}

		return fetch(request);
	};
}

function WebCrypto() {
	const buffToBase64 = buff => btoa(String.fromCharCode.apply(null, buff));
	const base64ToBuff = b64 =>
		Uint8Array.from(atob(b64), c => c.charCodeAt(null));

	const enc = new TextEncoder();
	const dec = new TextDecoder();
	const bytes = {salt: 16, iv: 12};

	/**
     * Returns a key generated from password,
     * use it as input to the deriveKey method.
     *
     * @param {string|number} password password for encryption/decryption
     * @returns a key
     */
	function getKeyFromPassword(password) {
		return window.crypto.subtle.importKey(
			'raw',
			enc.encode(password),
			{name: 'PBKDF2'},
			false,
			['deriveBits', 'deriveKey'],
		);
	}

	/**
     * Given some key from password and some random salt,
     * returns a derived AES-GCM key using PBKDF2.
     *
     * @param {CryptoKey} keyFromPassword Key generated from password
     * @param {Uint8Array} salt random generated salt
     * @returns derived key
     */
	function getKey(keyFromPassword, salt) {
		return window.crypto.subtle.deriveKey(
			{
				name: 'PBKDF2',
				salt,
				iterations: 100000,
				hash: 'SHA-256',
			},
			keyFromPassword,
			{name: 'AES-GCM', length: 256},
			true,
			['encrypt', 'decrypt'],
		);
	}

	/**
     * Derive a key from a password supplied by the user,
     * use the key to encrypt the secret data,
     * return the combined encrypted data as string.
     *
     * @param {string|number} secret secret data to encrypt
     * @param {string|number} password password for encryption
     * @returns encrypted string
     */
	this.encrypt = async (secret, password) => {
		const keyFromPassword = await getKeyFromPassword(password);
		const salt = window.crypto.getRandomValues(new Uint8Array(bytes.salt));
		const key = await getKey(keyFromPassword, salt);
		const iv = window.crypto.getRandomValues(new Uint8Array(bytes.iv));
		const encoded = enc.encode(secret);

		const ciphertext = await window.crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv,
			},
			key,
			encoded,
		);

		const cipher = new Uint8Array(ciphertext);
		const buffer = new Uint8Array(
			salt.byteLength + iv.byteLength + cipher.byteLength,
		);
		buffer.set(salt, 0);
		buffer.set(iv, salt.byteLength);
		buffer.set(cipher, salt.byteLength + iv.byteLength);

		const encrypted = buffToBase64(buffer);
		return encrypted;
	};

	/**
     * Derive a key from a password supplied by the user,
     * use the key to decrypt the ciphertext.
     * if the ciphertext was decrypted successfully,
     *   return the decrypted value.
     * if there was an error decrypting,
     *   throw an error message.
     *
     * @param {string} encrypted encrypted base64 string
     * @param {string|number} password password for the encrypted data
     * @returns decrypted data as string
     */
	this.decrypt = async (encrypted, password) => {
		const encryptedBuffer = base64ToBuff(encrypted);
		const salt = encryptedBuffer.slice(0, bytes.salt);
		const iv = encryptedBuffer.slice(bytes.salt, bytes.salt + bytes.iv);
		const ciphertext = encryptedBuffer.slice(bytes.salt + bytes.iv);

		const keyFromPassword = await getKeyFromPassword(password);
		const key = await getKey(keyFromPassword, salt);

		try {
			const decryptedEncoded = await window.crypto.subtle.decrypt(
				{
					name: 'AES-GCM',
					iv,
				},
				key,
				ciphertext,
			);

			const decrypted = dec.decode(decryptedEncoded);
			return decrypted;
		} catch (e) {
			throw new Error(e);
		}
	};
}

const toggleCheckBox = e => {
	const {target} = e;
	chrome.storage.local.get(['authCredentials'], result => {
		if (result.authCredentials) {
			console.log(
				`curr ${target.id}:`,
				result.authCredentials[target.id],
			);
			chrome.storage.local.set(
				{
					authCredentials: {
						...result.authCredentials,
						[target.id]: !result.authCredentials[target.id],
					},
				},
				() => {
					console.log(
						`set ${target.id} to:`,
						!result.authCredentials[target.id],
					);

					target.checked = !result.authCredentials[target.id];
				},
			);
		}
	});
};

/* Intialize Theme */
chrome.storage.local.get(['theme', 'bg'], result => {
	const themeSelect = document.getElementById('theme_select');
	const themeBg = document.getElementById('theme-bg');

	if (
		result.theme === 'dark'
        || (!('theme' in result)
            && window.matchMedia('(prefers-color-scheme: dark)').matches)
	) {
		document.documentElement.classList.add('dark');
		themeSelect.value = 'dark';
	} else {
		document.documentElement.classList.remove('dark');
		themeSelect.value = 'light';
	}

	if (result.bg === 'yes') {
		document.body.classList.toggle('pride-theme');
		themeBg.checked = true;
	} else {
		themeBg.checked = false;
	}

	themeBg.onchange = ev => {
		document.body.classList.toggle('pride-theme');
		chrome.storage.local.set({bg: ev.target.checked ? 'yes' : 'no'});
	};

	themeSelect.onchange = ev => {
		document.documentElement.classList.toggle('dark');
		chrome.storage.local.set({theme: ev.target.value});
	};
});

window.addEventListener('DOMContentLoaded', () => {
	let authCredentials = {
		requirePin: false,
		autoLogin: true,
		username: '',
		password: '',
		q1: '',
		q2: '',
		q3: '',
		a1: '',
		a2: '',
		a3: '',
	};

	// eslint-disable-next-line complexity
	chrome.storage.local.get(['authCredentials'], result => {
		if (result.authCredentials) {
			authCredentials = result.authCredentials;
		}

		console.log(authCredentials);

		const autologinToggleBtn = document.getElementById('autoLogin');
		const loader = document.getElementById('loader');
		const form = document.getElementById('form_add_user');
		const formResetBtn = document.getElementById('reset_form');
		const formSubmitBtn = document.getElementById('submit_form');
		const username = document.getElementById('username');
		const password = document.getElementById('password');
		const a1 = document.getElementById('question_one');
		const a2 = document.getElementById('question_two');
		const a3 = document.getElementById('question_three');
		const pin = document.getElementById('pin');
		const questions = document.querySelectorAll('input[name=\'question\']');

		// Extras
		const container = document.querySelector('.box-container');
		const formToggleBtns = document.querySelectorAll(
			'.left-button,.right-button',
		);

		username.value = authCredentials.username || '';
		password.value = authCredentials.password || '';
		a1.value = authCredentials.a1 || '';
		a2.value = authCredentials.a2 || '';
		a3.value = authCredentials.a3 || '';
		a1.placeholder = authCredentials.q1 || 'Your erp question 1';
		a2.placeholder = authCredentials.q2 || 'Your erp question 2';
		a3.placeholder = authCredentials.q3 || 'Your erp question 3';
		autologinToggleBtn.checked = authCredentials.autoLogin;

		if (authCredentials.requirePin) {
			pin.style.display = 'none';
			const smallText = document.createElement('small');
			smallText.style = 'margin-left: 50px';
			smallText.innerText = 'PIN is set!';
			pin.after(smallText);
		}

		if (authCredentials.username === '') {
			logger('Enter Roll Number');
			username.removeAttribute('disabled');
		} else if (authCredentials.password === '') {
			logger('Enter Password', 'warning');
			password.removeAttribute('disabled');
			password.addEventListener('keyup', () => {
				a1.removeAttribute('disabled');
				a2.removeAttribute('disabled');
				a3.removeAttribute('disabled');
				logger('Enter security answers!', 'warning');
			});
			password.removeEventListener('keyup', null);
		} else if (a1.value !== '' && a2.value !== '' && a3.value !== '') {
			a1.disabled = true;
			a2.disabled = true;
			a3.disabled = true;
			logger(`You are all set! ${authCredentials.username}`, 'success');
		} else {
			logger('Fill security answers!', 'warning');
			a1.disabled = false;
			a2.disabled = false;
			a3.disabled = false;
		}

		const emptyFieldExists
            = authCredentials.username === ''
            || authCredentials.password === ''
            || authCredentials.a1 === ''
            || authCredentials.q1 === 'Your erp question 1'
            || authCredentials.a2 === ''
            || authCredentials.q2 === 'Your erp question 2'
            || authCredentials.a3 === ''
            || authCredentials.q3 === 'Your erp question 2';

		if (emptyFieldExists) {
			container.classList.toggle('right-open');
		}

		formToggleBtns.forEach(button =>
			button.addEventListener('click', () => {
				container.classList.toggle('right-open');
			}),
		);

		autologinToggleBtn.addEventListener('change', toggleCheckBox);

		form.addEventListener('submit', async e => {
			e.preventDefault();

			loader.style.display = 'flex';
			setTimeout(() => {
				loader.style.display = 'none';
			}, 500);

			let credentials = {
				autoLogin: true,
				username: username.value,
				q1: a1.placeholder,
				q2: a2.placeholder,
				q3: a3.placeholder,
			};

			if (pin.value) {
				pin.style.display = 'none';
				const smallText = document.createElement('small');
				smallText.style = 'margin-left: 50px';
				smallText.innerText = 'PIN is set!';
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
				chrome.storage.local.set({authCredentials: credentials}, () =>
					location.reload(),
				);
			} else {
				credentials = {
					...credentials,
					requirePin: false,
					password: password.value,
					a1: a1.value,
					a2: a2.value,
					a3: a3.value,
				};
				chrome.storage.local.set({authCredentials: credentials}, () =>
					location.reload(),
				);
			}
		});

		formResetBtn.addEventListener('click', e => {
			e.preventDefault();

			logger(
				'Are you sure!',
				'warning',
				true,
				() => {
					console.log('yes');
					document.forms[0].reset();
					// eslint-disable-next-line max-nested-callbacks
					chrome.storage.local.remove(['authCredentials'], () => {
						location.reload();
					});
				},
				() => {
					logger('Cancelled.');
				},
			);
		});

		username.addEventListener('keyup', _ => {
			if (username.value.length !== 9) {
				if (
					username.value.length === 8
                    || username.value.length === 10
				) {
					questions.forEach((q, i) => {
						q.placeholder = `Your erp question ${i + 1}`;
						q.value = '';
						q.disabled = true;
					});

					password.value = '';
					pin.value = '';

					password.disabled = true;
					pin.disabled = true;
				}

				return;
			}

			const re
                = /[0-9]{2}[a-z|A-Z]{2}[0-9|a-z|A-Z]{1}[a-z|A-Z|0-9]{2}[0-9]{2}/; // ? regex for IITKGP ROLL-NUMBERS (18mi10018-19mi3pe03)
			const OK = re.exec(username.value);

			if (OK) {
				logger('Getting questions, wait...');
				const erpUser = new ERP(OK[0]);
				erpUser.getAllSecurityQues().then(res => {
					if (res === false) {
						logger('Invalid RollNo!', 'error');
					} else {
						logger('Questions fetched!', 'success');
						password.removeAttribute('disabled');
						pin.removeAttribute('disabled');
						formSubmitBtn.removeAttribute('disabled');
					}
				});
				let idx = 0;
				erpUser.onGetSecurityQues = q => {
					questions[idx].removeAttribute('disabled');
					questions[idx].placeholder = q;
					idx++;
				};
			} else {
				logger('Invalid RollNo!', 'error');
			}
		});

		setTimeout(() => {
			loader.style.display = 'none';
		}, 500);
	});
});
