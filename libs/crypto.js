function WebCrypto() {
    const buffToBase64 = (buff) => btoa(String.fromCharCode.apply(null, buff));
    const base64ToBuff = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(null));

    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const bytes = { salt: 16, iv: 12 };

    /**
     * Returns a key generated from password,
     * use it as input to the deriveKey method.
     *
     * @param {string|number} password password for encryption/decryption
     * @returns a key
     */
    function getKeyFromPassword(password) {
        return window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
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
                name: "PBKDF2",
                salt,
                iterations: 100000,
                hash: "SHA-256",
            },
            keyFromPassword,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
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
                name: "AES-GCM",
                iv,
            },
            key,
            encoded
        );

        const cipher = new Uint8Array(ciphertext);
        const buffer = new Uint8Array(salt.byteLength + iv.byteLength + cipher.byteLength);
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
                    name: "AES-GCM",
                    iv,
                },
                key,
                ciphertext
            );

            const decrypted = dec.decode(decryptedEncoded);
            return decrypted;
        } catch (e) {
            throw new Error(e);
        }
    };
}

export default WebCrypto;
