import * as forge from 'node-forge';

const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

export function encryptWithPublicKey(text: string): string {
    const publicKey = keyPair.publicKey;
    const encrypted = publicKey.encrypt(text);

    return forge.util.encode64(encrypted);
}

export function decryptWithPrivateKey(encryptedText: string): string {
    const privateKey = keyPair.privateKey;
    const encrypted = forge.util.decode64(encryptedText);

    return privateKey.decrypt(encrypted);
}