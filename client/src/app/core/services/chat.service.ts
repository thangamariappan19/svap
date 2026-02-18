import { Injectable, signal } from '@angular/core';
import { ChatMessage } from '../models/visa.models';

@Injectable({ providedIn: 'root' })
export class ChatService {

    private readonly knowledgeBase: Record<string, string> = {
        'hotel booking': 'Yes, you typically need a confirmed hotel booking when applying for a tourist visa. However, many travelers use refundable bookings that can be cancelled if the visa is denied. Some embassies accept a hotel booking confirmation without full payment.',
        'apply early': 'It\'s recommended to apply for your visa 4-8 weeks before your travel date. Most embassies allow applications up to 3 months in advance. Applying early gives you buffer time if additional documents are requested.',
        'bank balance': 'Most countries require proof of sufficient funds. As a general guideline: Singapore requires SGD 1,000+, Schengen countries require €100/day, USA requires proof of strong financial ties. Always check the specific embassy requirements.',
        'travel insurance': 'Travel insurance is mandatory for Schengen visas (minimum €30,000 coverage) and highly recommended for all international travel. It should cover medical emergencies, trip cancellation, and evacuation.',
        'processing time': 'Processing times vary by country: Singapore 3-5 days, Japan 5-7 days, USA 2-8 weeks, UK 3 weeks, Schengen 15 days. Apply well in advance to account for delays.',
        'visa rejection': 'Common reasons for visa rejection include: insufficient funds, incomplete documents, unclear travel purpose, previous overstays, or criminal record. If rejected, you can reapply with stronger documentation.',
        'multiple entry': 'A multiple entry visa allows you to enter and exit the country multiple times within the visa validity period. This is useful for frequent travelers or those making side trips to neighboring countries.',
        'visa on arrival': 'Visa on arrival (VOA) is available at the airport/border for eligible nationalities. Countries like Thailand, UAE, and Indonesia offer VOA. Always check if your nationality qualifies before traveling.',
        'evisa': 'An eVisa is an electronic visa issued online before travel. It\'s more convenient than embassy visits. Countries like India, Sri Lanka, Kenya, and many others offer eVisas through their official portals.',
        'overstay': 'Overstaying your visa is a serious offense that can result in fines, deportation, and future visa bans. Always leave before your visa expires. If you need to extend, apply for an extension before expiry.',
        'singapore': 'Singapore offers visa-free entry to 60+ nationalities. For others, a tourist visa costs SGD 30, valid for 30 days. Apply through the ICA website or authorized travel agents. Processing takes 3-5 business days.',
        'schengen': 'The Schengen Area includes 26 European countries. A single Schengen visa allows travel to all member states. Apply at the embassy of your main destination country. Requires travel insurance of at least €30,000.',
        'passport validity': 'Your passport must be valid for at least 6 months beyond your intended stay for most countries. Some countries require only 3 months validity. Always check the specific requirement for your destination.',
        'children': 'Children traveling with parents need their own passport and visa. If traveling with only one parent, a notarized consent letter from the other parent is often required. Birth certificates may also be needed.',
        'self employed': 'Self-employed applicants need: business registration certificate, 2 years of income tax returns, 6 months business bank statements, and a letter explaining the nature of business. Strong financial documents are crucial.',
    };

    private _messages = signal<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: '👋 Hello! I\'m **VisaBot**, your AI visa assistant. I can help you with:\n\n• Visa requirements for any country\n• Document checklist guidance\n• Application tips and timelines\n• Common visa questions\n\nWhat would you like to know? Try asking: *"Do I need hotel booking before applying?"* or *"What documents do I need for Singapore?"*',
            timestamp: new Date(),
        }
    ]);

    private _isTyping = signal(false);

    readonly messages = this._messages.asReadonly();
    readonly isTyping = this._isTyping.asReadonly();

    async sendMessage(content: string): Promise<void> {
        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date()
        };

        this._messages.update(msgs => [...msgs, userMsg]);
        this._isTyping.set(true);

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

        const response = this.generateResponse(content);
        const assistantMsg: ChatMessage = {
            id: `msg-${Date.now()}-ai`,
            role: 'assistant',
            content: response.text,
            timestamp: new Date(),
            sources: response.sources
        };

        this._isTyping.set(false);
        this._messages.update(msgs => [...msgs, assistantMsg]);
    }

    private generateResponse(query: string): { text: string; sources?: string[] } {
        const q = query.toLowerCase();

        // Find matching knowledge base entries
        const matches: string[] = [];
        for (const [key, value] of Object.entries(this.knowledgeBase)) {
            if (q.includes(key) || key.split(' ').some(word => q.includes(word))) {
                matches.push(value);
            }
        }

        if (matches.length > 0) {
            return {
                text: matches[0],
                sources: ['Official Embassy Guidelines', 'SVAP Knowledge Base']
            };
        }

        // Contextual responses
        if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
            return { text: 'Hello! 😊 How can I assist you with your visa application today? You can ask me about specific countries, required documents, processing times, or any other visa-related questions.' };
        }

        if (q.includes('thank')) {
            return { text: 'You\'re welcome! 🎉 Is there anything else I can help you with regarding your visa application? Safe travels!' };
        }

        if (q.includes('cost') || q.includes('fee') || q.includes('price')) {
            return {
                text: '💰 **Visa Fees Overview:**\n\n• **Singapore:** SGD 30\n• **Japan:** JPY 3,000 (~USD 20)\n• **Thailand:** THB 2,000 (~USD 55)\n• **USA (B-2):** USD 185\n• **UK:** GBP 115\n• **Schengen:** EUR 80\n• **Australia:** AUD 145\n• **Canada:** CAD 100\n\nFees are subject to change. Always verify on the official embassy website before applying.',
                sources: ['Embassy Official Websites']
            };
        }

        if (q.includes('document') || q.includes('require') || q.includes('need')) {
            return {
                text: '📋 **Standard Documents Required for Most Tourist Visas:**\n\n1. ✅ Valid passport (6+ months validity)\n2. ✅ Passport-size photographs\n3. ✅ Completed visa application form\n4. ✅ Return flight tickets\n5. ✅ Hotel/accommodation booking\n6. ✅ Bank statements (3 months)\n7. ✅ Travel insurance\n8. ✅ Employment letter / proof of income\n\nUse our **Checklist Generator** for a personalized list based on your profile!',
                sources: ['SVAP Knowledge Base']
            };
        }

        if (q.includes('time') || q.includes('long') || q.includes('days') || q.includes('week')) {
            return {
                text: '⏱️ **Typical Processing Times:**\n\n• **Singapore:** 3-5 business days\n• **Thailand:** 3-5 business days\n• **Japan:** 5-7 business days\n• **UK:** 3 weeks\n• **Schengen:** 15 calendar days\n• **USA:** 2-8 weeks (interview required)\n• **Australia:** 20-40 days\n• **Canada:** 2-8 weeks\n\n💡 **Tip:** Apply at least 4-6 weeks before travel to be safe!',
                sources: ['Embassy Processing Guidelines']
            };
        }

        // Default response
        return {
            text: `I understand you're asking about "${query}". While I may not have a specific answer for that, here are some helpful resources:\n\n• Use our **Country Overview** page to check visa requirements\n• Try our **Checklist Generator** for personalized documents\n• Visit the official embassy website for the most accurate information\n\nCould you rephrase your question? For example: "What documents do I need for [country]?" or "How long does [country] visa take?"`,
            sources: ['SVAP Knowledge Base']
        };
    }

    clearMessages() {
        this._messages.set([{
            id: 'welcome-new',
            role: 'assistant',
            content: '👋 Chat cleared! How can I help you with your visa journey today?',
            timestamp: new Date()
        }]);
    }
}
