import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisaDataService } from '../../core/services/visa-data.service';
import { Country } from '../../core/models/visa.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">

      <!-- ── Hero Section ── -->
      <section class="hero">
        <div class="hero-bg">
          <div class="hero-orb orb-1"></div>
          <div class="hero-orb orb-2"></div>
          <div class="hero-orb orb-3"></div>
        </div>
        <div class="container hero-content">
          <div class="hero-badge">
            <span class="badge badge-primary">🤖 AI-Powered Visa Guidance</span>
          </div>
          <h1 class="hero-title">
            Your Smart Visa<br>
            <span class="text-gradient">Journey Starts Here</span>
          </h1>
          <p class="hero-subtitle">
            Simplify international travel with AI-powered visa guidance, personalized document checklists, and real-time application tracking — all in one place.
          </p>

          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input
                type="text"
                class="search-input"
                placeholder="Search destination country (e.g., Singapore, Japan, USA...)"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearch($event)"
                id="country-search"
              />
              @if (searchQuery) {
                <button class="search-clear" (click)="clearSearch()">✕</button>
              }
            </div>
            <div class="search-tags">
              @for (tag of quickSearches; track tag) {
                <button class="chip" (click)="quickSearch(tag)">{{ tag }}</button>
              }
            </div>
          </div>

          <!-- Stats Row -->
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="stat-num">{{ stats.totalCountries }}+</span>
              <span class="stat-lbl">Countries</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="stat-num">{{ stats.eVisaCountries }}</span>
              <span class="stat-lbl">eVisa Available</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="stat-num">{{ stats.onArrivalCountries }}</span>
              <span class="stat-lbl">Visa on Arrival</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="stat-num">24/7</span>
              <span class="stat-lbl">AI Support</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Country Grid ── -->
      <section class="section countries-section">
        <div class="container">
          <!-- Region Filter -->
          <div class="section-header">
            <div>
              <h2>Explore Destinations</h2>
              <p>Select a country to view visa requirements, fees, and application guide</p>
            </div>
            <div class="region-filters">
              @for (region of visaDataService.regions(); track region) {
                <button
                  class="chip"
                  [class.active]="visaDataService.selectedRegion() === region"
                  (click)="visaDataService.setRegion(region)"
                >{{ region }}</button>
              }
            </div>
          </div>

          <!-- Country Cards -->
          @if (visaDataService.filteredCountries().length > 0) {
            <div class="countries-grid">
              @for (country of visaDataService.filteredCountries(); track country.id; let i = $index) {
                <a [routerLink]="['/country', country.id]" class="country-card" [style.animation-delay]="(i * 0.05) + 's'">
                  <div class="country-flag">{{ country.flag }}</div>
                  <div class="country-info">
                    <h3 class="country-name">{{ country.name }}</h3>
                    <p class="country-region">{{ country.region }}</p>
                    <div class="country-tags">
                      @if (country.visaTypes[0]?.eVisa) {
                        <span class="badge badge-success">eVisa</span>
                      }
                      @if (country.visaTypes[0]?.onArrival) {
                        <span class="badge badge-warning">On Arrival</span>
                      }
                      <span class="badge badge-primary">{{ country.visaTypes.length }} Visa Type{{ country.visaTypes.length > 1 ? 's' : '' }}</span>
                    </div>
                    <div class="country-meta">
                      <span>⏱ {{ country.visaTypes[0]?.processingTime }}</span>
                      <span>💰 {{ country.visaTypes[0]?.feeCurrency }} {{ country.visaTypes[0]?.fee }}</span>
                    </div>
                  </div>
                  <span class="country-arrow">→</span>
                </a>
              }
            </div>
          } @else {
            <div class="empty-state">
              <span class="empty-icon">🌍</span>
              <h3>No countries found</h3>
              <p>Try a different search term or region filter</p>
              <button class="btn btn-primary" (click)="clearSearch()">Clear Search</button>
            </div>
          }
        </div>
      </section>

      <!-- ── Features Section ── -->
      <section class="section features-section">
        <div class="container">
          <div class="section-header centered">
            <h2>Everything You Need for a Smooth Visa Journey</h2>
            <p>From research to approval — we guide you every step of the way</p>
          </div>
          <div class="features-grid">
            @for (feature of features; track feature.title) {
              <div class="feature-card glass-card">
                <div class="feature-icon">{{ feature.icon }}</div>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
                <a [routerLink]="feature.link" class="feature-link">{{ feature.cta }} →</a>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ── How It Works ── -->
      <section class="section how-section">
        <div class="container">
          <div class="section-header centered">
            <h2>How It Works</h2>
            <p>Get your visa sorted in 4 simple steps</p>
          </div>
          <div class="steps-grid">
            @for (step of steps; track step.num) {
              <div class="step-card">
                <div class="step-num">{{ step.num }}</div>
                <div class="step-icon">{{ step.icon }}</div>
                <h4>{{ step.title }}</h4>
                <p>{{ step.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ── CTA Section ── -->
      <section class="section cta-section">
        <div class="container">
          <div class="cta-card glass-card">
            <div class="cta-content">
              <h2>Ready to Start Your Visa Journey?</h2>
              <p>Get a personalized document checklist in under 2 minutes</p>
              <div class="cta-actions">
                <a routerLink="/checklist" class="btn btn-primary btn-lg">Generate My Checklist</a>
                <a routerLink="/chat" class="btn btn-secondary btn-lg">Ask AI Assistant</a>
              </div>
            </div>
            <div class="cta-visual">🛫</div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* ── Hero ── */
    .hero {
      position: relative; min-height: 100vh;
      display: flex; align-items: center;
      background: var(--gradient-hero);
      overflow: hidden;
    }
    .hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .hero-orb {
      position: absolute; border-radius: 50%;
      filter: blur(80px); opacity: 0.15;
    }
    .orb-1 { width: 600px; height: 600px; background: var(--primary-500); top: -200px; right: -100px; animation: float 8s ease-in-out infinite; }
    .orb-2 { width: 400px; height: 400px; background: #06b6d4; bottom: -100px; left: -100px; animation: float 10s ease-in-out infinite reverse; }
    .orb-3 { width: 300px; height: 300px; background: #8b5cf6; top: 50%; left: 40%; animation: float 6s ease-in-out infinite; }

    .hero-content {
      position: relative; z-index: 1;
      padding: 8rem 1.5rem 4rem;
      text-align: center;
    }
    .hero-badge { margin-bottom: 1.5rem; }
    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 900; color: white; margin-bottom: 1.5rem;
      line-height: 1.1;
    }
    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      color: rgba(255,255,255,0.75); max-width: 640px;
      margin: 0 auto 2.5rem;
    }

    /* Search */
    .search-container { max-width: 680px; margin: 0 auto 2.5rem; }
    .search-box {
      display: flex; align-items: center; gap: 0.75rem;
      background: rgba(255,255,255,0.12); backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.25); border-radius: var(--radius-full);
      padding: 0.75rem 1.25rem; margin-bottom: 1rem;
      transition: all var(--transition-fast);
    }
    .search-box:focus-within {
      background: rgba(255,255,255,0.18);
      border-color: rgba(255,255,255,0.5);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.3);
    }
    .search-icon { font-size: 1.25rem; flex-shrink: 0; }
    .search-input {
      flex: 1; background: none; border: none; outline: none;
      font-size: 1rem; color: white; font-family: var(--font-sans);
    }
    .search-input::placeholder { color: rgba(255,255,255,0.5); }
    .search-clear {
      background: none; border: none; color: rgba(255,255,255,0.6);
      cursor: pointer; font-size: 1rem; padding: 0.25rem;
    }
    .search-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
    .search-tags .chip { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.2); }
    .search-tags .chip:hover { background: rgba(255,255,255,0.2); color: white; }

    /* Stats */
    .hero-stats {
      display: flex; align-items: center; justify-content: center;
      gap: 2rem; flex-wrap: wrap;
    }
    .hero-stat { text-align: center; }
    .stat-num { display: block; font-size: 1.75rem; font-weight: 800; color: white; font-family: var(--font-display); }
    .stat-lbl { font-size: 0.8125rem; color: rgba(255,255,255,0.6); }
    .hero-stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }

    /* Countries */
    .countries-section { background: var(--bg-primary); }
    .section-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 1.5rem; flex-wrap: wrap; margin-bottom: 2.5rem;
    }
    .section-header.centered { flex-direction: column; align-items: center; text-align: center; }
    .section-header h2 { margin-bottom: 0.5rem; }
    .section-header p { color: var(--text-muted); }
    .region-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }

    .countries-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .country-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.25rem; border-radius: var(--radius-lg);
      background: var(--bg-glass); backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass);
      text-decoration: none; color: inherit;
      transition: all var(--transition-normal);
      animation: fadeInUp 0.5s ease forwards; opacity: 0;
    }
    .country-card:hover {
      transform: translateY(-4px); box-shadow: var(--shadow-lg);
      border-color: var(--primary-400);
    }
    .country-flag { font-size: 2.5rem; flex-shrink: 0; }
    .country-info { flex: 1; min-width: 0; }
    .country-name { font-size: 1.0625rem; font-weight: 700; margin-bottom: 0.125rem; }
    .country-region { font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 0.5rem; }
    .country-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 0.5rem; }
    .country-meta { display: flex; gap: 1rem; font-size: 0.8125rem; color: var(--text-secondary); }
    .country-arrow { color: var(--primary-400); font-size: 1.25rem; flex-shrink: 0; transition: transform var(--transition-fast); }
    .country-card:hover .country-arrow { transform: translateX(4px); }

    /* Empty State */
    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
    .empty-state h3 { margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-muted); margin-bottom: 1.5rem; }

    /* Features */
    .features-section { background: var(--bg-secondary); }
    .features-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem; margin-top: 3rem;
    }
    .feature-card { padding: 2rem; }
    .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .feature-card h3 { font-size: 1.125rem; margin-bottom: 0.5rem; }
    .feature-card p { font-size: 0.9375rem; color: var(--text-muted); margin-bottom: 1rem; }
    .feature-link { color: var(--primary-400); font-weight: 600; font-size: 0.9375rem; }
    .feature-link:hover { color: var(--primary-300); }

    /* Steps */
    .how-section { background: var(--bg-primary); }
    .steps-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem; margin-top: 3rem;
    }
    .step-card {
      text-align: center; padding: 2rem 1.5rem;
      background: var(--bg-glass); backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass); border-radius: var(--radius-lg);
    }
    .step-num {
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--gradient-primary); color: white;
      font-weight: 800; font-size: 1.25rem;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
    }
    .step-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .step-card h4 { margin-bottom: 0.5rem; }
    .step-card p { font-size: 0.875rem; color: var(--text-muted); }

    /* CTA */
    .cta-section { background: var(--bg-secondary); }
    .cta-card {
      padding: 3rem; display: flex; align-items: center;
      justify-content: space-between; gap: 2rem; flex-wrap: wrap;
    }
    .cta-content { flex: 1; }
    .cta-content h2 { margin-bottom: 0.75rem; }
    .cta-content p { color: var(--text-muted); margin-bottom: 1.5rem; }
    .cta-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .cta-visual { font-size: 5rem; animation: float 4s ease-in-out infinite; }

    @media (max-width: 1024px) {
      .hero-title { font-size: 3.5rem; }
    }

    @media (max-width: 768px) {
      .hero { min-height: auto; padding: 6rem 0 3rem; }
      .hero-content { padding: 4rem 1rem 2rem; }
      .hero-title { font-size: 2.75rem; }
      .search-container { margin-bottom: 2rem; }
      .hero-stats { gap: 1.5rem; }
      .hero-stat { flex: 1 1 120px; }
      .hero-stat-divider { display: none; }
      
      .section-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .region-filters { width: 100%; overflow-x: auto; padding-bottom: 0.5rem; -webkit-overflow-scrolling: touch; }
      .region-filters .chip { flex-shrink: 0; }
    }

    @media (max-width: 640px) {
      .hero-title { font-size: 2.25rem; }
      .hero-subtitle { font-size: 0.9375rem; }
      .search-box { border-radius: 1rem; padding: 0.625rem 1rem; }
      .search-tags { gap: 0.375rem; }
      .chip { font-size: 0.8125rem; padding: 0.375rem 0.75rem; }
      
      .countries-grid { grid-template-columns: 1fr; }
      .country-card { padding: 1rem; }
      .country-flag { font-size: 2rem; }
      
      .cta-card { padding: 2rem 1.5rem; text-align: center; }
      .cta-actions { justify-content: center; width: 100%; }
      .cta-actions .btn { width: 100%; }
      .cta-visual { display: none; }
    }

    @media (max-width: 480px) {
      .hero-title { font-size: 2rem; }
      .stat-num { font-size: 1.5rem; }
      .hero-stats { gap: 1rem; }
    }

  `]
})
export class HomeComponent implements OnInit {
  visaDataService = inject(VisaDataService);
  searchQuery = '';
  stats = { totalCountries: 0, totalVisaTypes: 0, eVisaCountries: 0, onArrivalCountries: 0 };

  quickSearches = ['🇸🇬 Singapore', '🇯🇵 Japan', '🇺🇸 USA', '🇬🇧 UK', '🇦🇺 Australia'];

  features = [
    { icon: '🌍', title: 'Country Visa Overview', description: 'Detailed visa info for 100+ countries including fees, processing times, and requirements.', link: '/', cta: 'Explore Countries' },
    { icon: '📋', title: 'Smart Checklist Generator', description: 'Get a personalized document checklist based on your nationality, destination, and profile.', link: '/checklist', cta: 'Generate Checklist' },
    { icon: '📖', title: 'Step-by-Step Guide', description: 'Follow our detailed application walkthrough from document prep to visa collection.', link: '/guide', cta: 'View Guide' },
    { icon: '🤖', title: 'AI Chat Assistant', description: 'Ask any visa question in plain language and get instant, accurate answers.', link: '/chat', cta: 'Chat Now' },
    { icon: '📊', title: 'Application Tracker', description: 'Track your visa application progress and get reminders for important deadlines.', link: '/dashboard', cta: 'Track Application' },
    { icon: '💰', title: 'Cost Estimator', description: 'Calculate total visa costs including fees, service charges, and travel insurance.', link: '/guide', cta: 'Estimate Cost' },
  ];

  steps = [
    { num: '1', icon: '🔍', title: 'Select Country', desc: 'Choose your destination and visa type from our comprehensive database' },
    { num: '2', icon: '📋', title: 'Generate Checklist', desc: 'Get a personalized document list based on your travel profile' },
    { num: '3', icon: '📤', title: 'Apply with Confidence', desc: 'Follow our step-by-step guide to submit a complete application' },
    { num: '4', icon: '✅', title: 'Track & Receive', desc: 'Monitor your application status and receive your visa' },
  ];

  ngOnInit() {
    this.stats = this.visaDataService.getStats();
  }

  onSearch(q: string) {
    this.visaDataService.setSearchQuery(q.replace(/^[^\w\s]+\s*/, ''));
  }

  quickSearch(tag: string) {
    const name = tag.replace(/^[^\w\s]+\s*/, '').trim();
    this.searchQuery = name;
    this.visaDataService.setSearchQuery(name);
  }

  clearSearch() {
    this.searchQuery = '';
    this.visaDataService.setSearchQuery('');
    this.visaDataService.setRegion('All');
  }
}
