import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChecklistService } from '../../core/services/checklist.service';
import { VisaDataService } from '../../core/services/visa-data.service';
import { ChecklistProfile, DocumentItem } from '../../core/models/visa.models';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <section class="page-hero">
        <div class="container">
          <h1>📋 Smart Document <span class="text-gradient">Checklist Generator</span></h1>
          <p>Answer a few questions and get a personalized visa document checklist tailored to your profile</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="checklist-layout">

            <!-- ── Form Panel ── -->
            <div class="form-panel glass-card">
              <h2>Your Travel Profile</h2>
              <p class="form-desc">Fill in your details to generate a personalized checklist</p>

              <form (ngSubmit)="generate()" #f="ngForm">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="nationality">Your Nationality *</label>
                    <select id="nationality" class="form-control" [(ngModel)]="profile.nationality" name="nationality" required>
                      <option value="">Select nationality</option>
                      @for (n of nationalities; track n) {
                        <option [value]="n">{{ n }}</option>
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="destination">Destination Country *</label>
                    <select id="destination" class="form-control" [(ngModel)]="profile.destinationCountry" name="destination" required>
                      <option value="">Select country</option>
                      @for (c of countries; track c.id) {
                        <option [value]="c.name">{{ c.flag }} {{ c.name }}</option>
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="visaType">Visa Type *</label>
                    <select id="visaType" class="form-control" [(ngModel)]="profile.visaType" name="visaType" required>
                      <option value="">Select visa type</option>
                      <option value="tourist">Tourist Visa</option>
                      <option value="business">Business Visa</option>
                      <option value="student">Student Visa</option>
                      <option value="transit">Transit Visa</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="employment">Employment Status *</label>
                    <select id="employment" class="form-control" [(ngModel)]="profile.employmentStatus" name="employment" required>
                      <option value="">Select status</option>
                      <option value="employed">Employed (Salaried)</option>
                      <option value="self-employed">Self-Employed / Business Owner</option>
                      <option value="student">Student</option>
                      <option value="retired">Retired</option>
                      <option value="unemployed">Unemployed / Homemaker</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="dateFrom">Travel Date From *</label>
                    <input id="dateFrom" type="date" class="form-control" [(ngModel)]="profile.travelDateFrom" name="dateFrom" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="dateTo">Travel Date To *</label>
                    <input id="dateTo" type="date" class="form-control" [(ngModel)]="profile.travelDateTo" name="dateTo" required>
                  </div>
                </div>

                <div class="toggle-group">
                  <label class="toggle-label">
                    <input type="checkbox" [(ngModel)]="profile.hasMinors" name="hasMinors">
                    <span class="toggle-text">Traveling with children (under 18)</span>
                  </label>
                  <label class="toggle-label">
                    <input type="checkbox" [(ngModel)]="profile.previousVisaRefusal" name="refusal">
                    <span class="toggle-text">Had a previous visa refusal</span>
                  </label>
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1.5rem" [disabled]="!f.valid">
                  ✨ Generate My Checklist
                </button>
              </form>
            </div>

            <!-- ── Checklist Panel ── -->
            <div class="checklist-panel">
              @if (checklistService.checklist().length > 0) {
                <!-- Progress -->
                <div class="progress-card glass-card">
                  <div class="progress-header">
                    <h3>Checklist Progress</h3>
                    <span class="progress-pct">{{ completionPercentage() }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width]="completionPercentage() + '%'"></div>
                  </div>
                  <p class="progress-sub">
                    {{ completedRequiredCount() }} of
                    {{ totalRequiredCount() }} required documents ready
                  </p>
                </div>

                <!-- Category Sections -->
                @for (cat of categories; track cat.key) {
                  @if (checklistService.getByCategory(cat.key).length > 0) {
                    <div class="cat-section glass-card">
                      <h3 class="cat-title">{{ cat.icon }} {{ cat.label }}</h3>
                      <div class="doc-list">
                        @for (doc of checklistService.getByCategory(cat.key); track doc.id) {
                          <div class="doc-item" [class.completed]="doc.completed" (click)="checklistService.toggleItem(doc.id)">
                            <div class="doc-check" [class.checked]="doc.completed">
                              @if (doc.completed) { <span>✓</span> }
                            </div>
                            <div class="doc-info">
                              <div class="doc-name">
                                {{ doc.name }}
                                @if (doc.required) { <span class="req-badge">Required</span> }
                                @else { <span class="opt-badge">Optional</span> }
                              </div>
                              <div class="doc-desc">{{ doc.description }}</div>
                              @if (doc.tips) {
                                <div class="doc-tip">💡 {{ doc.tips }}</div>
                              }
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                }

                <!-- Actions -->
                <div class="checklist-actions">
                  <button class="btn btn-secondary" (click)="checklistService.resetChecklist()">Reset Checklist</button>
                  <button class="btn btn-primary" (click)="printChecklist()">🖨️ Print / Save PDF</button>
                </div>
              } @else {
                <div class="empty-checklist glass-card">
                  <span class="empty-icon">📋</span>
                  <h3>Your Checklist Will Appear Here</h3>
                  <p>Fill in your travel profile on the left and click "Generate My Checklist" to get a personalized document list.</p>
                  <div class="tip-cards">
                    @for (tip of tips; track tip.title) {
                      <div class="tip-card">
                        <span>{{ tip.icon }}</span>
                        <div>
                          <strong>{{ tip.title }}</strong>
                          <p>{{ tip.desc }}</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-hero {
      padding: 7rem 0 3rem;
      background: var(--gradient-hero);
      text-align: center;
    }
    .page-hero h1 { color: white; margin-bottom: 1rem; }
    .page-hero p { color: rgba(255,255,255,0.7); font-size: 1.125rem; }

    .checklist-layout {
      display: grid; grid-template-columns: 420px 1fr;
      gap: 2rem; align-items: start;
    }
    @media (max-width: 900px) { .checklist-layout { grid-template-columns: 1fr; } }

    .form-panel { padding: 2rem; }
    .form-panel h2 { margin-bottom: 0.5rem; }
    .form-desc { color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9375rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }

    .toggle-group { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
    .toggle-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
    .toggle-label input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--primary-500); }
    .toggle-text { font-size: 0.9375rem; color: var(--text-secondary); }

    /* Progress */
    .progress-card { padding: 1.5rem; margin-bottom: 1.25rem; }
    .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .progress-header h3 { font-size: 1rem; }
    .progress-pct { font-size: 1.5rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .progress-sub { font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.5rem; }

    /* Category */
    .cat-section { padding: 1.5rem; margin-bottom: 1.25rem; }
    .cat-title { font-size: 1rem; margin-bottom: 1rem; }
    .doc-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .doc-item {
      display: flex; align-items: flex-start; gap: 1rem;
      padding: 1rem; border-radius: var(--radius-md);
      background: var(--bg-glass-dark); cursor: pointer;
      transition: all var(--transition-fast); border: 1px solid transparent;
    }
    .doc-item:hover { border-color: var(--primary-400); }
    .doc-item.completed { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.3); }
    .doc-check {
      width: 24px; height: 24px; border-radius: 6px;
      border: 2px solid var(--border-color); flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.875rem; font-weight: 700; color: white;
      transition: all var(--transition-fast);
    }
    .doc-check.checked { background: var(--accent-500); border-color: var(--accent-500); }
    .doc-name { font-size: 0.9375rem; font-weight: 600; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .req-badge { font-size: 0.6875rem; padding: 0.125rem 0.5rem; background: rgba(239,68,68,0.12); color: var(--danger-500); border-radius: var(--radius-full); font-weight: 600; }
    .opt-badge { font-size: 0.6875rem; padding: 0.125rem 0.5rem; background: rgba(148,163,184,0.12); color: var(--text-muted); border-radius: var(--radius-full); font-weight: 600; }
    .doc-desc { font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 0.375rem; }
    .doc-tip { font-size: 0.8125rem; color: var(--primary-400); }

    .checklist-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }

    /* Empty */
    .empty-checklist { padding: 3rem 2rem; text-align: center; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
    .empty-checklist h3 { margin-bottom: 0.75rem; }
    .empty-checklist > p { color: var(--text-muted); margin-bottom: 2rem; }
    .tip-cards { display: flex; flex-direction: column; gap: 0.75rem; text-align: left; }
    .tip-card {
      display: flex; align-items: flex-start; gap: 0.875rem;
      padding: 1rem; border-radius: var(--radius-md);
      background: var(--bg-glass-dark); font-size: 0.875rem;
    }
    .tip-card span { font-size: 1.5rem; flex-shrink: 0; }
    .tip-card strong { display: block; margin-bottom: 0.25rem; }
    .tip-card p { color: var(--text-muted); margin: 0; }
  `]
})
export class ChecklistComponent {
  checklistService = inject(ChecklistService);
  visaDataService = inject(VisaDataService);

  totalRequiredCount = computed(() =>
    this.checklistService.checklist().filter(i => i.required).length
  );

  completedRequiredCount = computed(() =>
    this.checklistService.checklist().filter(i => i.required && i.completed).length
  );

  completionPercentage = computed(() => {
    const total = this.totalRequiredCount();
    return total > 0 ? Math.round((this.completedRequiredCount() / total) * 100) : 0;
  });

  profile: ChecklistProfile = {
    nationality: '', destinationCountry: '', visaType: '',
    travelDateFrom: '', travelDateTo: '',
    employmentStatus: 'employed', hasMinors: false, previousVisaRefusal: false
  };

  countries = this.visaDataService.getAllCountries();

  nationalities = [
    'Indian', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Nepali',
    'Chinese', 'Filipino', 'Indonesian', 'Vietnamese', 'Thai',
    'Nigerian', 'Ghanaian', 'Kenyan', 'Egyptian', 'South African',
    'Brazilian', 'Colombian', 'Mexican', 'Argentinian',
    'Russian', 'Ukrainian', 'Turkish', 'Iranian',
    'American', 'British', 'Canadian', 'Australian', 'German', 'French'
  ];

  categories = [
    { key: 'identity' as const, icon: '🪪', label: 'Identity Documents' },
    { key: 'travel' as const, icon: '✈️', label: 'Travel Documents' },
    { key: 'financial' as const, icon: '💰', label: 'Financial Documents' },
    { key: 'accommodation' as const, icon: '🏨', label: 'Accommodation' },
    { key: 'employment' as const, icon: '💼', label: 'Employment / Education' },
    { key: 'other' as const, icon: '📄', label: 'Other Documents' },
  ];

  tips = [
    { icon: '📅', title: 'Apply Early', desc: 'Start gathering documents 4-6 weeks before your travel date' },
    { icon: '📸', title: 'Photo Requirements', desc: 'Get photos taken at a professional studio to meet embassy standards' },
    { icon: '💳', title: 'Bank Statement', desc: 'Maintain a healthy bank balance for at least 3 months before applying' },
  ];

  generate() {
    this.checklistService.generateChecklist(this.profile);
  }

  printChecklist() {
    window.print();
  }
}
