import { Router } from 'express';

const router = Router();

// Mock visa data (in production, this comes from PostgreSQL)
const visaData = [
    {
        id: 'sgp', countryName: 'Singapore', countryCode: 'SG', flag: '🇸🇬', region: 'Southeast Asia',
        visaTypes: [
            {
                id: 'sgp-tourist', type: 'tourist', label: 'Tourist Visa',
                validity: '30 days', processingTime: '3-5 business days',
                fee: 30, feeCurrency: 'SGD', entryType: 'single', stayDuration: '30 days',
                officialUrl: 'https://www.ica.gov.sg', onArrival: false, eVisa: true,
                requirements: ['Valid passport', 'Return ticket', 'Hotel booking', 'Bank statement', 'Photo', 'Travel insurance']
            }
        ]
    }
];

// GET /api/visa/countries
router.get('/countries', (req, res) => {
    const { region, search } = req.query;
    let result = visaData;
    if (region && region !== 'All') result = result.filter(c => c.region === region);
    if (search) result = result.filter(c => c.countryName.toLowerCase().includes(search.toLowerCase()));
    res.json({ success: true, data: result, total: result.length });
});

// GET /api/visa/countries/:id
router.get('/countries/:id', (req, res) => {
    const country = visaData.find(c => c.id === req.params.id);
    if (!country) return res.status(404).json({ success: false, error: 'Country not found' });
    res.json({ success: true, data: country });
});

// GET /api/visa/regions
router.get('/regions', (req, res) => {
    const regions = ['All', ...new Set(visaData.map(c => c.region))];
    res.json({ success: true, data: regions });
});

// GET /api/visa/stats
router.get('/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalCountries: visaData.length,
            eVisaCountries: visaData.filter(c => c.visaTypes.some(v => v.eVisa)).length,
            onArrivalCountries: visaData.filter(c => c.visaTypes.some(v => v.onArrival)).length,
        }
    });
});

export default router;
