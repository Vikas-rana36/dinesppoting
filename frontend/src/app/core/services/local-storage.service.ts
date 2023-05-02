import { Injectable } from '@angular/core';

import * as SecureLS from 'secure-ls';
var ls = new SecureLS();

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor() { }
    public setItem(key: string, value: string) {       
        ls.set(key, value); 
    }

    public getItem(key: string) {
        return ls.get(key); 
    }
    public removeItem(key: string) {
        ls.remove(key);
    }
    public clear() {       
        ls.removeAll()
    }
}