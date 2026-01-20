import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Loader, ExternalLink, Bot, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import chatbotService from '@/lib/chatbotService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestedLink?: string;
  suggestedLinkText?: string;
}

// Service categories with keywords for smart detection
const SERVICE_CATEGORIES = {
  webDevelopment: {
    name: 'Web Development',
    link: '/web-development',
    keywords: ['web', 'website', 'web development', 'web app', 'frontend', 'backend', 'full stack', 'build website', 'develop website', 'responsive']
  },
  branding: {
    name: 'Branding & Identity',
    link: '/branding-identity',
    keywords: ['brand', 'branding', 'identity', 'logo', 'logo design', 'visual identity', 'brand design', 'corporate identity']
  },
  uiux: {
    name: 'UI/UX Design',
    link: '/uiux-design',
    keywords: ['ui', 'ux', 'interface', 'user experience', 'ui design', 'ux design', 'app design', 'interface design', 'wireframe']
  },
  animation3d: {
    name: '3D Animation',
    link: '/3d-animation',
    keywords: ['3d', 'animation', '3d animation', 'motion', 'motion graphics', 'visual effects', 'vfx', 'rendering', 'animated']
  },
  services: {
    name: 'All Services',
    link: '/services',
    keywords: ['order', 'services', 'offerings', 'what do you offer', 'your services']
  },
  portfolio: {
    name: 'Portfolio',
    link: '/#portfolio',
    keywords: ['portfolio', 'case study', 'showcase', 'examples', 'previous work', 'show me your work', 'your projects', 'featured projects', 'our work', 'past projects']
  },
  career: {
    name: 'Career',
    link: '/apply-employee',
    keywords: ['join team', 'team member', 'employment opportunity', 'vacancy', 'opening', 'position available', 'hiring', 'recruitment']
  },
  blog: {
    name: 'Blog',
    link: '/blog',
    keywords: ['blog', 'article', 'news', 'insights', 'tutorial', 'guide']
  }
};

const QUICK_QUESTIONS = [
  'Tell me about your services',
  "What's the pricing?",
  'Show me your portfolio',
  'How can I apply?'
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => 
    sessionStorage.getItem('chatbot_welcomed') === 'true'
  );
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatbot_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [unauthenticatedMessagesSent, setUnauthenticatedMessagesSent] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    }
  }, [isOpen]);

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      chatbotService.setToken(currentToken);
    }
  }, []);

  // Show initial unauthenticated messages when opening chat without login
  useEffect(() => {
    if (isOpen && !isAuthenticated && !unauthenticatedMessagesSent && messages.length === 0) {
      // Add welcome message
      const welcomeMsg: Message = {
        id: `msg-${Date.now()}-1`,
        text: 'Hi 👋 Welcome!',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMsg]);
      
      // Add login prompt after a slight delay
      setTimeout(() => {
        const loginMsg: Message = {
          id: `msg-${Date.now()}-2`,
          text: 'Please sign in first to continue chatting.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, loginMsg]);
      }, 800);
      
      setUnauthenticatedMessagesSent(true);
    }
  }, [isOpen, isAuthenticated, unauthenticatedMessagesSent, messages.length]);

  // Show notification on successful login
  useEffect(() => {
    if (isAuthenticated && !hasSeenWelcome) {
      setShowNotification(true);
      sessionStorage.setItem('chatbot_welcomed', 'true');
      setHasSeenWelcome(true);
      
      // Auto-hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasSeenWelcome]);

  // Open chatbot when authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen && messages.length <= 2 && unauthenticatedMessagesSent) {
      // Clear unauthenticated messages and start fresh
      setMessages([]);
      setUnauthenticatedMessagesSent(false);
    }
  }, [isAuthenticated, isOpen]);

  // Smart keyword matching for intent detection
  const detectServiceAndResponse = useCallback((userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Bye detection
    if (/\b(bye|goodbye|see you|farewell|take care|see ya|later|cya|adios|ciao)\b/.test(lowerMessage)) {
      const sendOffMessages = [
        "👋 Goodbye! It was great chatting with you. Feel free to come back anytime!",
        "🌟 Take care! Looking forward to our next conversation. Have a wonderful day!",
        "🚀 Until next time! Don't hesitate to reach out when you need creative solutions.",
        "✨ Farewell! Remember, we're always here to help with your creative projects.",
      ];
      return {
        response: sendOffMessages[Math.floor(Math.random() * sendOffMessages.length)],
        suggestedLink: undefined,
        suggestedLinkText: undefined,
      };
    }

    // Check for service keywords
    for (const [category, data] of Object.entries(SERVICE_CATEGORIES)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return {
          response: `Great! You're interested in ${data.name}. Let me show you more details about this service!`,
          suggestedLink: data.link,
          suggestedLinkText: data.name,
        };
      }
    }

    return null;
  }, []);

  const handleSendMessage = useCallback(async () => {
    // Prevent sending if not authenticated
    if (!isAuthenticated) {
      return;
    }

    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // First check for quick response patterns
      const quickResponse = detectServiceAndResponse(inputValue);
      
      if (quickResponse) {
        const botMessage: Message = {
          id: `msg-${Date.now()}-bot`,
          text: quickResponse.response,
          sender: 'bot',
          timestamp: new Date(),
          suggestedLink: quickResponse.suggestedLink,
          suggestedLinkText: quickResponse.suggestedLinkText,
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fall back to server API
        const response = await chatbotService.sendMessage(inputValue, sessionId);
        
        if (response.success && response.data) {
          const botMessage: Message = {
            id: `msg-${Date.now()}-bot`,
            text: response.data.response,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botMessage]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isAuthenticated, sessionId, detectServiceAndResponse]);

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    navigate('/login');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isAuthenticated && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Chatbot is always visible, but input is disabled when not authenticated
  return (
    <div className="fixed bottom-4 right-4 z-30">
      {/* Notification Badge - Only when logged in */}
      {showNotification && isAuthenticated && (
        <div className="absolute bottom-24 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse text-sm font-medium mb-2">
          ✨ Chatbot unlocked!
        </div>
      )}

      {/* Chat Window */}
      {isOpen ? (
        <div className="w-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <h3 className="font-bold text-white">RajKayal AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/30">
            {messages.length === 0 && isAuthenticated && (
              <div className="text-center py-8">
                <Bot size={40} className="mx-auto text-slate-500 mb-2" />
                <p className="text-slate-400 text-sm">Hi! How can I help you today?</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-700 text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.suggestedLink && (
                    <a
                      href={msg.suggestedLink}
                      className="inline-flex items-center gap-1 mt-2 text-blue-300 hover:text-blue-200 text-xs underline"
                    >
                      {msg.suggestedLinkText}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 rounded-lg rounded-bl-none px-4 py-2">
                  <Loader size={20} className="animate-spin text-blue-400" />
                </div>
              </div>
            )}

            {!isAuthenticated && unauthenticatedMessagesSent && (
              <div className="mt-4 pt-4 border-t border-slate-600">
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Sign In to Chat
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {isAuthenticated ? (
            <div className="border-t border-slate-700 p-3 bg-slate-800/50">
              {/* Quick Questions */}
              {messages.length === 0 && (
                <div className="mb-3 flex gap-2 flex-wrap">
                  {QUICK_QUESTIONS.slice(0, 2).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickQuestion(q)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg px-3 py-2 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-700 p-3 bg-slate-800/50">
              <p className="text-xs text-slate-500 text-center mb-2">
                Please sign in to chat
              </p>
              <input
                type="text"
                placeholder="Please sign in to chat"
                disabled
                className="w-full bg-slate-700/50 text-slate-500 rounded-lg px-3 py-2 text-sm placeholder-slate-600 focus:outline-none"
              />
            </div>
          )}
        </div>
      ) : (
        /* Chat Button */
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          aria-label="Open chatbot"
        >
          {!isAuthenticated ? (
            <div className="relative">
              <MessageCircle size={24} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <LogIn size={12} className="text-slate-900" />
              </div>
            </div>
          ) : (
            <MessageCircle size={24} />
          )}
        </button>
      )}
    </div>
  );
}
