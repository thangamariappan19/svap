import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled()">
      <div class="container nav-inner">
        <!-- Logo -->
        <a routerLink="/" class="nav-logo">
          <span class="logo-icon">✈️</span>
          <span class="logo-text">Smart<span class="logo-accent">Visa</span></span>
        </a>

        <!-- Desktop Nav Links -->
        <ul class="nav-links hide-mobile">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">Home</a></li>
          <li><a routerLink="/checklist" routerLinkActive="active" class="nav-link">Checklist</a></li>
          <li><a routerLink="/guide" routerLinkActive="active" class="nav-link">Guide</a></li>
          <li><a routerLink="/chat" routerLinkActive="active" class="nav-link">AI Chat</a></li>
          <li><a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a></li>
        </ul>

        <!-- Right Actions -->
        <div class="nav-actions">
          <button class="theme-toggle" (click)="themeService.toggle()" [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
            <span>{{ themeService.isDark() ? '☀️' : '🌙' }}</span>
          </button>
          <a routerLink="/dashboard" class="btn btn-primary btn-sm hide-mobile">
            <span>Track Application</span>
          </a>
          <button class="hamburger hide-desktop" (click)="mobileOpen.set(!mobileOpen())" aria-label="Toggle menu">
            <span class="bar" [class.open]="mobileOpen()"></span>
            <span class="bar" [class.open]="mobileOpen()"></span>
            <span class="bar" [class.open]="mobileOpen()"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileOpen()">
        <a routerLink="/" class="mobile-link" (click)="mobileOpen.set(false)">🏠 Home</a>
        <a routerLink="/checklist" class="mobile-link" (click)="mobileOpen.set(false)">📋 Checklist</a>
        <a routerLink="/guide" class="mobile-link" (click)="mobileOpen.set(false)">📖 Step-by-Step Guide</a>
        <a routerLink="/chat" class="mobile-link" (click)="mobileOpen.set(false)">🤖 AI Chat Assistant</a>
        <a routerLink="/dashboard" class="mobile-link" (click)="mobileOpen.set(false)">📊 Dashboard</a>
        <a routerLink="/dashboard" class="btn btn-primary" style="margin-top:1rem" (click)="mobileOpen.set(false)">Track Application</a>
      </div>
    </nav>
    <div class="mobile-overlay" [class.visible]="mobileOpen()" (click)="mobileOpen.set(false)"></div>
  `,

  styles: [`
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      height: var(--navbar-height);
      background: transparent;
      transition: all var(--transition-normal);
    }
    .navbar.scrolled {
      background: var(--bg-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-glass);
      box-shadow: var(--shadow-md);
    }
    .nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: 100%;
    }
    .nav-logo {
      display: flex; align-items: center; gap: 0.5rem;
      text-decoration: none; font-family: var(--font-display);
    }
    .logo-icon { font-size: 1.5rem; }
    .logo-text { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
    .logo-accent { color: var(--primary-400); }
    .nav-links {
      display: flex; align-items: center; gap: 0.25rem;
      list-style: none;
    }
    .nav-link {
      padding: 0.5rem 1rem; border-radius: var(--radius-full);
      font-size: 0.9375rem; font-weight: 500; color: var(--text-secondary);
      text-decoration: none; transition: all var(--transition-fast);
    }
    .nav-link:hover, .nav-link.active {
      color: var(--primary-400); background: var(--bg-glass-dark);
    }
    .nav-actions { display: flex; align-items: center; gap: 0.75rem; }
    .theme-toggle {
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--bg-glass); border: 1px solid var(--border-glass);
      cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;
      transition: all var(--transition-fast);
    }
    .theme-toggle:hover { transform: scale(1.1); background: var(--bg-glass-dark); }
    .hamburger {
      display: flex; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 4px;
    }
    .bar {
      width: 24px; height: 2px; background: var(--text-primary);
      border-radius: 2px; transition: all var(--transition-fast);
    }
    .mobile-menu {
      position: fixed; top: var(--navbar-height); left: 0; right: 0;
      display: none; flex-direction: column; gap: 0.5rem;
      padding: 1rem 1.5rem 2rem;
      background: var(--bg-glass); backdrop-filter: blur(20px);
      border-top: 1px solid var(--border-glass);
      box-shadow: var(--shadow-xl);
      transform: translateY(-10px); opacity: 0; transition: all 0.3s ease;
      pointer-events: none;
    }
    .mobile-menu.open { display: flex; transform: translateY(0); opacity: 1; pointer-events: auto; }
    .mobile-link {
      padding: 0.875rem 1.25rem; border-radius: var(--radius-md);
      font-weight: 500; color: var(--text-primary); text-decoration: none;
      display: flex; align-items: center; gap: 0.75rem;
      transition: background var(--transition-fast);
    }
    .mobile-link:hover { background: var(--bg-glass-dark); color: var(--primary-400); }
    
    .mobile-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
    }
    .mobile-overlay.visible { opacity: 1; pointer-events: auto; }

    @media (min-width: 641px) {
      .hide-desktop { display: none !important; }
      .mobile-overlay { display: none; }
    }
    @media (max-width: 640px) {
      .hide-mobile { display: none !important; }
    }

  `]
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  scrolled = signal(false);
  mobileOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 20); }
}
