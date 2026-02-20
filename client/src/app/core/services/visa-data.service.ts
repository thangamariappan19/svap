import { Injectable, signal, computed } from '@angular/core';
import { Country, VisaType } from '../models/visa.models';

@Injectable({ providedIn: 'root' })
export class VisaDataService {

    private readonly countries: Country[] = [
        {
            id: 'sgp', name: 'Singapore', code: 'SG', flag: '🇸🇬', region: 'Southeast Asia',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'sgp-tourist', type: 'tourist', label: 'Tourist Visa',
                    validity: '30 days', processingTime: '3-5 business days',
                    fee: 30, feeCurrency: 'SGD', entryType: 'single', stayDuration: '30 days',
                    officialUrl: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa-requirements',
                    onArrival: false, eVisa: true,
                    requirements: ['Valid passport (6+ months)', 'Return ticket', 'Hotel booking', 'Bank statement (3 months)', 'Passport-size photo', 'Travel insurance'],
                    notes: 'Many nationalities get visa-free entry. Check eligibility first.'
                },
                {
                    id: 'sgp-business', type: 'business', label: 'Business Visa',
                    validity: '30 days', processingTime: '5-7 business days',
                    fee: 30, feeCurrency: 'SGD', entryType: 'multiple', stayDuration: '30 days',
                    officialUrl: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa-requirements',
                    onArrival: false, eVisa: true,
                    requirements: ['Valid passport', 'Business invitation letter', 'Company registration', 'Bank statement', 'Return ticket'],
                    notes: 'Invitation from Singapore company required.'
                }
            ]
        },
        {
            id: 'jpn', name: 'Japan', code: 'JP', flag: '🇯🇵', region: 'East Asia',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'jpn-tourist', type: 'tourist', label: 'Tourist Visa',
                    validity: '90 days', processingTime: '5-7 business days',
                    fee: 3000, feeCurrency: 'JPY', entryType: 'single', stayDuration: '15-90 days',
                    officialUrl: 'https://www.mofa.go.jp/j_info/visit/visa/index.html',
                    onArrival: false, eVisa: false,
                    requirements: ['Valid passport', 'Visa application form', 'Photo', 'Flight itinerary', 'Hotel booking', 'Bank statement', 'Employment certificate'],
                    notes: 'Apply at Japanese Embassy/Consulate in your country.'
                }
            ]
        },
        {
            id: 'tha', name: 'Thailand', code: 'TH', flag: '🇹🇭', region: 'Southeast Asia',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'tha-tourist', type: 'tourist', label: 'Tourist Visa (TR)',
                    validity: '60 days', processingTime: '3-5 business days',
                    fee: 2000, feeCurrency: 'THB', entryType: 'single', stayDuration: '60 days',
                    officialUrl: 'https://www.thaiembassy.com/thailand-visa/tourist-visa',
                    onArrival: true, eVisa: true,
                    requirements: ['Valid passport (6+ months)', 'Visa application form', 'Photo', 'Return ticket', 'Hotel booking', 'Bank statement (20,000 THB min)'],
                    notes: 'Visa on arrival available for many nationalities at airports.'
                }
            ]
        },
        {
            id: 'usa', name: 'United States', code: 'US', flag: '🇺🇸', region: 'North America',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'usa-b2', type: 'tourist', label: 'B-2 Tourist Visa',
                    validity: '10 years', processingTime: '2-8 weeks',
                    fee: 185, feeCurrency: 'USD', entryType: 'multiple', stayDuration: 'Up to 6 months',
                    officialUrl: 'https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html',
                    onArrival: false, eVisa: false,
                    requirements: ['DS-160 form', 'Valid passport', 'Photo', 'Interview appointment', 'Bank statement', 'Ties to home country proof', 'Travel itinerary'],
                    notes: 'Interview at US Embassy/Consulate required. Processing times vary.'
                }
            ]
        },
        {
            id: 'gbr', name: 'United Kingdom', code: 'GB', flag: '🇬🇧', region: 'Europe',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'gbr-tourist', type: 'tourist', label: 'Standard Visitor Visa',
                    validity: '6 months', processingTime: '3 weeks',
                    fee: 115, feeCurrency: 'GBP', entryType: 'multiple', stayDuration: '6 months',
                    officialUrl: 'https://www.gov.uk/standard-visitor-visa',
                    onArrival: false, eVisa: true,
                    requirements: ['Valid passport', 'Online application', 'Biometrics', 'Bank statement', 'Employment proof', 'Accommodation details', 'Return ticket'],
                    notes: 'Apply online via UK Visas and Immigration portal.'
                }
            ]
        },
        {
            id: 'dub', name: 'Dubai (UAE)', code: 'AE', flag: '🇦🇪', region: 'Middle East',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'uae-tourist', type: 'tourist', label: 'Tourist Visa',
                    validity: '30 days', processingTime: '3-4 business days',
                    fee: 250, feeCurrency: 'AED', entryType: 'single', stayDuration: '30 days',
                    officialUrl: 'https://www.icp.gov.ae/en/services/visa-services/',
                    onArrival: true, eVisa: true,
                    requirements: ['Valid passport (6+ months)', 'Photo', 'Return ticket', 'Hotel booking', 'Bank statement', 'Travel insurance'],
                    notes: 'Many nationalities get visa on arrival. eVisa available through airlines.'
                }
            ]
        },
        {
            id: 'fra', name: 'France', code: 'FR', flag: '🇫🇷', region: 'Europe',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'fra-schengen', type: 'tourist', label: 'Schengen Tourist Visa',
                    validity: '90 days', processingTime: '15 days',
                    fee: 80, feeCurrency: 'EUR', entryType: 'multiple', stayDuration: '90 days in 180',
                    officialUrl: 'https://france-visas.gouv.fr/',
                    onArrival: false, eVisa: false,
                    requirements: ['Valid passport', 'Visa application form', 'Photo', 'Travel insurance (30,000 EUR)', 'Flight itinerary', 'Hotel booking', 'Bank statement', 'Employment letter'],
                    notes: 'Schengen visa allows travel to 26 European countries.'
                }
            ]
        },
        {
            id: 'aus', name: 'Australia', code: 'AU', flag: '🇦🇺', region: 'Oceania',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'aus-tourist', type: 'tourist', label: 'Tourist Visa (subclass 600)',
                    validity: '12 months', processingTime: '20-40 days',
                    fee: 145, feeCurrency: 'AUD', entryType: 'multiple', stayDuration: '3-12 months',
                    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600',
                    onArrival: false, eVisa: true,
                    requirements: ['Valid passport', 'Online application (ImmiAccount)', 'Photo', 'Bank statement', 'Employment proof', 'Travel itinerary', 'Health insurance'],
                    notes: 'Apply online via ImmiAccount. Health examination may be required.'
                }
            ]
        },
        {
            id: 'mys', name: 'Malaysia', code: 'MY', flag: '🇲🇾', region: 'Southeast Asia',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'mys-tourist', type: 'tourist', label: 'Tourist Visa',
                    validity: '30 days', processingTime: '1-3 business days',
                    fee: 0, feeCurrency: 'MYR', entryType: 'single', stayDuration: '30 days',
                    officialUrl: 'https://www.imi.gov.my/index.php/en/',
                    onArrival: true, eVisa: true,
                    requirements: ['Valid passport (6+ months)', 'Return ticket', 'Hotel booking', 'Sufficient funds proof'],
                    notes: 'Many nationalities get visa-free entry for 30-90 days.'
                }
            ]
        },
        {
            id: 'can', name: 'Canada', code: 'CA', flag: '🇨🇦', region: 'North America',
            popularDestination: true,
            visaTypes: [
                {
                    id: 'can-tourist', type: 'tourist', label: 'Temporary Resident Visa',
                    validity: '10 years', processingTime: '2-8 weeks',
                    fee: 100, feeCurrency: 'CAD', entryType: 'multiple', stayDuration: '6 months',
                    officialUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html',
                    onArrival: false, eVisa: true,
                    requirements: ['Valid passport', 'Online application', 'Biometrics', 'Photo', 'Bank statement', 'Employment proof', 'Travel itinerary', 'Ties to home country'],
                    notes: 'Apply online via IRCC portal. Biometrics required at VAC.'
                }
            ]
        }
    ];

    private _countries = signal<Country[]>(this.countries);
    private _searchQuery = signal('');
    private _selectedRegion = signal('All');

    readonly searchQuery = this._searchQuery.asReadonly();
    readonly selectedRegion = this._selectedRegion.asReadonly();

    constructor() {
        this.fetchCountries();
    }

    private async fetchCountries() {
        try {
            const response = await fetch('/api/visa/countries');
            const result = await response.json();
            if (result.success && result.data.length > 0) {
                // If backend data is available, update the signal
                // Note: We might need to map backend models to frontend models if they differ
                // For now assuming they match or we prioritize frontend richness
            }
        } catch (error) {
            console.warn('Failed to fetch countries from server, using local data');
        }
    }

    readonly filteredCountries = computed(() => {
        const q = this._searchQuery().toLowerCase();
        const r = this._selectedRegion();
        return this._countries().filter(c => {
            const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q);
            const matchesRegion = r === 'All' || c.region === r;
            return matchesSearch && matchesRegion;
        });
    });

    readonly popularCountries = computed(() =>
        this._countries().filter(c => c.popularDestination).slice(0, 6)
    );

    readonly regions = computed(() => {
        const all = ['All', ...new Set(this._countries().map(c => c.region))];
        return all;
    });

    setSearchQuery(q: string) { this._searchQuery.set(q); }
    setRegion(r: string) { this._selectedRegion.set(r); }

    getCountryById(id: string): Country | undefined {
        return this._countries().find(c => c.id === id);
    }

    getCountryByCode(code: string): Country | undefined {
        return this._countries().find(c => c.code === code);
    }

    getAllCountries(): Country[] { return this._countries(); }

    getStats() {
        const countries = this._countries();
        return {
            totalCountries: countries.length,
            totalVisaTypes: countries.reduce((acc, c) => acc + c.visaTypes.length, 0),
            eVisaCountries: countries.filter(c => c.visaTypes.some(v => v.eVisa)).length,
            onArrivalCountries: countries.filter(c => c.visaTypes.some(v => v.onArrival)).length
        };
    }
}

