import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VisaDataService } from '../../core/services/visa-data.service';
import { Country, VisaType } from '../../core/models/visa.models';

@Component({
    selector: 'app-country-overview',
    standalone: true,
    imports: [RouterLink, CommonModule],
    template: `
    <div class="page-wrapper">
      @if (country()) {
        <!-- ── Country Hero ── -->
        <section class="country-hero">
          <div class="hero-bg-overlay"></div>
          <div class="container">
            <a routerLink="/" class="back-btn">← Back to Countries</a>
            <div class="country-hero-content">
              <div class="country-flag-lg">{{ country()!.flag }}</div>
              <div>
                <div class="country-region-tag">{{ country()!.region }}</div>
                <h1>{{ country()!.name }} Visa Guide</h1>
                <p class="hero-subtitle">Complete visa information, requirements, and application guide for {{ country()!.name }}</p>
                <div class="hero-actions">
                  <a routerLink="/checklist" class="btn btn-primary">Generate My Checklist</a>
                  <a routerLink="/guide" class="btn btn-secondary">View Application Guide</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Visa Type Tabs ── -->
        <section class="section">
          <div class="container">
            <div class="visa-tabs">
              @for (vt of country()!.visaTypes; track vt.id) {
                <button
                  class="visa-tab"
                  [class.active]="selectedVisa()?.id === vt.id"
                  (click)="selectedVisa.set(vt)"
                >
                  <span class="tab-icon">{{ getVisaIcon(vt.type) }}</span>
                  {{ vt.label }}
                </button>
              }
            </div>

            @if (selectedVisa()) {
              <div class="visa-detail animate-fade-in">
                <!-- Quick Stats -->
                <div class="visa-stats-grid">
                  <div class="visa-stat-card">
                    <span class="vs-icon">⏱</span>
                    <div>
                      <div class="vs-label">Processing Time</div>
                      <div class="vs-value">{{ selectedVisa()!.processingTime }}</div>
                    </div>
                  </div>
                  <div class="visa-stat-card">
                    <span class="vs-icon">💰</span>
                    <div>
                      <div class="vs-label">Visa Fee</div>
                      <div class="vs-value">{{ selectedVisa()!.feeCurrency }} {{ selectedVisa()!.fee }}</div>
                    </div>
                  </div>
                  <div class="visa-stat-card">
                    <span class="vs-icon">📅</span>
                    <div>
                      <div class="vs-label">Validity</div>
                      <div class="vs-value">{{ selectedVisa()!.validity }}</div>
                    </div>
                  </div>
                  <div class="visa-stat-card">
                    <span class="vs-icon">🏨</span>
                    <div>
                      <div class="vs-label">Max Stay</div>
                      <div class="vs-value">{{ selectedVisa()!.stayDuration }}</div>
                    </div>
                  </div>
                  <div class="visa-stat-card">
                    <span class="vs-icon">🔄</span>
                    <div>
                      <div class="vs-label">Entry Type</div>
                      <div class="vs-value capitalize">{{ selectedVisa()!.entryType }}</div>
                    </div>
                  </div>
                  <div class="visa-stat-card">
                    <span class="vs-icon">📱</span>
                    <div>
                      <div class="vs-label">Application</div>
                      <div class="vs-value">{{ selectedVisa()!.eVisa ? 'Online (eVisa)' : 'Embassy/VFS' }}</div>
                    </div>
                  </div>
                </div>

                <!-- Badges Row -->
                <div class="badges-row">
                  @if (selectedVisa()!.eVisa) {
                    <span class="badge badge-success">✓ eVisa Available</span>
                  }
                  @if (selectedVisa()!.onArrival) {
                    <span class="badge badge-warning">✓ Visa on Arrival</span>
                  }
                  <span class="badge badge-primary">{{ selectedVisa()!.type | titlecase }} Visa</span>
                </div>

                <!-- Two Column Layout -->
                <div class="detail-grid">
                  <!-- Requirements -->
                  <div class="detail-card glass-card">
                    <h3>📋 Required Documents</h3>
                    <ul class="req-list">
                      @for (req of selectedVisa()!.requirements; track req) {
                        <li class="req-item">
                          <span class="req-check">✓</span>
                          <span>{{ req }}</span>
                        </li>
                      }
                    </ul>
                    <a routerLink="/checklist" class="btn btn-primary" style="margin-top:1.5rem; width:100%; justify-content:center">
                      Generate Personalized Checklist
                    </a>
                  </div>

                  <!-- Notes & Links -->
                  <div class="side-cards">
                    @if (selectedVisa()!.notes) {
                      <div class="detail-card glass-card">
                        <h3>💡 Important Notes</h3>
                        <div class="alert alert-info">
                          <span>ℹ️</span>
                          <p>{{ selectedVisa()!.notes }}</p>
                        </div>
                      </div>
                    }

                    <div class="detail-card glass-card">
                      <h3>🔗 Official Resources</h3>
                      <a [href]="selectedVisa()!.officialUrl" target="_blank" rel="noopener" class="official-link">
                        <span>🏛️ Official Embassy Website</span>
                        <span>↗</span>
                      </a>
                      <a routerLink="/guide" class="official-link">
                        <span>📖 Step-by-Step Application Guide</span>
                        <span>→</span>
                      </a>
                      <a routerLink="/chat" class="official-link">
                        <span>🤖 Ask AI Assistant</span>
                        <span>→</span>
                      </a>
                    </div>

                    <!-- Cost Estimate -->
                    <div class="detail-card glass-card">
                      <h3>💰 Cost Estimate</h3>
                      <div class="cost-table">
                        <div class="cost-row">
                          <span>Visa Fee</span>
                          <span>{{ selectedVisa()!.feeCurrency }} {{ selectedVisa()!.fee }}</span>
                        </div>
                        <div class="cost-row">
                          <span>Service Fee (VFS/BLS)</span>
                          <span>~{{ selectedVisa()!.feeCurrency }} 25-50</span>
                        </div>
                        <div class="cost-row">
                          <span>Travel Insurance</span>
                          <span>~{{ selectedVisa()!.feeCurrency }} 20-80</span>
                        </div>
                        <div class="cost-row total">
                          <span>Estimated Total</span>
                          <span>{{ selectedVisa()!.feeCurrency }} {{ selectedVisa()!.fee + 75 }}+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </section>
      } @else {
        <div class="page-wrapper" style="display:flex;align-items:center;justify-content:center;min-height:100vh">
          <div class="empty-state">
            <span class="empty-icon">🌍</span>
            <h2>Country not found</h2>
            <a routerLink="/" class="btn btn-primary">Back to Home</a>
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    .country-hero {
      position: relative; padding: 8rem 0 4rem;
      background: var(--gradient-hero); overflow: hidden;
    }
    .hero-bg-overlay {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.3) 0%, transparent 60%);
    }
    .container { position: relative; z-index: 1; }
    .back-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      color: rgba(255,255,255,0.7); text-decoration: none;
      font-size: 0.9375rem; margin-bottom: 2rem;
      transition: color var(--transition-fast);
    }
    .back-btn:hover { color: white; }
    .country-hero-content { display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; }
    .country-flag-lg { font-size: 5rem; animation: float 4s ease-in-out infinite; }
    .country-region-tag {
      display: inline-block; padding: 0.25rem 0.875rem;
      background: rgba(255,255,255,0.15); border-radius: var(--radius-full);
      color: rgba(255,255,255,0.8); font-size: 0.8125rem; margin-bottom: 0.75rem;
    }
    .country-hero-content h1 { color: white; margin-bottom: 0.75rem; }
    .hero-subtitle { color: rgba(255,255,255,0.7); margin-bottom: 1.5rem; max-width: 500px; }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

    /* Visa Tabs */
    .visa-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .visa-tab {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.625rem 1.25rem; border-radius: var(--radius-full);
      background: var(--bg-glass); border: 1px solid var(--border-glass);
      color: var(--text-secondary); font-size: 0.9375rem; font-weight: 500;
      cursor: pointer; transition: all var(--transition-fast);
    }
    .visa-tab:hover { border-color: var(--primary-400); color: var(--primary-400); }
    .visa-tab.active {
      background: var(--gradient-primary); color: white;
      border-color: transparent; box-shadow: 0 4px 12px rgba(99,102,241,0.4);
    }
    .tab-icon { font-size: 1rem; }

    /* Visa Stats Grid */
    .visa-stats-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem; margin-bottom: 1.5rem;
    }
    .visa-stat-card {
      display: flex; align-items: center; gap: 0.875rem;
      padding: 1.25rem; border-radius: var(--radius-md);
      background: var(--bg-glass); backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass);
    }
    .vs-icon { font-size: 1.5rem; flex-shrink: 0; }
    .vs-label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem; }
    .vs-value { font-size: 0.9375rem; font-weight: 700; color: var(--text-primary); }
    .capitalize { text-transform: capitalize; }

    .badges-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }

    /* Detail Grid */
    .detail-grid { display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; }
    @media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } }

    .detail-card { padding: 1.75rem; }
    .detail-card h3 { font-size: 1.125rem; margin-bottom: 1.25rem; }

    .req-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
    .req-item { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.9375rem; }
    .req-check {
      width: 22px; height: 22px; border-radius: 50%;
      background: rgba(16,185,129,0.15); color: var(--accent-500);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; flex-shrink: 0; margin-top: 1px;
    }

    .side-cards { display: flex; flex-direction: column; gap: 1.25rem; }

    .official-link {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.875rem 1rem; border-radius: var(--radius-md);
      background: var(--bg-glass-dark); color: var(--text-primary);
      text-decoration: none; font-size: 0.9375rem;
      transition: all var(--transition-fast); margin-bottom: 0.5rem;
    }
    .official-link:hover { background: var(--primary-500); color: white; }

    .cost-table { display: flex; flex-direction: column; gap: 0.75rem; }
    .cost-row {
      display: flex; justify-content: space-between;
      font-size: 0.9375rem; padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }
    .cost-row.total {
      font-weight: 700; color: var(--primary-400);
      border-bottom: none; padding-bottom: 0;
    }

    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
  `]
})
export class CountryOverviewComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private visaDataService = inject(VisaDataService);

    country = signal<Country | undefined>(undefined);
    selectedVisa = signal<VisaType | undefined>(undefined);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id') || '';
        const c = this.visaDataService.getCountryById(id);
        this.country.set(c);
        if (c?.visaTypes.length) this.selectedVisa.set(c.visaTypes[0]);
    }

    getVisaIcon(type: string): string {
        const icons: Record<string, string> = {
            tourist: '🏖️', business: '💼', student: '🎓', transit: '✈️', work: '🔧'
        };
        return icons[type] || '📄';
    }
}
