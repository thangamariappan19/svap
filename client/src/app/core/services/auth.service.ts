import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private platformId = inject(PLATFORM_ID);
    private router = inject(Router);

    private _user = signal<any>(null);
    private _token = signal<string | null>(null);

    readonly user = this._user.asReadonly();
    readonly token = this._token.asReadonly();
    readonly isAuthenticated = signal(false);

    constructor() {
        this.loadToken();
    }

    private loadToken() {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('svap_token');
            const user = localStorage.getItem('svap_user');
            if (token && user) {
                this._token.set(token);
                this._user.set(JSON.parse(user));
                this.isAuthenticated.set(true);
            }
        }
    }

    login(userData: any, token: string) {
        this._user.set(userData);
        this._token.set(token);
        this.isAuthenticated.set(true);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('svap_token', token);
            localStorage.setItem('svap_user', JSON.stringify(userData));
        }
    }

    logout() {
        this._user.set(null);
        this._token.set(null);
        this.isAuthenticated.set(false);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('svap_token');
            localStorage.removeItem('svap_user');
        }
        this.router.navigate(['/']);
    }
}
