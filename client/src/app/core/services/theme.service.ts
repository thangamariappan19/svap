import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private _isDark = signal<boolean>(true);
    readonly isDark = this._isDark.asReadonly();
    private platformId = inject(PLATFORM_ID);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem('svap_theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const dark = stored ? stored === 'dark' : prefersDark;
            this._isDark.set(dark);
            this.applyTheme(dark);
        }

        effect(() => {
            if (isPlatformBrowser(this.platformId)) {
                this.applyTheme(this._isDark());
            }
        });
    }

    toggle() {
        this._isDark.update(v => !v);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('svap_theme', this._isDark() ? 'dark' : 'light');
        }
    }

    private applyTheme(dark: boolean) {
        if (isPlatformBrowser(this.platformId)) {
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        }
    }
}
