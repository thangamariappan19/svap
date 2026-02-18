export interface Country {
    id: string;
    name: string;
    code: string;           // ISO 3166-1 alpha-2
    flag: string;           // emoji flag
    region: string;
    visaTypes: VisaType[];
    popularDestination: boolean;
    imageUrl?: string;
}

export interface VisaType {
    id: string;
    type: 'tourist' | 'business' | 'student' | 'transit' | 'work';
    label: string;
    validity: string;
    processingTime: string;
    fee: number;
    feeCurrency: string;
    entryType: 'single' | 'multiple' | 'double';
    stayDuration: string;
    officialUrl: string;
    requirements: string[];
    notes?: string;
    onArrival: boolean;
    eVisa: boolean;
}

export interface DocumentItem {
    id: string;
    name: string;
    description: string;
    required: boolean;
    category: 'identity' | 'financial' | 'travel' | 'accommodation' | 'employment' | 'other';
    tips?: string;
    completed: boolean;
    fileUploaded?: boolean;
}

export interface ChecklistProfile {
    nationality: string;
    destinationCountry: string;
    visaType: string;
    travelDateFrom: string;
    travelDateTo: string;
    employmentStatus: 'employed' | 'self-employed' | 'student' | 'retired' | 'unemployed';
    hasMinors: boolean;
    previousVisaRefusal: boolean;
}

export interface ApplicationTracker {
    id: string;
    userId: string;
    country: string;
    countryCode: string;
    visaType: string;
    status: ApplicationStatus;
    submittedDate?: string;
    expectedDate?: string;
    notes?: string;
    steps: ApplicationStep[];
    createdAt: string;
    updatedAt: string;
}

export type ApplicationStatus =
    | 'draft'
    | 'documents_gathering'
    | 'submitted'
    | 'under_review'
    | 'additional_docs_required'
    | 'approved'
    | 'rejected'
    | 'passport_dispatched';

export interface ApplicationStep {
    id: string;
    label: string;
    description: string;
    completed: boolean;
    completedAt?: string;
    order: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sources?: string[];
}

export interface VisaFAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    country?: string;
}

export interface CostEstimate {
    visaFee: number;
    serviceFee: number;
    courierFee: number;
    photoFee: number;
    translationFee: number;
    total: number;
    currency: string;
    notes: string[];
}

export interface TimelineEstimate {
    documentPreparation: string;
    applicationSubmission: string;
    processingTime: string;
    totalEstimate: string;
    tips: string[];
}

export interface User {
    id: string;
    email: string;
    name: string;
    nationality?: string;
    passportNumber?: string;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}
