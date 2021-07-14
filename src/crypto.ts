// eslint-disable-next-line
import { encryptedValidation } from './constants';

const IV = 16;
const ALGORITHM = 'AES-GCM';

export function uint8ArrayToBase64String(array: Uint8Array) {
    // @ts-ignore
    return btoa(String.fromCharCode(...array));
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
    return uint8ArrayToBase64String(new Uint8Array(buffer));
}

export function base64StringToUint8Array(string: string) {
    return new Uint8Array(
        atob(string)
            .split('')
            .map((c) => {
                return c.charCodeAt(0);
            })
    );
}

const rawSalt = new Uint8Array([105, 51, 114, 88, 66, 177, 134, 177, 111, 198, 93, 241, 250, 203, 226, 191]);

export async function getDerivation(password: string, iterations = 339616) {
    const textEncoder = new TextEncoder();
    const passwordBuffer = textEncoder.encode(password);
    const importedKey = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveBits']);

    return crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            hash: 'SHA-256',
            salt: rawSalt,
            iterations,
        },
        importedKey,
        256
    );
}

export async function encrypt(key: CryptoKey, message: string) {
    const messageBuffer = new TextEncoder().encode(message);
    let encryptedMessage = await window.crypto.subtle.encrypt(
        {
            name: ALGORITHM,
            iv: base64StringToUint8Array(encryptedValidation.iv),
        },
        key,
        messageBuffer
    );
    return arrayBufferToBase64(encryptedMessage);
}

export async function decrypt(key: CryptoKey, message: string) {
    try {
        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: ALGORITHM,
                iv: base64StringToUint8Array(encryptedValidation.iv),
            },
            key,
            base64StringToUint8Array(message)
        );
        return new TextDecoder().decode(decryptedContent);
    } catch (error) {
        console.log('error: ', error);
    }
}

export async function validateMasterPassword(key: CryptoKey, { iv, cipher }: { iv: string; cipher: string }) {
    try {
        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: ALGORITHM,
                iv: base64StringToUint8Array(iv),
            },
            key,
            base64StringToUint8Array(cipher)
        );
        return 'ok' === new TextDecoder().decode(decryptedContent);
    } catch (error) {
        console.log('error: ', error);
    }
    return false;
}

export async function getKey(rawKey: ArrayBuffer) {
    return window.crypto.subtle.importKey('raw', rawKey, ALGORITHM, false, ['encrypt', 'decrypt']);
}
