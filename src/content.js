/* Helpers */

function displayMessage(message, color = '#45a1ff') {
	if (document.getElementById('message')) {
		document.getElementById('message').remove();
	}

	const msg = document.createElement('div');
	msg.id = 'message';
	msg.setAttribute(
		'style',
		`background: ${color};color: #ffffff;font-weight:500; width:100%; height:35px; text-align: center;display:flex; justify-content: center; align-items: center;flex-direction:row`,
	);
	msg.textContent = message;
	document.body.prepend(msg);
}

function extractToken(str, tokenName) {
	const m = str.match(/[#?](.*)/);
	if (!m || m.length < 1) {
		return null;
	}

	const params = new URLSearchParams(m[1].split('#')[0]);
	return params.get(tokenName);
}

/* Utils */

async function authRequest({
	username,
	password,
	answer,
	requestedUrl,
	sessionToken,
}) {
	const params = `user_id=${username}&password=${password}&answer=${answer}&requestedUrl=${requestedUrl}&sessionToken=${sessionToken}`;
	const requestURL
        = 'https://erp.iitkgp.ac.in/SSOAdministration/auth.htm';
	const requestHeaders = new Headers();
	requestHeaders.append(
		'Content-type',
		'application/x-www-form-urlencoded',
	);

	const driveRequest = new Request(requestURL, {
		method: 'POST',
		headers: requestHeaders,
		body: params,
	});

	const response = await fetch(driveRequest);
	if (response.ok && response.status === 200) {
		return response;
	}

	throw response.status;
}

function WebCrypto() {
	const buffToBase64 = buff => btoa(String.fromCharCode.apply(null, buff));
	const base64ToBuff = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(null));

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

async function getSecurityQues(username) {
	const params = `user_id=${username}`;
	const requestURL
        = 'https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm';
	const requestHeaders = new Headers();
	requestHeaders.append(
		'Content-type',
		'application/x-www-form-urlencoded',
	);

	const driveRequest = new Request(requestURL, {
		method: 'POST',
		headers: requestHeaders,
		body: params,
	});

	const response = await fetch(driveRequest);
	if (response.ok && response.status === 200) {
		return response.text();
	}

	throw response.status;
}

const crypto = new WebCrypto();

async function exec(res) {
	if (!res.authCredentials) {
		return displayMessage(
			'You have extension to automatic login. Please fill it',
			'#715100',
		);
	}

	const {authCredentials} = res;
	const {requirePin} = authCredentials;
	let pin;

	if (!authCredentials.autoLogin) {
		return displayMessage(
			'Automatic login is turned off!',
			'#4a4a4f',
		);
	}

	if (
		authCredentials.username === ''
        || authCredentials.password === ''
        || authCredentials.q1 === 'Your erp question 1'
        || authCredentials.q2 === 'Your erp question 2'
        || authCredentials.q3 === 'Your erp question 3'
        || authCredentials.a1 === ''
        || authCredentials.a2 === ''
        || authCredentials.a3 === ''
	) {
		if (authCredentials.partialFill) {
			/* Fill partially filled data */
			return chrome.runtime.sendMessage({
				action: 'auto_fill',
			});
		}

		return;
	}

	if (
		authCredentials.username !== ''
        && authCredentials.password !== ''
        && authCredentials.q1 !== 'Your erp question 1'
        && authCredentials.q2 !== 'Your erp question 2'
        && authCredentials.q3 !== 'Your erp question 3'
        && authCredentials.a1 !== ''
        && authCredentials.a2 !== ''
        && authCredentials.a3 !== ''
	) {
		displayMessage('Logging you in! please wait...');
	}

	if (authCredentials.requirePin) {
		// eslint-disable-next-line no-alert
		pin = prompt('Enter your 4 digit PIN');
	}

	const ssToken = extractToken(
		window.location.search,
		'sessionToken',
	);
	const rURL = extractToken(
		window.location.search,
		'requestedUrl',
	);
	let ans;
	let password;

	const str = await getSecurityQues(authCredentials.username);
	if (str === 'FALSE') {
		displayMessage(
			'Invalid username/password set! Please update your credentials',
			'#a4000f',
		);
	} else {
		if (requirePin) {
			try {
				password = await crypto.decrypt(
					authCredentials.password,
					pin,
				);
			} catch (_) {
				return displayMessage(
					'Invorrect PIN!, Please reset if forgot or refresh page to retry.',
					'#a4000f',
				);
			}
		} else {
			password = authCredentials.password;
		}

		if (str === authCredentials.q1) {
			ans = requirePin
				? await crypto.decrypt(authCredentials.a1, pin)
				: authCredentials.a1;
		} else if (str === authCredentials.q2) {
			ans = requirePin
				? await crypto.decrypt(authCredentials.a2, pin)
				: authCredentials.a2;
		} else {
			ans = requirePin
				? await crypto.decrypt(authCredentials.a3, pin)
				: authCredentials.a3;
		}

		const result = await authRequest({
			username: authCredentials.username,
			password,
			answer: ans,
			sessionToken: ssToken,
			requestedUrl: rURL,
		});

		if (
			result.status === 200
            && result.statusText === 'OK'
            && result.redirected
		) {
			location.href = result.url;
		} else {
			displayMessage(
				'Wrong credentials set! Please update your credentials',
				'#a4000f',
			);
		}
	}
}

chrome.storage.local.get(['authCredentials'], exec);
