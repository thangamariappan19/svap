import { Router } from 'express';

const router = Router();

// Simple RAG-like knowledge base
const knowledgeBase = {
    'singapore': 'Singapore tourist visa costs SGD 30, processed in 3-5 business days. Many nationalities get visa-free entry. Apply through ICA website.',
    'hotel booking': 'Yes, a confirmed hotel booking is required for most tourist visas. Use refundable bookings until your visa is approved.',
    'bank statement': 'Most countries require 3-6 months of bank statements showing sufficient funds. Minimum balance varies: SGD 1000+ for Singapore, EUR 100/day for Schengen.',
    'processing time': 'Processing times: Singapore 3-5 days, Japan 5-7 days, USA 2-8 weeks, UK 3 weeks, Schengen 15 days.',
    'travel insurance': 'Travel insurance is mandatory for Schengen visas (min EUR 30,000 coverage) and recommended for all international travel.',
};

// POST /api/chat/message
router.post('/message', async (req, res) => {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

    const q = message.toLowerCase();
    let response = 'I can help you with visa requirements, documents, processing times, and more. Could you be more specific about which country or topic you need help with?';
    let sources = ['SVAP Knowledge Base'];

    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (q.includes(key)) {
            response = value;
            sources = ['Official Embassy Guidelines', 'SVAP Knowledge Base'];
            break;
        }
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
        success: true,
        data: {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: response,
            sources,
            timestamp: new Date().toISOString()
        }
    });
});

export default router;
