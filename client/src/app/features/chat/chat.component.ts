import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper chat-page">
      <div class="chat-layout">

        <!-- ── Sidebar ── -->
        <div class="chat-sidebar glass-card">
          <div class="sidebar-header">
            <div class="bot-avatar">🤖</div>
            <div>
              <h3>VisaBot AI</h3>
              <div class="bot-status"><span class="status-dot"></span> Online</div>
            </div>
          </div>

          <div class="sidebar-section">
            <h4>Quick Questions</h4>
            <div class="quick-questions">
              @for (q of quickQuestions; track q) {
                <button class="quick-q" (click)="sendQuick(q)">{{ q }}</button>
              }
            </div>
          </div>

          <div class="sidebar-section">
            <h4>Topics I Can Help With</h4>
            <ul class="topic-list">
              @for (topic of topics; track topic) {
                <li>{{ topic }}</li>
              }
            </ul>
          </div>

          <div class="sidebar-actions">
            <button class="btn btn-secondary" style="width:100%;justify-content:center" (click)="chatService.clearMessages()">
              🗑️ Clear Chat
            </button>
          </div>
        </div>

        <!-- ── Chat Main ── -->
        <div class="chat-main">
          <div class="chat-header glass-card">
            <div class="chat-header-info">
              <span class="chat-icon">🤖</span>
              <div>
                <h2>AI Visa Assistant</h2>
                <p>Powered by RAG + Embassy Knowledge Base</p>
              </div>
            </div>
            <div class="header-badges">
              <span class="badge badge-success">● Live</span>
              <span class="badge badge-primary">AI Powered</span>
            </div>
          </div>

          <!-- Messages -->
          <div class="messages-container" #messagesContainer>
            @for (msg of chatService.messages(); track msg.id) {
              <div class="message" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'">
                @if (msg.role === 'assistant') {
                  <div class="msg-avatar">🤖</div>
                }
                <div class="msg-bubble">
                  <div class="msg-content" [innerHTML]="formatMessage(msg.content)"></div>
                  @if (msg.sources?.length) {
                    <div class="msg-sources">
                      <span class="sources-label">Sources:</span>
                      @for (src of msg.sources; track src) {
                        <span class="source-chip">{{ src }}</span>
                      }
                    </div>
                  }
                  <div class="msg-time">{{ msg.timestamp | date:'h:mm a' }}</div>
                </div>
                @if (msg.role === 'user') {
                  <div class="msg-avatar user-avatar">👤</div>
                }
              </div>
            }

            @if (chatService.isTyping()) {
              <div class="message assistant">
                <div class="msg-avatar">🤖</div>
                <div class="msg-bubble typing-bubble">
                  <div class="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Input -->
          <div class="chat-input-area glass-card">
            <div class="input-row">
              <input
                type="text"
                class="chat-input"
                placeholder="Ask anything about visas... (e.g., 'Do I need hotel booking for Singapore?')"
                [(ngModel)]="inputText"
                (keydown.enter)="send()"
                [disabled]="chatService.isTyping()"
                id="chat-input"
                #chatInput
              />
              <button
                class="send-btn"
                (click)="send()"
                [disabled]="!inputText.trim() || chatService.isTyping()"
              >
                @if (chatService.isTyping()) {
                  <span class="spinner"></span>
                } @else {
                  <span>➤</span>
                }
              </button>
            </div>
            <div class="input-hint">
              Press Enter to send · Powered by AI + Embassy Knowledge Base
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-page {
      height: 100vh; overflow: hidden;
      display: flex; flex-direction: column;
    }
    .chat-layout {
      display: grid; grid-template-columns: 300px 1fr;
      gap: 1.5rem; padding: 1.5rem;
      height: calc(100vh - var(--navbar-height));
      max-width: 1280px; margin: 0 auto; width: 100%;
    }
    @media (max-width: 900px) {
      .chat-layout { grid-template-columns: 1fr; }
      .chat-sidebar { display: none; }
      .chat-page { height: auto; overflow: auto; }
    }

    /* Sidebar */
    .chat-sidebar { padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; }
    .sidebar-header { display: flex; align-items: center; gap: 1rem; }
    .bot-avatar { font-size: 2.5rem; }
    .sidebar-header h3 { font-size: 1.125rem; margin-bottom: 0.25rem; }
    .bot-status { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; color: var(--accent-500); }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-500); animation: pulse-glow 2s infinite; }
    .sidebar-section h4 { font-size: 0.8125rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
    .quick-questions { display: flex; flex-direction: column; gap: 0.5rem; }
    .quick-q {
      text-align: left; padding: 0.625rem 0.875rem;
      background: var(--bg-glass-dark); border: 1px solid var(--border-glass);
      border-radius: var(--radius-md); color: var(--text-secondary);
      font-size: 0.8125rem; cursor: pointer; transition: all var(--transition-fast);
    }
    .quick-q:hover { background: var(--primary-500); color: white; border-color: transparent; }
    .topic-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .topic-list li { font-size: 0.875rem; color: var(--text-secondary); padding: 0.375rem 0; border-bottom: 1px solid var(--border-color); }
    .topic-list li::before { content: '✓ '; color: var(--accent-500); font-weight: 700; }
    .sidebar-actions { margin-top: auto; }

    /* Chat Main */
    .chat-main { display: flex; flex-direction: column; gap: 1rem; min-height: 0; }
    .chat-header {
      padding: 1rem 1.5rem; display: flex; align-items: center;
      justify-content: space-between; flex-shrink: 0;
    }
    .chat-header-info { display: flex; align-items: center; gap: 1rem; }
    .chat-icon { font-size: 2rem; }
    .chat-header h2 { font-size: 1.125rem; margin-bottom: 0.125rem; }
    .chat-header p { font-size: 0.8125rem; color: var(--text-muted); }
    .header-badges { display: flex; gap: 0.5rem; }

    /* Messages */
    .messages-container {
      flex: 1; overflow-y: auto; display: flex; flex-direction: column;
      gap: 1rem; padding: 1rem; min-height: 0;
      background: var(--bg-glass); backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass); border-radius: var(--radius-lg);
    }
    .message { display: flex; align-items: flex-end; gap: 0.75rem; }
    .message.user { flex-direction: row-reverse; }
    .msg-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--bg-glass-dark); display: flex; align-items: center;
      justify-content: center; font-size: 1.125rem; flex-shrink: 0;
    }
    .user-avatar { background: var(--gradient-primary); }
    .msg-bubble {
      max-width: 70%; padding: 0.875rem 1.125rem;
      border-radius: var(--radius-lg); position: relative;
    }
    .message.assistant .msg-bubble {
      background: var(--bg-glass); border: 1px solid var(--border-glass);
      border-bottom-left-radius: 4px;
    }
    .message.user .msg-bubble {
      background: var(--gradient-primary); color: white;
      border-bottom-right-radius: 4px;
    }
    .msg-content { font-size: 0.9375rem; line-height: 1.6; white-space: pre-wrap; }
    .message.user .msg-content { color: white; }
    .msg-sources { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem; }
    .sources-label { font-size: 0.75rem; color: var(--text-muted); }
    .source-chip { font-size: 0.6875rem; padding: 0.125rem 0.5rem; background: var(--bg-glass-dark); border-radius: var(--radius-full); color: var(--primary-400); }
    .msg-time { font-size: 0.6875rem; color: var(--text-muted); margin-top: 0.375rem; }
    .message.user .msg-time { color: rgba(255,255,255,0.6); text-align: right; }

    /* Typing */
    .typing-bubble { padding: 1rem 1.25rem; }
    .typing-dots { display: flex; gap: 4px; align-items: center; }
    .typing-dots span {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--primary-400); animation: bounce 1.2s infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1.2); opacity: 1; }
    }

    /* Input */
    .chat-input-area { padding: 1rem 1.25rem; flex-shrink: 0; }
    .input-row { display: flex; gap: 0.75rem; align-items: center; }
    .chat-input {
      flex: 1; padding: 0.875rem 1.25rem;
      background: var(--bg-glass-dark); border: 1px solid var(--border-glass);
      border-radius: var(--radius-full); color: var(--text-primary);
      font-size: 0.9375rem; font-family: var(--font-sans); outline: none;
      transition: all var(--transition-fast);
    }
    .chat-input:focus { border-color: var(--primary-400); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
    .chat-input::placeholder { color: var(--text-muted); }
    .send-btn {
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--gradient-primary); border: none; cursor: pointer;
      color: white; font-size: 1.125rem; display: flex; align-items: center; justify-content: center;
      transition: all var(--transition-fast); flex-shrink: 0;
    }
    .send-btn:hover:not(:disabled) { transform: scale(1.1); box-shadow: 0 4px 12px rgba(99,102,241,0.4); }
    .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .spinner {
      width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    .input-hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center; }
  `]
})
export class ChatComponent implements AfterViewChecked {
  chatService = inject(ChatService);
  inputText = '';

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  quickQuestions = [
    'Do I need hotel booking before applying?',
    'Can I apply 2 months early?',
    'What bank balance do I need?',
    'How long does Singapore visa take?',
    'What is a Schengen visa?',
    'What if my visa is rejected?'
  ];

  topics = [
    'Visa requirements by country',
    'Required documents',
    'Processing times & fees',
    'Bank balance requirements',
    'Travel insurance guidance',
    'Visa on arrival eligibility',
    'eVisa application process',
    'Visa rejection & reapplication'
  ];

  async send() {
    const text = this.inputText.trim();
    if (!text || this.chatService.isTyping()) return;
    this.inputText = '';
    await this.chatService.sendMessage(text);
  }

  async sendQuick(q: string) {
    if (this.chatService.isTyping()) return;
    await this.chatService.sendMessage(q);
  }

  formatMessage(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch { }
  }
}
