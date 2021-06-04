import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

@Injectable()
export class CryptoService {
    _salt: string = "81fcc8ad-027f-4ca2-b2a4-bbfdd9b7a37e";
    constructor() { }

    encrypt(value: string): string {
        const encryptedString = crypto.AES.encrypt(value, this._salt).toString();
        return encryptedString;
    }

    decrypt(value: string): string {
        const decryptedString = crypto.AES.decrypt(value, this._salt);
        const plaintext = decryptedString.toString(crypto.enc.Utf8);
        return plaintext;
    }
}