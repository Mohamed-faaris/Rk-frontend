import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            console.log('ChatBot button clicked');
            setIsOpen(true);
          }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 bg-accent hover:bg-accent/90 text-accent-foreground p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Open chatbot"
          title="Open SIRA AI Assistant"
          style={{ zIndex: 9999 }}
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 w-full sm:w-96 h-full sm:h-[680px] bg-card rounded-none sm:rounded-lg shadow-2xl flex flex-col z-50 border border-border/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-4 sm:p-5 flex justify-between items-center rounded-none sm:rounded-t-lg sticky top-0 z-10 border-b border-border/30">
            <div>
              <h3 className="font-semibold text-sm sm:text-base">SIRA - AI Assistant</h3>
              <p className="text-xs text-primary-foreground/70">Chat Support</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary/80 p-2 ml-2 rounded transition-colors"
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4 bg-background scroll-smooth flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="font-semibold mb-2">Welcome to SIRA! 👋</p>
              <p className="text-sm">I'm here to help you with any questions.</p>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-border/30 p-4 sm:p-5 bg-card rounded-none sm:rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2.5 sm:py-3 border border-input rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-xs sm:text-sm bg-background text-foreground placeholder-muted-foreground transition-colors"
              />
              <button className="bg-accent hover:bg-accent/90 text-accent-foreground p-2.5 sm:p-3 rounded-lg transition-all duration-200 flex-shrink-0 font-semibold">
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
