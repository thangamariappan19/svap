import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../core/services/tracker.service';
import { VisaDataService } from '../../core/services/visa-data.service';
import { ApplicationTracker, ApplicationStatus } from '../../core/models/visa.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <section class="page-hero">
        <div class="container hero-inner">
          <div>
            <h1>📊 Application <span class="text-gradient">Dashboard</span></h1>
            <p>Track all your visa applications in one place</p>
          </div>
          <button class="btn btn-primary" (click)="showAddModal.set(true)">
            + New Application
          </button>
        </div>
      </section>

      <section class="section">
        <div class="container">

          <!-- Stats Row -->
          <div class="stats-row">
            @for (stat of getDashboardStats(); track stat.label) {
              <div class="stat-card">
                <div class="stat-icon">{{ stat.icon }}</div>
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            }
          </div>

          <!-- Applications List -->
          @if (trackerService.applications().length > 0) {
            <div class="apps-grid">
              @for (app of trackerService.applications(); track app.id) {
                <div class="app-card glass-card" [class.selected]="selectedApp()?.id === app.id">
                  <div class="app-card-header">
                    <div class="app-country">
                      <span class="app-flag">{{ getFlag(app.countryCode) }}</span>
                      <div>
                        <h3>{{ app.country }}</h3>
                        <p>{{ app.visaType }}</p>
                      </div>
                    </div>
                    <div class="app-status-badge" [class]="'status-' + trackerService.getStatusColor(app.status)">
                      {{ trackerService.getStatusLabel(app.status) }}
                    </div>
                  </div>

                  <!-- Progress -->
                  <div class="app-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width]="getProgress(app) + '%'"></div>
                    </div>
                    <span class="progress-text">{{ getProgress(app) }}% complete</span>
                  </div>

                  <!-- Meta -->
                  <div class="app-meta">
                    @if (app.submittedDate) {
                      <span>📅 Submitted: {{ app.submittedDate }}</span>
                    }
                    @if (app.expectedDate) {
                      <span>⏳ Expected: {{ app.expectedDate }}</span>
                    }
                  </div>

                  <!-- Actions -->
                  <div class="app-actions">
                    <button class="btn btn-secondary btn-sm" (click)="selectApp(app)">
                      {{ selectedApp()?.id === app.id ? 'Hide Details' : 'View Details' }}
                    </button>
                    <button class="btn btn-outline btn-sm" style="color:var(--danger-500);border-color:var(--danger-500)" (click)="trackerService.deleteApplication(app.id)">
                      Delete
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Selected App Detail -->
            @if (selectedApp()) {
              <div class="app-detail glass-card animate-fade-in">
                <div class="detail-header">
                  <h2>{{ getFlag(selectedApp()!.countryCode) }} {{ selectedApp()!.country }} — {{ selectedApp()!.visaType }}</h2>
                  <button class="btn btn-secondary btn-sm" (click)="selectedApp.set(null)">✕ Close</button>
                </div>

                <!-- Steps -->
                <div class="steps-section">
                  <h3>Application Steps</h3>
                  <div class="steps-list">
                    @for (step of selectedApp()!.steps; track step.id) {
                      <div class="step-row" [class.completed]="step.completed" (click)="trackerService.toggleStep(selectedApp()!.id, step.id)">
                        <div class="step-check" [class.checked]="step.completed">
                          @if (step.completed) { ✓ } @else { {{ step.order }} }
                        </div>
                        <div class="step-info">
                          <div class="step-title">{{ step.label }}</div>
                          <div class="step-desc">{{ step.description }}</div>
                          @if (step.completedAt) {
                            <div class="step-date">Completed: {{ step.completedAt | date:'MMM d, y' }}</div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Status Update -->
                <div class="status-update">
                  <label class="form-label">Update Status</label>
                  <div class="status-chips">
                    @for (s of statusOptions; track s.value) {
                      <button
                        class="status-chip"
                        [class.active]="selectedApp()!.status === s.value"
                        (click)="trackerService.updateStatus(selectedApp()!.id, s.value)"
                      >{{ s.label }}</button>
                    }
                  </div>
                </div>
              </div>
            }
          } @else {
            <div class="empty-dashboard glass-card">
              <span class="empty-icon">📊</span>
              <h3>No Applications Yet</h3>
              <p>Start tracking your visa applications to stay organized</p>
              <button class="btn btn-primary" (click)="showAddModal.set(true)">+ Add First Application</button>
            </div>
          }
        </div>
      </section>

      <!-- Add Application Modal -->
      @if (showAddModal()) {
        <div class="modal-overlay" (click)="showAddModal.set(false)">
          <div class="modal glass-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Add New Application</h2>
              <button class="modal-close" (click)="showAddModal.set(false)">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Destination Country *</label>
                <select class="form-control" [(ngModel)]="newApp.country" (ngModelChange)="onCountryChange($event)">
                  <option value="">Select country</option>
                  @for (c of countries; track c.id) {
                    <option [value]="c.name">{{ c.flag }} {{ c.name }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Visa Type *</label>
                <select class="form-control" [(ngModel)]="newApp.visaType">
                  <option value="">Select type</option>
                  <option value="Tourist Visa">Tourist Visa</option>
                  <option value="Business Visa">Business Visa</option>
                  <option value="Student Visa">Student Visa</option>
                  <option value="Transit Visa">Transit Visa</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Notes</label>
                <input type="text" class="form-control" [(ngModel)]="newApp.notes" placeholder="Any notes about this application...">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="showAddModal.set(false)">Cancel</button>
              <button class="btn btn-primary" (click)="addApplication()" [disabled]="!newApp.country || !newApp.visaType">
                Add Application
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-hero {
      padding: 7rem 0 3rem; background: var(--gradient-hero);
    }
    .hero-inner {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 1rem;
    }
    .page-hero h1 { color: white; margin-bottom: 0.5rem; }
    .page-hero p { color: rgba(255,255,255,0.7); }

    /* Stats */
    .stats-row {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem; margin-bottom: 2rem;
    }
    .stat-card {
      padding: 1.5rem; text-align: center;
      background: var(--bg-glass); backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass); border-radius: var(--radius-lg);
    }
    .stat-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .stat-value { font-size: 2rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .stat-label { font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.25rem; }

    /* Apps Grid */
    .apps-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.25rem; margin-bottom: 2rem;
    }
    .app-card { padding: 1.5rem; cursor: pointer; }
    .app-card.selected { border-color: var(--primary-400); }
    .app-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .app-country { display: flex; align-items: center; gap: 0.875rem; }
    .app-flag { font-size: 2rem; }
    .app-country h3 { font-size: 1.0625rem; margin-bottom: 0.125rem; }
    .app-country p { font-size: 0.8125rem; color: var(--text-muted); }
    .app-status-badge {
      padding: 0.25rem 0.75rem; border-radius: var(--radius-full);
      font-size: 0.75rem; font-weight: 700;
    }
    .status-primary { background: rgba(99,102,241,0.15); color: var(--primary-400); }
    .status-success { background: rgba(16,185,129,0.15); color: var(--accent-500); }
    .status-warning { background: rgba(245,158,11,0.15); color: var(--warning-500); }
    .status-danger  { background: rgba(239,68,68,0.15);  color: var(--danger-500); }
    .status-muted   { background: var(--bg-tertiary); color: var(--text-muted); }

    .app-progress { margin-bottom: 0.75rem; }
    .progress-text { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.375rem; display: block; }
    .app-meta { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1rem; }
    .app-actions { display: flex; gap: 0.75rem; }

    /* Detail */
    .app-detail { padding: 2rem; margin-top: 1.5rem; }
    .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .detail-header h2 { font-size: 1.25rem; }
    .steps-section h3 { margin-bottom: 1.25rem; }
    .steps-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
    .step-row {
      display: flex; align-items: flex-start; gap: 1rem;
      padding: 1rem; border-radius: var(--radius-md);
      background: var(--bg-glass-dark); cursor: pointer;
      transition: all var(--transition-fast); border: 1px solid transparent;
    }
    .step-row:hover { border-color: var(--primary-400); }
    .step-row.completed { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.3); }
    .step-check {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      background: var(--bg-tertiary); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.875rem; font-weight: 700; transition: all var(--transition-fast);
    }
    .step-check.checked { background: var(--accent-500); color: white; }
    .step-title { font-weight: 600; margin-bottom: 0.25rem; }
    .step-desc { font-size: 0.8125rem; color: var(--text-muted); }
    .step-date { font-size: 0.75rem; color: var(--accent-500); margin-top: 0.25rem; }

    .status-update h3, .status-update .form-label { margin-bottom: 0.75rem; display: block; }
    .status-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .status-chip {
      padding: 0.375rem 0.875rem; border-radius: var(--radius-full);
      background: var(--bg-glass-dark); border: 1px solid var(--border-glass);
      color: var(--text-secondary); font-size: 0.8125rem; cursor: pointer;
      transition: all var(--transition-fast);
    }
    .status-chip:hover, .status-chip.active {
      background: var(--primary-500); color: white; border-color: transparent;
    }

    /* Empty */
    .empty-dashboard { padding: 4rem 2rem; text-align: center; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
    .empty-dashboard h3 { margin-bottom: 0.5rem; }
    .empty-dashboard p { color: var(--text-muted); margin-bottom: 1.5rem; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; padding: 1.5rem;
    }
    .modal { width: 100%; max-width: 480px; padding: 2rem; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .modal-header h2 { font-size: 1.25rem; }
    .modal-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--text-muted); }
    .modal-body { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
    .modal-footer { display: flex; gap: 1rem; justify-content: flex-end; }
  `]
})
export class DashboardComponent {
  trackerService = inject(TrackerService);
  visaDataService = inject(VisaDataService);

  selectedApp = signal<ApplicationTracker | null>(null);
  showAddModal = signal(false);

  countries = this.visaDataService.getAllCountries();

  newApp = { country: '', countryCode: '', visaType: '', notes: '' };

  statusOptions: { value: ApplicationStatus; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'documents_gathering', label: 'Gathering Docs' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'additional_docs_required', label: 'Docs Required' },
    { value: 'approved', label: 'Approved ✓' },
    { value: 'rejected', label: 'Rejected ✗' },
    { value: 'passport_dispatched', label: 'Dispatched 📦' },
  ];

  getFlag(code: string): string {
    const c = this.visaDataService.getCountryByCode(code);
    return c?.flag || '🌍';
  }

  getProgress(app: ApplicationTracker): number {
    const completed = app.steps.filter(s => s.completed).length;
    return Math.round((completed / app.steps.length) * 100);
  }

  getDashboardStats() {
    const apps = this.trackerService.applications();
    return [
      { icon: '📋', value: apps.length, label: 'Total Applications' },
      { icon: '⏳', value: apps.filter(a => a.status === 'under_review' || a.status === 'submitted').length, label: 'In Progress' },
      { icon: '✅', value: apps.filter(a => a.status === 'approved').length, label: 'Approved' },
      { icon: '📝', value: apps.filter(a => a.status === 'documents_gathering' || a.status === 'draft').length, label: 'Preparing' },
    ];
  }

  selectApp(app: ApplicationTracker) {
    this.selectedApp.update(cur => cur?.id === app.id ? null : app);
  }

  onCountryChange(name: string) {
    const c = this.countries.find(c => c.name === name);
    this.newApp.countryCode = c?.code || '';
  }

  addApplication() {
    this.trackerService.addApplication(this.newApp);
    this.newApp = { country: '', countryCode: '', visaType: '', notes: '' };
    this.showAddModal.set(false);
  }
}
