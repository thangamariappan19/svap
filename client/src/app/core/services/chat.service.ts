import { Injectable, signal } from '@angular/core';
import { ChatMessage } from '../models/visa.models';

@Injectable({ providedIn: 'root' })
export class ChatService {

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

        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content })
            });
            const result = await response.json();

            if (result.success) {
                const assistantMsg: ChatMessage = {
                    ...result.data,
                    timestamp: new Date(result.data.timestamp)
                };
                this._messages.update(msgs => [...msgs, assistantMsg]);
            } else {
                throw new Error(result.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: ChatMessage = {
                id: `msg-${Date.now()}-error`,
                role: 'assistant',
                content: '⚠️ Sorry, I encountered an error connecting to the server. Please try again later.',
                timestamp: new Date()
            };
            this._messages.update(msgs => [...msgs, errorMsg]);
        } finally {
            this._isTyping.set(false);
        }
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
