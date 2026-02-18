import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <span class="logo-icon">✈️</span>
          <span class="logo-text">Smart<span class="logo-accent">Visa</span> Assistant</span>
        </div>
        <p class="footer-tagline">Simplifying visa journeys for travelers worldwide</p>
        <div class="footer-links">
          <a href="/">Home</a>
          <a href="/checklist">Checklist</a>
          <a href="/guide">Guide</a>
          <a href="/chat">AI Chat</a>
          <a href="/dashboard">Dashboard</a>
        </div>
        <p class="footer-copy">© 2026 Smart Visa Assistant. For informational purposes only. Always verify with official embassy websites.</p>
      </div>
    </footer>
  `,
  styles: [`
    main { min-height: 100vh; }
    .footer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      padding: 3rem 0 2rem;
      text-align: center;
    }
    .footer-inner { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .footer-brand { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-display); }
    .logo-icon { font-size: 1.5rem; }
    .logo-text { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
    .logo-accent { color: var(--primary-400); }
    .footer-tagline { color: var(--text-muted); font-size: 0.9375rem; }
    .footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
    .footer-links a { color: var(--text-secondary); font-size: 0.9375rem; transition: color var(--transition-fast); }
    .footer-links a:hover { color: var(--primary-400); }
    .footer-copy { font-size: 0.8125rem; color: var(--text-muted); max-width: 600px; }
  `]
})
export class App implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit() {
    // ThemeService initializes theme on construction
  }
}
