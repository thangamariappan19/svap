import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApplicationTracker, ApplicationStatus, ApplicationStep } from '../models/visa.models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TrackerService {
    private platformId = inject(PLATFORM_ID);
    private authService = inject(AuthService);

    private readonly defaultSteps: ApplicationStep[] = [

        { id: 's1', label: 'Gather Documents', description: 'Collect all required documents per checklist', completed: false, order: 1 },
        { id: 's2', label: 'Fill Application Form', description: 'Complete the visa application form accurately', completed: false, order: 2 },
        { id: 's3', label: 'Book Appointment', description: 'Schedule appointment at embassy/consulate or VFS', completed: false, order: 3 },
        { id: 's4', label: 'Pay Visa Fee', description: 'Pay the required visa fee', completed: false, order: 4 },
        { id: 's5', label: 'Submit Application', description: 'Submit application with all documents', completed: false, order: 5 },
        { id: 's6', label: 'Biometrics (if required)', description: 'Provide fingerprints and photograph at VAC', completed: false, order: 6 },
        { id: 's7', label: 'Track Application', description: 'Monitor application status online', completed: false, order: 7 },
        { id: 's8', label: 'Collect Passport', description: 'Collect passport with visa decision', completed: false, order: 8 },
    ];

    private _applications = signal<ApplicationTracker[]>([]);

    readonly applications = this._applications.asReadonly();

    constructor() {
        this._applications.set(this.loadFromStorage());
    }

    private loadFromStorage(): ApplicationTracker[] {
        if (isPlatformBrowser(this.platformId)) {
            try {
                const stored = localStorage.getItem('svap_applications');
                return stored ? JSON.parse(stored) : this.getSampleApplications();
            } catch { return this.getSampleApplications(); }
        }
        return this.getSampleApplications();
    }

    private saveToStorage(apps: ApplicationTracker[]) {
        if (isPlatformBrowser(this.platformId)) {
            try { localStorage.setItem('svap_applications', JSON.stringify(apps)); } catch { }
        }
    }

    private getSampleApplications(): ApplicationTracker[] {
        const userId = this.authService.user()?.id || 'guest';
        return [
            {
                id: 'app-001', userId: userId, country: 'Singapore', countryCode: 'SG',
                visaType: 'Tourist Visa', status: 'under_review',
                submittedDate: '2026-02-10', expectedDate: '2026-02-17',
                notes: 'Applied through VFS Global',
                createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-02-10T14:00:00Z',
                steps: this.defaultSteps.map((s, i) => ({ ...s, completed: i < 5, completedAt: i < 5 ? '2026-02-10' : undefined }))
            },
            {
                id: 'app-002', userId: userId, country: 'Japan', countryCode: 'JP',
                visaType: 'Tourist Visa', status: 'documents_gathering',
                submittedDate: undefined, expectedDate: undefined,
                notes: 'Planning for March trip',
                createdAt: '2026-02-15T09:00:00Z', updatedAt: '2026-02-15T09:00:00Z',
                steps: this.defaultSteps.map((s, i) => ({ ...s, completed: i < 2 }))
            }
        ];
    }

    addApplication(data: Partial<ApplicationTracker>): ApplicationTracker {
        const userId = this.authService.user()?.id || 'guest';
        const app: ApplicationTracker = {
            id: `app-${Date.now()}`,
            userId: userId,
            country: data.country || '',
            countryCode: data.countryCode || '',
            visaType: data.visaType || '',
            status: 'draft',
            notes: data.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            steps: this.defaultSteps.map(s => ({ ...s }))
        };
        this._applications.update(apps => {
            const updated = [app, ...apps];
            this.saveToStorage(updated);
            return updated;
        });
        return app;
    }


    updateStatus(id: string, status: ApplicationStatus) {
        this._applications.update(apps => {
            const updated = apps.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a);
            this.saveToStorage(updated);
            return updated;
        });
    }

    toggleStep(appId: string, stepId: string) {
        this._applications.update(apps => {
            const updated = apps.map(a => {
                if (a.id !== appId) return a;
                const steps = a.steps.map(s =>
                    s.id === stepId ? { ...s, completed: !s.completed, completedAt: !s.completed ? new Date().toISOString() : undefined } : s
                );

                // Only auto-update status if it's in a transitional state
                let status = a.status;
                const completedCount = steps.filter(s => s.completed).length;

                if (status === 'draft' || status === 'documents_gathering' || status === 'submitted') {
                    if (completedCount === 0) status = 'draft';
                    else if (completedCount < 5) status = 'documents_gathering';
                    else if (completedCount === 5) status = 'submitted';
                    else if (completedCount > 5 && completedCount < 8) status = 'under_review';
                    else if (completedCount === 8) status = 'approved';
                }

                return { ...a, steps, status, updatedAt: new Date().toISOString() };
            });
            this.saveToStorage(updated);
            return updated;
        });
    }


    deleteApplication(id: string) {
        this._applications.update(apps => {
            const updated = apps.filter(a => a.id !== id);
            this.saveToStorage(updated);
            return updated;
        });
    }

    getStatusLabel(status: ApplicationStatus): string {
        const labels: Record<ApplicationStatus, string> = {
            draft: 'Draft', documents_gathering: 'Gathering Docs', submitted: 'Submitted',
            under_review: 'Under Review', additional_docs_required: 'Docs Required',
            approved: 'Approved', rejected: 'Rejected', passport_dispatched: 'Passport Dispatched'
        };
        return labels[status];
    }

    getStatusColor(status: ApplicationStatus): string {
        const colors: Record<ApplicationStatus, string> = {
            draft: 'muted', documents_gathering: 'warning', submitted: 'primary',
            under_review: 'primary', additional_docs_required: 'warning',
            approved: 'success', rejected: 'danger', passport_dispatched: 'success'
        };
        return colors[status];
    }
}
