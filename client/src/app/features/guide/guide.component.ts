import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface GuideStep {
  num: number;
  icon: string;
  title: string;
  description: string;
  tips: string[];
  timeEstimate: string;
  substeps: string[];
}

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="page-wrapper">
      <section class="page-hero">
        <div class="container">
          <h1>📖 Step-by-Step <span class="text-gradient">Application Guide</span></h1>
          <p>Follow our comprehensive walkthrough to submit a complete, error-free visa application</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="guide-layout">

            <!-- Sidebar Navigation -->
            <div class="guide-sidebar glass-card">
              <h3>Application Steps</h3>
              <div class="sidebar-steps">
                @for (step of steps; track step.num) {
                  <button
                    class="sidebar-step"
                    [class.active]="activeStep() === step.num"
                    (click)="activeStep.set(step.num)"
                  >
                    <div class="ss-num" [class.done]="activeStep() > step.num">
                      @if (activeStep() > step.num) { ✓ } @else { {{ step.num }} }
                    </div>
                    <div class="ss-info">
                      <div class="ss-title">{{ step.title }}</div>
                      <div class="ss-time">{{ step.timeEstimate }}</div>
                    </div>
                  </button>
                }
              </div>

              <!-- Overall Progress -->
              <div class="guide-progress">
                <div class="progress-header">
                  <span>Overall Progress</span>
                  <span>{{ activeStep() - 1 }}/{{ steps.length }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width]="((activeStep()-1)/steps.length*100) + '%'"></div>
                </div>
              </div>
            </div>

            <!-- Main Content -->
            <div class="guide-content">
              @for (step of steps; track step.num) {
                @if (activeStep() === step.num) {
                  <div class="step-detail animate-fade-in">
                    <div class="step-header">
                      <div class="step-icon-lg">{{ step.icon }}</div>
                      <div>
                        <div class="step-badge">Step {{ step.num }} of {{ steps.length }}</div>
                        <h2>{{ step.title }}</h2>
                        <p>{{ step.description }}</p>
                        <span class="time-badge">⏱ {{ step.timeEstimate }}</span>
                      </div>
                    </div>

                    <!-- Sub-steps -->
                    <div class="substeps-card glass-card">
                      <h3>What to Do</h3>
                      <ol class="substeps-list">
                        @for (sub of step.substeps; track sub; let i = $index) {
                          <li class="substep">
                            <span class="substep-num">{{ i + 1 }}</span>
                            <span>{{ sub }}</span>
                          </li>
                        }
                      </ol>
                    </div>

                    <!-- Tips -->
                    <div class="tips-card glass-card">
                      <h3>💡 Pro Tips</h3>
                      <ul class="tips-list">
                        @for (tip of step.tips; track tip) {
                          <li class="tip-item">
                            <span class="tip-dot"></span>
                            <span>{{ tip }}</span>
                          </li>
                        }
                      </ul>
                    </div>

                    <!-- Navigation -->
                    <div class="step-nav">
                      @if (activeStep() > 1) {
                        <button class="btn btn-secondary" (click)="prevStep()">← Previous Step</button>
                      } @else {
                        <span></span>
                      }
                      @if (activeStep() < steps.length) {
                        <button class="btn btn-primary" (click)="nextStep()">Next Step →</button>
                      } @else {
                        <a routerLink="/dashboard" class="btn btn-primary">Track My Application →</a>
                      }
                    </div>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Timeline Overview -->
          <div class="timeline-section">
            <h2 style="text-align:center;margin-bottom:2rem">Typical Visa Application Timeline</h2>
            <div class="timeline">
              @for (t of timeline; track t.week) {
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-card glass-card">
                    <div class="tl-week">{{ t.week }}</div>
                    <h4>{{ t.title }}</h4>
                    <p>{{ t.desc }}</p>
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
      padding: 7rem 0 3rem; background: var(--gradient-hero); text-align: center;
    }
    .page-hero h1 { color: white; margin-bottom: 1rem; }
    .page-hero p { color: rgba(255,255,255,0.7); font-size: 1.125rem; }

    .guide-layout { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; align-items: start; }
    @media (max-width: 900px) { .guide-layout { grid-template-columns: 1fr; } }

    /* Sidebar */
    .guide-sidebar { padding: 1.5rem; position: sticky; top: calc(var(--navbar-height) + 1rem); }
    .guide-sidebar h3 { font-size: 1rem; margin-bottom: 1.25rem; }
    .sidebar-steps { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
    .sidebar-step {
      display: flex; align-items: center; gap: 0.875rem;
      padding: 0.75rem; border-radius: var(--radius-md);
      background: none; border: 1px solid transparent;
      cursor: pointer; text-align: left; transition: all var(--transition-fast);
    }
    .sidebar-step:hover { background: var(--bg-glass-dark); }
    .sidebar-step.active { background: var(--bg-glass-dark); border-color: var(--primary-400); }
    .ss-num {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      background: var(--bg-tertiary); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8125rem; font-weight: 700;
      transition: all var(--transition-fast);
    }
    .sidebar-step.active .ss-num { background: var(--gradient-primary); color: white; }
    .ss-num.done { background: var(--accent-500); color: white; }
    .ss-title { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
    .ss-time { font-size: 0.75rem; color: var(--text-muted); }
    .guide-progress { margin-top: 1rem; }
    .progress-header { display: flex; justify-content: space-between; font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 0.5rem; }

    /* Content */
    .step-header { display: flex; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .step-icon-lg { font-size: 4rem; flex-shrink: 0; animation: float 4s ease-in-out infinite; }
    .step-badge { font-size: 0.8125rem; color: var(--primary-400); font-weight: 600; margin-bottom: 0.5rem; }
    .step-header h2 { margin-bottom: 0.5rem; }
    .step-header p { color: var(--text-muted); margin-bottom: 0.75rem; }
    .time-badge {
      display: inline-block; padding: 0.25rem 0.875rem;
      background: var(--bg-glass-dark); border-radius: var(--radius-full);
      font-size: 0.8125rem; color: var(--primary-400);
    }

    .substeps-card, .tips-card { padding: 1.75rem; margin-bottom: 1.25rem; }
    .substeps-card h3, .tips-card h3 { font-size: 1rem; margin-bottom: 1.25rem; }

    .substeps-list { list-style: none; display: flex; flex-direction: column; gap: 0.875rem; }
    .substep { display: flex; align-items: flex-start; gap: 1rem; font-size: 0.9375rem; }
    .substep-num {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: var(--gradient-primary); color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8125rem; font-weight: 700;
    }

    .tips-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
    .tip-item { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.9375rem; color: var(--text-secondary); }
    .tip-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary-400); flex-shrink: 0; margin-top: 6px; }

    .step-nav { display: flex; justify-content: space-between; margin-top: 1.5rem; }

    /* Timeline */
    .timeline-section { margin-top: 5rem; }
    .timeline { display: flex; gap: 0; overflow-x: auto; padding-bottom: 1rem; }
    .timeline-item { display: flex; flex-direction: column; align-items: center; min-width: 200px; flex: 1; }
    .timeline-dot {
      width: 16px; height: 16px; border-radius: 50%;
      background: var(--gradient-primary); margin-bottom: 1rem; flex-shrink: 0;
      box-shadow: 0 0 0 4px rgba(99,102,241,0.2);
    }
    .timeline-card { padding: 1.25rem; text-align: center; width: 100%; margin: 0 0.5rem; }
    .tl-week { font-size: 0.75rem; color: var(--primary-400); font-weight: 700; margin-bottom: 0.5rem; }
    .timeline-card h4 { font-size: 0.9375rem; margin-bottom: 0.375rem; }
    .timeline-card p { font-size: 0.8125rem; color: var(--text-muted); }
  `]
})
export class GuideComponent {
  activeStep = signal(1);

  prevStep() {
    this.activeStep.update(v => Math.max(1, v - 1));
  }

  nextStep() {
    this.activeStep.update(v => Math.min(this.steps.length, v + 1));
  }

  steps: GuideStep[] = [
    {
      num: 1, icon: '🔍', title: 'Research & Eligibility Check', timeEstimate: '1-2 hours',
      description: 'Before applying, verify your eligibility and understand the visa requirements for your destination.',
      substeps: [
        'Visit the official embassy or consulate website of your destination country',
        'Check if your nationality requires a visa or qualifies for visa-free entry',
        'Determine the correct visa type (tourist, business, student, etc.)',
        'Review the complete list of required documents',
        'Note the visa fee, processing time, and validity period',
        'Check if eVisa or Visa on Arrival is available for your nationality'
      ],
      tips: [
        'Always use the official embassy website, not third-party sites',
        'Check if your passport has enough blank pages (minimum 2)',
        'Verify your passport validity — most countries require 6 months beyond travel dates',
        'Some countries have different requirements based on your travel history'
      ]
    },
    {
      num: 2, icon: '📋', title: 'Gather Documents', timeEstimate: '1-2 weeks',
      description: 'Collect all required documents as per the embassy checklist. This is the most critical step.',
      substeps: [
        'Use our Smart Checklist Generator for a personalized document list',
        'Get passport-size photos taken at a professional studio',
        'Obtain bank statements for the last 3-6 months',
        'Get employment letter/NOC from your employer on company letterhead',
        'Book refundable flight tickets and hotel accommodation',
        'Purchase travel insurance with required coverage amount',
        'Get all documents notarized/attested if required'
      ],
      tips: [
        'Make photocopies of all documents — originals + 2 copies each',
        'Arrange documents in the order specified by the embassy',
        'Use refundable hotel and flight bookings until visa is approved',
        'Bank balance should ideally be 3x the estimated trip cost',
        'Travel insurance must cover the entire duration of your stay'
      ]
    },
    {
      num: 3, icon: '📝', title: 'Fill Application Form', timeEstimate: '1-2 hours',
      description: 'Complete the visa application form accurately and honestly. Errors can lead to rejection.',
      substeps: [
        'Download the official application form from the embassy website',
        'Fill in all fields in BLOCK LETTERS using black ink',
        'Provide accurate travel dates and accommodation details',
        'List all countries visited in the last 10 years',
        'Disclose any previous visa refusals honestly',
        'Sign and date the form where required',
        'Double-check all information before submission'
      ],
      tips: [
        'Never leave any field blank — write "N/A" if not applicable',
        'Ensure your name matches exactly as in your passport',
        'Do not overwrite or use correction fluid — get a fresh form if needed',
        'For online forms, save your progress regularly',
        'Keep a copy of the completed form for your records'
      ]
    },
    {
      num: 4, icon: '📅', title: 'Book Appointment', timeEstimate: '30 minutes',
      description: 'Schedule your visa appointment at the embassy, consulate, or authorized visa application center.',
      substeps: [
        'Visit the embassy website or VFS/BLS Global portal',
        'Create an account and log in',
        'Select your nearest visa application center',
        'Choose an available appointment slot',
        'Pay the appointment booking fee (if applicable)',
        'Download and print your appointment confirmation',
        'Note the appointment date, time, and required documents'
      ],
      tips: [
        'Book appointments well in advance — slots fill up quickly',
        'Arrive 15 minutes early on the appointment day',
        'Bring the appointment confirmation printout',
        'Some embassies allow walk-in applications — check first',
        'Appointment slots are often available early morning'
      ]
    },
    {
      num: 5, icon: '💳', title: 'Pay Visa Fee', timeEstimate: '15 minutes',
      description: 'Pay the required visa fee through the accepted payment methods.',
      substeps: [
        'Check the current visa fee on the official embassy website',
        'Note the accepted payment methods (cash, card, demand draft)',
        'Pay the fee at the visa application center or online',
        'Keep the payment receipt — it\'s required for submission',
        'Note that visa fees are generally non-refundable',
        'Additional service fees may apply at VFS/BLS centers'
      ],
      tips: [
        'Visa fees change periodically — always verify the current amount',
        'Some centers only accept specific payment methods',
        'Keep all payment receipts until you receive your passport back',
        'Service fees at VFS/BLS are separate from the visa fee'
      ]
    },
    {
      num: 6, icon: '📤', title: 'Submit Application', timeEstimate: '1-2 hours',
      description: 'Submit your complete application at the visa application center or embassy.',
      substeps: [
        'Organize all documents in the required order',
        'Carry originals + photocopies of all documents',
        'Arrive at the visa center on time with your appointment confirmation',
        'Submit documents at the counter and pay any remaining fees',
        'Provide biometrics (fingerprints + photo) if required',
        'Collect your receipt/acknowledgment slip',
        'Note your application reference number for tracking'
      ],
      tips: [
        'Dress professionally for your visa appointment',
        'Do not bring unnecessary items — security is strict',
        'Biometrics are required for USA, UK, Canada, Schengen, and Australia',
        'The officer may ask questions — answer honestly and confidently',
        'Keep your acknowledgment slip safe — you\'ll need it to collect your passport'
      ]
    },
    {
      num: 7, icon: '🔄', title: 'Track Application', timeEstimate: 'Ongoing',
      description: 'Monitor your application status and respond promptly to any requests for additional documents.',
      substeps: [
        'Use the reference number to track status on the embassy/VFS portal',
        'Check status regularly (every 2-3 days)',
        'Respond immediately if additional documents are requested',
        'Do not make non-refundable travel bookings until visa is approved',
        'Contact the embassy if processing exceeds the stated timeline',
        'Use our Dashboard to track your application progress'
      ],
      tips: [
        'Processing times are estimates — allow extra buffer time',
        'Do not call the embassy repeatedly — it doesn\'t speed up processing',
        'If asked for additional documents, submit them within the deadline',
        'Some embassies send SMS/email updates — enable notifications'
      ]
    },
    {
      num: 8, icon: '✅', title: 'Collect Passport & Travel', timeEstimate: '30 minutes',
      description: 'Collect your passport with the visa decision and prepare for your trip.',
      substeps: [
        'Receive notification that your passport is ready for collection',
        'Collect passport at the visa center with your acknowledgment slip',
        'Verify the visa details: dates, validity, entry type, and name',
        'Check for any conditions or restrictions on the visa',
        'If approved — book your final travel arrangements',
        'If rejected — review the reason and consider reapplying with stronger documents',
        'Make copies of your visa to carry separately from your passport'
      ],
      tips: [
        'Always verify visa details immediately upon collection',
        'Report any errors in the visa to the embassy immediately',
        'Carry a photocopy of your visa separately from your passport',
        'Understand the conditions of your visa before traveling',
        'Keep the embassy contact details handy during your trip'
      ]
    }
  ];

  timeline = [
    { week: '8 Weeks Before', title: 'Start Research', desc: 'Check visa requirements and eligibility' },
    { week: '6 Weeks Before', title: 'Gather Documents', desc: 'Collect all required documents' },
    { week: '5 Weeks Before', title: 'Book Appointment', desc: 'Schedule embassy/VFS appointment' },
    { week: '4 Weeks Before', title: 'Submit Application', desc: 'Submit with all documents' },
    { week: '2-3 Weeks Before', title: 'Under Review', desc: 'Embassy processes your application' },
    { week: '1 Week Before', title: 'Collect Visa', desc: 'Receive passport with visa decision' },
    { week: 'Travel Day', title: 'Bon Voyage! ✈️', desc: 'Enjoy your trip!' },
  ];
}
