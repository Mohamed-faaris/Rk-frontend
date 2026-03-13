import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Loader, ExternalLink, Bot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import chatbotService from '@/lib/chatbotService';
import { logger } from '@/lib/logger';
import { serviceCategories } from '@/lib/serviceCatalog';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestedLink?: string;
  suggestedLinkText?: string;
}

// Natural language intent map — conversational phrases mapped to service category IDs
const NL_INTENTS: { patterns: string[]; categoryId: string }[] = [
  // Photoshop / Image editing
  { patterns: ['edit my photo', 'edit photo', 'edit my image', 'edit image', 'photo edit', 'need to edit photo', 'fix my photo', 'fix photo', 'enhance photo', 'enhance image', 'photo editing needed', 'image editing needed'], categoryId: 'photoshop-services' },
  { patterns: ['retouch', 'photo retouch', 'skin retouch', 'face retouch', 'remove wrinkles', 'clear photo'], categoryId: 'photoshop-services' },
  { patterns: ['remove background', 'remove bg', 'cut background', 'cut out background', 'transparent background', 'background cut out', 'erase background'], categoryId: 'photoshop-services' },
  { patterns: ['photo manipulation', 'image manipulation', 'composite photo', 'montage photo'], categoryId: 'photoshop-services' },
  // Logo Design
  { patterns: ['need a logo', 'i need a logo', 'want a logo', 'create a logo', 'make a logo', 'design a logo', 'get a logo', 'logo for my business', 'logo for my brand', 'new logo needed', 'need logo'], categoryId: 'logo-design' },
  // ID Card
  { patterns: ['need id card', 'make id card', 'design id card', 'id card for school', 'id card for college', 'id badge', 'student id card', 'employee id card', 'staff id', 'need identity card'], categoryId: 'id-card' },
  // Printing
  { patterns: ['visiting card', 'visiting cards', 'business card', 'business cards', 'name card', 'need visiting card', 'design business card', 'print visiting card'], categoryId: 'printing-designs' },
  { patterns: ['letterhead design', 'need letterhead', 'company letterhead', 'official letterhead', 'design letterhead'], categoryId: 'printing-designs' },
  { patterns: ['invoice design', 'bill book design', 'bill design', 'receipt design', 'challan design', 'bill book needed'], categoryId: 'printing-designs' },
  { patterns: ['envelope design', 'design envelope', 'envelope needed'], categoryId: 'printing-designs' },
  // Advertisement
  { patterns: ['need a poster', 'make a poster', 'design a poster', 'event poster', 'poster for event', 'create poster', 'promo poster', 'poster needed'], categoryId: 'advertisement-designs' },
  { patterns: ['need a flyer', 'make a flyer', 'design a flyer', 'event flyer', 'product flyer', 'flyer needed'], categoryId: 'advertisement-designs' },
  { patterns: ['banner design', 'make a banner', 'design a banner', 'flex design', 'hoarding design', 'outdoor banner', 'standee design', 'banner needed'], categoryId: 'advertisement-designs' },
  // Social Media
  { patterns: ['instagram post', 'instagram design', 'facebook post', 'facebook design', 'social media post', 'social media design', 'social media creative', 'post design', 'social posts', 'content design', 'need social media content'], categoryId: 'social-media-designs' },
  { patterns: ['instagram ad', 'facebook ad', 'social media ad', 'paid ad design', 'ad creative', 'social ad'], categoryId: 'social-media-designs' },
  // Video Editing
  { patterns: ['edit my video', 'edit a video', 'need video editing', 'video edit needed', 'video editor needed', 'cut my video', 'trim video', 'video editing service'], categoryId: 'video-editing' },
  { patterns: ['edit youtube', 'youtube editing', 'edit youtube video', 'youtube video editor', 'edit my youtube', 'youtube video editing needed'], categoryId: 'video-editing' },
  { patterns: ['edit my reel', 'reel editing', 'reel edit', 'edit reel', 'instagram reel', 'edit shorts', 'shorts editing', 'reel needed'], categoryId: 'video-editing' },
  { patterns: ['promo video', 'promotional video', 'ad video', 'product video', 'commercial video', 'advertisement video', 'video for my brand'], categoryId: 'video-editing' },
  // Branding
  { patterns: ['shop board', 'signboard', 'sign board', 'shop sign', 'name board', 'shop name board', 'store sign'], categoryId: 'branding-designs' },
  { patterns: ['vehicle design', 'lorry design', 'truck design', 'van design', 'car wrap', 'vehicle branding', 'lorry branding'], categoryId: 'branding-designs' },
  { patterns: ['complete branding', 'full branding', 'brand kit', 'branding package', 'brand package', 'full brand design'], categoryId: 'branding-designs' },
  // Website Design
  { patterns: ['design my website', 'need website design', 'web design needed', 'create landing page', 'landing page design', 'need a landing page', 'make landing page', 'landing page needed'], categoryId: 'website-design' },
  // Website Development
  { patterns: ['make a website', 'build a website', 'create a website', 'need a website', 'i need a website', 'develop a website', 'want a website', 'get a website', 'new website', 'website for my business', 'website for my shop', 'website for school', 'website for college', 'personal website', 'portfolio website needed', 'blog website needed'], categoryId: 'website-development' },
  // E-Commerce
  { patterns: ['online store', 'sell online', 'start online shop', 'ecommerce website', 'e-commerce website', 'shopping website', 'sell my products online', 'online selling', 'product website', 'need online shop', 'want to sell online'], categoryId: 'ecommerce-development' },
  // Software Development
  { patterns: ['school management', 'college management', 'shop management', 'inventory management', 'management software', 'management system', 'business management system', 'erp system'], categoryId: 'software-development' },
  { patterns: ['desktop app', 'desktop application', 'desktop software', 'windows application', 'custom software', 'business software', 'office software', 'need application'], categoryId: 'software-development' },
  // Web Maintenance
  { patterns: ['fix my website', 'website not working', 'website broken', 'update my website', 'website support', 'monthly website support', 'website stopped working'], categoryId: 'web-maintenance' },
  // Tech Services
  { patterns: ['hosting setup', 'set up hosting', 'need hosting', 'web hosting setup', 'website hosting needed'], categoryId: 'tech-services' },
  { patterns: ['domain setup', 'register domain', 'need a domain', 'domain registration', 'buy a domain', 'domain for my website'], categoryId: 'tech-services' },
  { patterns: ['deploy website', 'website deployment', 'launch my website', 'go live', 'put website online', 'publish website'], categoryId: 'tech-services' },
  { patterns: ['fix bugs', 'bug fixing', 'debug code', 'fix code error', 'code debugging', 'code not working', 'website has errors'], categoryId: 'tech-services' },
];

const SIRA_SPECIALTY_SERVICES = [
  {
    name: 'UI/UX Design',
    link: '/uiux-design',
    icon: '✨',
    description: 'User experience design, wireframes, user flows, and interface systems for apps and websites.',
    keywords: ['ui', 'ux', 'user experience', 'interface design', 'wireframe', 'prototype', 'app design', 'user interface', 'ui design', 'ux design'],
    nlPatterns: ['design my app', 'app interface', 'app screens', 'need ux design', 'need ui design', 'user flow', 'wireframe design', 'prototype design', 'mobile app design', 'app layout'],
    pricingNote: 'UI/UX projects are quoted based on screen count, user flows, research depth, prototyping needs, and revisions.',
  },
  {
    name: '3D Animation',
    link: '/3d-animation',
    icon: '🎬',
    description: '3D animation, product visualization, motion graphics, and rendered scenes.',
    keywords: ['3d', '3d animation', 'motion graphics', 'vfx', 'rendering', 'visual effects', '3d model'],
    nlPatterns: ['3d animation', '3d model', 'product animation', 'product 3d', 'animated explainer', '3d render', 'motion graphic', 'animated logo'],
    pricingNote: '3D animation pricing depends on duration, modeling complexity, and render quality. Contact us for a scope-based quote.',
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  'id-card': '🪪', 'logo-design': '🎨', 'printing-designs': '🖨️',
  'advertisement-designs': '📢', 'social-media-designs': '📱', 'video-editing': '🎬',
  'photoshop-services': '🖼️', 'branding-designs': '🏪', 'website-design': '🖥️',
  'website-development': '💻', 'ecommerce-development': '🛒', 'web-maintenance': '🔧',
  'software-development': '⚙️', 'tech-services': '🌐',
};

const CATEGORY_TIMELINES: Record<string, string> = {
  'id-card': 'ID card designs are usually delivered in 1-2 working days.',
  'logo-design': 'Logo design typically takes 2-4 working days depending on the package and revision rounds.',
  'printing-designs': 'Print design files are usually ready in 1-3 working days.',
  'advertisement-designs': 'Poster, flyer, and banner designs usually take 1-3 working days.',
  'social-media-designs': 'Social media posts and creatives are usually delivered in 1-2 working days.',
  'video-editing': 'Video editing timelines range from 1-5 days based on footage length, subtitles, and revisions.',
  'photoshop-services': 'Photo editing and retouching is usually completed in 1-3 working days.',
  'branding-designs': 'Individual branding items (shop boards, vehicle designs) take 1-3 days; full packages take 3-7 days.',
  'website-design': 'Website design ranges from 1-3 weeks depending on page count and content readiness.',
  'website-development': 'Website development typically takes 2-4 weeks based on features and complexity.',
  'ecommerce-development': 'E-commerce builds take 3-10 weeks depending on product count and integrations.',
  'web-maintenance': 'Bug fixes and small updates are usually handled within 1-3 working days.',
  'software-development': 'Custom software projects take 2-8+ weeks depending on scope and testing needs.',
  'tech-services': 'Hosting setup, domain registration, and deployment tasks are usually done in 1-2 working days.',
};

const _formatServiceLines = (services: { name: string; price: string }[]) =>
  services.map((s) => `• ${s.name}: ${s.price}`).join('\n');

const _findCatalogMatchByNL = (msg: string) => {
  // First pass: check natural language intent phrases
  for (const intent of NL_INTENTS) {
    for (const pattern of intent.patterns) {
      if (msg.includes(pattern)) {
        return serviceCategories.find((c) => c.id === intent.categoryId) ?? null;
      }
    }
  }
  // Second pass: score by category title + service name
  let bestMatch = null;
  let highestScore = 0;
  for (const category of serviceCategories) {
    let score = 0;
    if (msg.includes(category.title.toLowerCase())) score += 10;
    for (const svc of category.services) {
      if (msg.includes(svc.name.toLowerCase())) score += 6;
    }
    for (const word of category.id.split('-')) {
      if (word.length > 3 && msg.includes(word)) score += 1;
    }
    if (score > highestScore) { highestScore = score; bestMatch = category; }
  }
  return highestScore > 0 ? bestMatch : null;
};

const _findSpecialtyMatchByNL = (msg: string) => {
  for (const s of SIRA_SPECIALTY_SERVICES) {
    for (const p of s.nlPatterns) { if (msg.includes(p)) return s; }
    for (const kw of s.keywords) { if (msg.includes(kw)) return s; }
  }
  return null;
};

const QUICK_QUESTIONS = [
  'What services do you offer?',
  'I need to edit my photo',
  'How much does a website cost?',
  'I need a logo for my business',
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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

  useEffect(() => {
    // Show notification on first login
    if (user && !hasSeenWelcome) {
      setShowNotification(true);
      sessionStorage.setItem('chatbot_welcomed', 'true');
      setHasSeenWelcome(true);
      
      // Auto-hide notification after 8 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [user, hasSeenWelcome]);

  // Smart NL-based intent detection using full service catalog
  const detectServiceAndResponse = useCallback((userMessage: string) => {
    const msg = userMessage.toLowerCase().trim();

    // Bye
    if (/\b(bye|goodbye|see you|farewell|take care|see ya|later|cya|adios|ciao)\b/.test(msg)) {
      const offs = [
        '👋 Goodbye! It was great chatting with you. Feel free to come back anytime!',
        '🌟 Take care! Looking forward to our next conversation. Have a wonderful day!',
        "🚀 Until next time! Don't hesitate to reach out when you need creative solutions.",
        "✨ Farewell! Remember, we're always here to help with your creative projects.",
        '💫 See you soon! Thanks for exploring RK Creative Hub with me.',
      ];
      return { response: offs[Math.floor(Math.random() * offs.length)], link: null, linkText: null };
    }

    // Greeting
    if (/^(hello|hi|hey|greetings|start|help|what can you do)\b/.test(msg)) {
      return {
        response: `👋 Hello ${user?.name || 'there'}! I'm SIRA, your AI Assistant at RK Creative Hub.\n\nJust describe what you need in plain words and I'll suggest the right service — for example:\n💬 "I need to edit my photo"\n💬 "Build me a website"\n💬 "Design a logo for my business"`,
        link: '/services',
        linkText: 'Browse All Services',
      };
    }

    // Career / Job
    if (/work for you|work with you|join your team|join the team|looking for job|seeking job|want to work|apply for job|job application|employment|join company|need to join|join in work|want to join|interested in joining|join your company|i need to join|like to work|interested in working|seeking for job|looking for employment|job seeker/i.test(msg)) {
      return {
        response: `That's wonderful! 🎉 We're always looking for talented creative professionals.\n\nWe work across web development, UI/UX design, branding, animation, and video production.\n\nHave your resume, portfolio, and a short intro ready before applying.`,
        link: '/apply-employee',
        linkText: 'Apply for a Position',
      };
    }

    // Contact
    if (/contact|call|reach|email|phone|get in touch/.test(msg)) {
      return {
        response: `📞 You can reach us:\n\n📧 Email: rajkayal7281@gmail.com\n💬 Chat: Right here in SIRA!\n📋 Contact page: Best for project briefs`,
        link: '/contact',
        linkText: 'Contact Us',
      };
    }

    // Portfolio
    if (/portfolio|case study|previous work|what have you done|examples|show me your work/.test(msg)) {
      return {
        response: 'You can contact us for recent project samples and delivery examples across branding, websites, and creative design.',
        link: '/contact',
        linkText: 'Request Project Samples',
      };
    }

    const matchedCategory = _findCatalogMatchByNL(msg);
    const matchedSpecialty = _findSpecialtyMatchByNL(msg);
    const hasPricingIntent = /price|cost|how much|pricing|quote|budget|rate|charges/.test(msg);
    const hasTimelineIntent = /how long|timeline|delivery|deadline|how fast|duration/.test(msg);

    // Pricing + specific category
    if (hasPricingIntent && matchedCategory) {
      return {
        response: `${CATEGORY_ICONS[matchedCategory.id] ?? '✨'} ${matchedCategory.title} pricing:\n\n${_formatServiceLines(matchedCategory.services)}\n\nThese are starting ranges. Final cost depends on complexity, revisions, and turnaround.`,
        link: '/services',
        linkText: `View ${matchedCategory.title}`,
      };
    }

    // Pricing + specialty
    if (hasPricingIntent && matchedSpecialty?.pricingNote) {
      return {
        response: `${matchedSpecialty.icon} ${matchedSpecialty.name} is available but usually quoted after understanding the scope.\n\n${matchedSpecialty.pricingNote}`,
        link: matchedSpecialty.link,
        linkText: `Explore ${matchedSpecialty.name}`,
      };
    }

    // General pricing overview
    if (hasPricingIntent) {
      return {
        response: `💰 Quick pricing overview:\n\n🎨 Logo Design: ₹800 - ₹5,000+\n🖨️ Print Designs: ₹150 - ₹800\n📢 Posters / Banners: ₹500 - ₹2,000\n📱 Social Media Posts: ₹200 - ₹700\n🎬 Video Editing: ₹300 - ₹6,000\n🖼️ Photo Editing: ₹50 - ₹1,500\n🖥️ Website Design: ₹2,000 - ₹30,000\n💻 Website Dev: ₹5,000 - ₹35,000\n🛒 E-Commerce: ₹15,000 - ₹1,50,000+\n⚙️ Software Dev: ₹5,000 - ₹80,000\n\nTell me the specific service for exact pricing!`,
        link: '/services',
        linkText: 'View Full Pricing Catalog',
      };
    }

    // Timeline + specific category
    if (hasTimelineIntent && matchedCategory) {
      return {
        response: `⏱️ ${matchedCategory.title} delivery:\n\n${CATEGORY_TIMELINES[matchedCategory.id] ?? 'Delivery depends on complexity, content readiness, and revision rounds.'}`,
        link: '/services',
        linkText: `Enquire ${matchedCategory.title}`,
      };
    }

    // General timeline
    if (hasTimelineIntent) {
      return {
        response: `⏱️ Delivery by type:\n\n📌 Design work (logos, posters, IDs): 1-3 working days\n📌 Video editing: 1-5 working days\n📌 Website design: 1-3 weeks\n📌 Website development: 2-4 weeks\n📌 E-commerce / software: 3-10+ weeks\n\nTell me which service and I'll give a more precise estimate.`,
        link: '/services',
        linkText: 'Discuss Your Project',
      };
    }

    // Matched catalog category (including NL intents like "edit my photo")
    if (matchedCategory) {
      return {
        response: `${CATEGORY_ICONS[matchedCategory.id] ?? '✨'} Based on what you described, I'd suggest our ${matchedCategory.title} service.\n\nHere are the options:\n${_formatServiceLines(matchedCategory.services)}\n\nWould you like to place an enquiry for this?`,
        link: '/services',
        linkText: `Explore ${matchedCategory.title}`,
      };
    }

    // Matched specialty service
    if (matchedSpecialty) {
      return {
        response: `${matchedSpecialty.icon} Based on what you described, I'd suggest our ${matchedSpecialty.name} service.\n\n${matchedSpecialty.description}`,
        link: matchedSpecialty.link,
        linkText: `Explore ${matchedSpecialty.name}`,
      };
    }

    // Services overview intent
    if (/service|services|offer|offering|catalog|what do you do/.test(msg)) {
      return {
        response: `Here's what we help with:\n\n🪪 ID Card Designs\n🎨 Logo Design\n🖨️ Printing Designs (visiting cards, letterheads)\n📢 Advertisement Designs (posters, banners)\n📱 Social Media Designs\n🎬 Video Editing\n🖼️ Photoshop Services\n🏪 Branding (shop boards, vehicle designs)\n🖥️ Website Design\n💻 Website Development\n🛒 E-Commerce Stores\n🔧 Web Maintenance\n⚙️ Software Development\n🌐 Hosting, Domains & Deployment\n✨ UI/UX Design\n🎬 3D Animation\n\nJust describe your need and I'll match you to the right service!`,
        link: '/services',
        linkText: 'View Pricing Catalog',
      };
    }

    // Default fallback
    return {
      response: `🤔 I didn't quite catch that. Try describing what you need, for example:\n\n💬 "I need to edit my photo"\n💬 "Build me a website for my business"\n💬 "Design a logo for my brand"\n💬 "How much does video editing cost?"\n💬 "I need a poster for my event"\n\nI'll suggest the right service right away!`,
      link: '/services',
      linkText: 'Browse All Services',
    };
  }, [user?.name]);

  const handleOpenChat = useCallback(() => {
    setIsOpen(true);
    setShowNotification(false);
    
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: `Hi ${user?.name || 'there'}! 🌟 I'm SIRA, your friendly AI assistant. How can I help you discover our creative services today?`,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [messages.length, user?.name]);

  const handleSendMessage = useCallback(async (text?: string) => {
    const messageText = (text || inputValue).trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get smart response with intent detection
      const { response, link, linkText } = detectServiceAndResponse(messageText);
      logger.debug('Detected response:', { response, link, linkText });
      
      // Check if this is a bye message to auto-close chat
      const isByeMessage = /\b(bye|goodbye|see you|farewell|take care|see ya|later|cya|adios|ciao)\b/.test(messageText.toLowerCase());
      
      let botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        suggestedLink: link,
        suggestedLinkText: linkText
      };

      // If user is not authenticated, add login suggestion to response
      if (!user) {
        botMsg.text = `${response}\n\n✨ **Want personalized recommendations and to place orders?** Sign in to unlock full features!`;
        botMsg.suggestedLink = '/login';
        botMsg.suggestedLinkText = '🔐 Sign In / Create Account';
      }
      
      // Send to backend if authenticated
      if (user && user.id && user.email) {
        try {
          const apiResponse = await chatbotService.sendMessage(
            user.id,
            user.name || user.email,
            user.email,
            messageText,
            sessionId,
            'general'
          );
          
          // Use API response if available and valid
          if (apiResponse?.botMessage) {
            botMsg = {
              id: (Date.now() + 1).toString(),
              text: apiResponse.botMessage.message || response,
              sender: 'bot',
              timestamp: new Date(),
              suggestedLink: apiResponse.suggestedLink || link,
              suggestedLinkText: apiResponse.suggestedLinkText || linkText
            };
          }
          logger.debug('API Bot Message:', botMsg);
        } catch (apiError) {
          // Fallback to client-side response if API fails
          logger.warn('API error, using fallback response:', apiError);
        }
      }
      
      setMessages(prev => [...prev, botMsg]);
      
      // Auto-close chat after bye message with delay
      if (isByeMessage) {
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      }
    } catch (error) {
      logger.error('Error processing message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, user, sessionId, detectServiceAndResponse]);

  const handleQuestionClick = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  const handleLinkClick = useCallback((link: string) => {
    logger.debug('Navigating to:', link);
    navigate(link);
    setIsOpen(false);
  }, [navigate]);

  const handleCloseChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleDismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
          <button
            onClick={handleOpenChat}
            className="group relative h-14 w-14 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground rounded-full shadow-xl transition-all duration-300 hover:from-accent/90 hover:to-accent/70 hover:shadow-2xl hover:scale-110 flex items-center justify-center"
            aria-label="Open SIRA AI Assistant"
            title="Open SIRA AI Assistant"
          >
            <Bot size={28} className="transition-transform group-hover:rotate-12" />
            
            {/* Red Glow Notification Dot */}
            {showNotification && (
              <>
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50 ring-2 ring-accent"></span>
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></span>
              </>
            )}
          </button>

          {/* Welcome Notification Popup */}
          {showNotification && (
            <div className="absolute bottom-20 right-0 animate-in slide-in-from-bottom-2 duration-300 w-[min(22rem,calc(100vw-1.5rem))] sm:w-80">
              <div className="bg-card border border-accent/30 rounded-xl shadow-2xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <MessageCircle className="w-5 h-5 text-accent animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-sm">Welcome {user?.name || 'back'}! 👋</p>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                      SIRA is here to help you explore our services. Click to start chatting!
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleOpenChat}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Chat Now
                  </button>
                  <button
                    onClick={handleDismissNotification}
                    className="px-3 py-1.5 hover:bg-muted rounded-lg text-xs font-semibold transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden bg-card shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-96 sm:rounded-2xl sm:border sm:border-border/40 sm:backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-accent via-accent/90 to-primary/20 text-accent-foreground px-4 pb-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] sm:p-6 flex justify-between items-center relative flex-shrink-0">
            <div className="flex-1">
              <h3 className="font-bold text-base sm:text-lg">SIRA AI Assistant</h3>
              <p className="text-xs text-accent-foreground/70 mt-0.5">Always here to help</p>
            </div>
            <button
              onClick={handleCloseChat}
              className="hover:bg-white/20 p-2.5 rounded-lg transition-colors flex-shrink-0 ml-2"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-background to-background/50">
            {messages.length === 0 ? (
              <>
                {/* Welcome Message */}
                <div className="flex justify-start">
                  <div className="bg-accent/10 text-foreground px-4 py-3 rounded-2xl rounded-tl-none max-w-xs sm:max-w-sm border border-accent/20 text-sm sm:text-base">
                    {user ? (
                      <>
                        <p className="font-medium">Welcome {user?.name || 'there'}! 🌟 I'm SIRA</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                          I'm your personal AI assistant at RK Creative Hub. I'm here to help you discover our amazing services, answer your questions, and guide you through the perfect creative solution for your needs.
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed font-medium">
                          Ready to explore? Ask me anything or try the quick questions below! 🚀
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">👋 Welcome to SIRA - AI Assistant</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                          I'm your AI assistant at RK Creative Hub! I'm here to help you explore our amazing services and answer your questions.
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed font-medium text-accent">
                          🔐 To send messages and unlock full features, please sign in or create an account. It's quick and free!
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Questions - Visible to all users */}
                <div className="flex flex-col gap-2 mt-4 sm:mt-6">
                  <p className="text-xs text-muted-foreground font-semibold px-1">Quick questions:</p>
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuestionClick(q)}
                      disabled={isLoading}
                      className="min-h-11 text-left text-xs sm:text-sm bg-muted/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-foreground px-3 py-2.5 rounded-lg transition-all duration-200 border border-border/30 hover:border-accent/50 hover:shadow-md active:scale-95"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Sign In Prompt - Optional helper for non-logged in users */}
                {!user && (
                <div className="flex justify-center mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-xs text-muted-foreground text-center">
                    💡 <span className="font-medium">Tip:</span> Sign in to place orders and get personalized help!
                  </p>
                </div>
                )}
              </>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-sm px-4 py-3 rounded-2xl text-sm break-words ${
                      msg.sender === 'user'
                        ? 'bg-accent text-accent-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-tl-none border border-border/30'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.suggestedLink && msg.suggestedLinkText && msg.sender === 'bot' && (
                      <button
                        onClick={() => handleLinkClick(msg.suggestedLink!)}
                        className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md active:scale-95"
                      >
                        {msg.suggestedLinkText}
                        <ExternalLink size={12} />
                      </button>
                    )}
                    <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-accent-foreground/70' : 'text-muted-foreground/70'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-tl-none border border-border/30 flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  <span className="text-xs sm:text-sm">Typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-0" />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/40 p-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] bg-card/50 backdrop-blur-sm flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Type your message..."
                disabled={isLoading}
                autoComplete="off"
                className="flex-1 min-h-11 px-4 py-2.5 border border-border/50 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 bg-background text-foreground text-base sm:text-sm placeholder-muted-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="min-h-11 min-w-11 bg-accent hover:bg-accent/90 disabled:bg-muted text-accent-foreground disabled:text-muted-foreground p-2.5 rounded-xl transition-all duration-200 hover:shadow-lg disabled:shadow-none flex-shrink-0"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
