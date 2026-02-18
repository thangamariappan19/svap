import { Injectable, signal } from '@angular/core';
import { ChecklistProfile, DocumentItem } from '../models/visa.models';

@Injectable({ providedIn: 'root' })
export class ChecklistService {

    private readonly baseDocuments: DocumentItem[] = [
        { id: 'passport', name: 'Valid Passport', description: 'Must be valid for at least 6 months beyond your travel dates', required: true, category: 'identity', tips: 'Ensure you have at least 2 blank pages for visa stamps', completed: false },
        { id: 'photo', name: 'Passport-size Photographs', description: '2 recent passport-size photos (white background, 35mm x 45mm)', required: true, category: 'identity', tips: 'Photos must be taken within the last 6 months', completed: false },
        { id: 'visa-form', name: 'Visa Application Form', description: 'Completed and signed visa application form', required: true, category: 'other', tips: 'Fill in block letters, no corrections/overwriting', completed: false },
        { id: 'return-ticket', name: 'Return Flight Ticket', description: 'Confirmed round-trip flight booking', required: true, category: 'travel', tips: 'Must show entry and exit dates within visa validity', completed: false },
        { id: 'hotel', name: 'Hotel / Accommodation Booking', description: 'Confirmed hotel reservation for entire stay', required: true, category: 'accommodation', tips: 'Use refundable bookings if visa is uncertain', completed: false },
        { id: 'bank-statement', name: 'Bank Statement (3 months)', description: 'Original bank statements showing sufficient funds', required: true, category: 'financial', tips: 'Minimum balance varies by country. Typically USD 1000+ per month', completed: false },
        { id: 'travel-insurance', name: 'Travel Insurance', description: 'Travel insurance covering medical emergencies', required: true, category: 'travel', tips: 'Minimum coverage of EUR 30,000 for Schengen countries', completed: false },
    ];

    private readonly employedDocuments: DocumentItem[] = [
        { id: 'emp-letter', name: 'Employment Letter', description: 'Letter from employer confirming employment, salary, and approved leave', required: true, category: 'employment', tips: 'Must be on company letterhead with HR/Manager signature', completed: false },
        { id: 'salary-slips', name: 'Salary Slips (3 months)', description: 'Recent 3 months salary slips', required: true, category: 'financial', tips: 'Must match bank statement credits', completed: false },
        { id: 'noc', name: 'No Objection Certificate (NOC)', description: 'NOC from employer allowing travel', required: false, category: 'employment', tips: 'Required by some embassies, good to have regardless', completed: false },
    ];

    private readonly selfEmployedDocuments: DocumentItem[] = [
        { id: 'biz-reg', name: 'Business Registration Certificate', description: 'Certificate of incorporation or business registration', required: true, category: 'employment', tips: 'Must be valid and current', completed: false },
        { id: 'itr', name: 'Income Tax Returns (2 years)', description: 'Filed ITR for last 2 financial years', required: true, category: 'financial', tips: 'Shows stable income and tax compliance', completed: false },
        { id: 'biz-bank', name: 'Business Bank Statement', description: 'Business account statements for 6 months', required: true, category: 'financial', tips: 'Shows business activity and revenue', completed: false },
    ];

    private readonly studentDocuments: DocumentItem[] = [
        { id: 'student-id', name: 'Student ID Card', description: 'Valid student identity card', required: true, category: 'identity', tips: 'Must be currently enrolled', completed: false },
        { id: 'enrollment', name: 'Enrollment Certificate', description: 'Letter from institution confirming enrollment', required: true, category: 'employment', tips: 'Must mention course duration and expected completion', completed: false },
        { id: 'sponsor-letter', name: 'Sponsor Letter', description: 'Letter from parent/guardian sponsoring the trip', required: true, category: 'financial', tips: 'Include sponsor\'s bank statement and employment proof', completed: false },
    ];

    private _profile = signal<ChecklistProfile | null>(null);
    private _checklist = signal<DocumentItem[]>([]);

    readonly profile = this._profile.asReadonly();
    readonly checklist = this._checklist.asReadonly();

    generateChecklist(profile: ChecklistProfile): DocumentItem[] {
        this._profile.set(profile);
        let docs = [...this.baseDocuments.map(d => ({ ...d, completed: false }))];

        switch (profile.employmentStatus) {
            case 'employed':
                docs = [...docs, ...this.employedDocuments.map(d => ({ ...d }))];
                break;
            case 'self-employed':
                docs = [...docs, ...this.selfEmployedDocuments.map(d => ({ ...d }))];
                break;
            case 'student':
                docs = [...docs, ...this.studentDocuments.map(d => ({ ...d }))];
                break;
            case 'retired':
                docs.push({ id: 'pension', name: 'Pension Statement', description: 'Proof of pension or retirement income', required: true, category: 'financial', tips: 'Last 3 months pension statements', completed: false });
                break;
        }

        if (profile.hasMinors) {
            docs.push({ id: 'birth-cert', name: 'Birth Certificate (Minor)', description: 'Birth certificate of the minor child', required: true, category: 'identity', tips: 'Notarized copy may be required', completed: false });
            docs.push({ id: 'consent-letter', name: 'Parental Consent Letter', description: 'Notarized consent letter if traveling with one parent', required: false, category: 'other', tips: 'Required if child travels with only one parent', completed: false });
        }

        if (profile.previousVisaRefusal) {
            docs.push({ id: 'refusal-letter', name: 'Previous Visa Refusal Letter', description: 'Copy of previous visa refusal letter', required: true, category: 'other', tips: 'Disclose all previous refusals honestly', completed: false });
        }

        this._checklist.set(docs);
        return docs;
    }

    toggleItem(id: string) {
        this._checklist.update(list =>
            list.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
        );
    }

    getCompletionPercentage(): number {
        const list = this._checklist();
        if (!list.length) return 0;
        const required = list.filter(i => i.required);
        const completed = required.filter(i => i.completed);
        return Math.round((completed.length / required.length) * 100);
    }

    getByCategory(category: DocumentItem['category']): DocumentItem[] {
        return this._checklist().filter(i => i.category === category);
    }

    resetChecklist() {
        this._checklist.set([]);
        this._profile.set(null);
    }
}
