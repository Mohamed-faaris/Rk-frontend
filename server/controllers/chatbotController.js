import ChatMessage from '../models/ChatMessage.js';

// Service details with links
const serviceLinks = {
  webDevelopment: {
    name: 'Web Development',
    link: '/web-development',
    keywords: ['web', 'website', 'web development', 'web app', 'web application', 'frontend', 'backend', 'full stack', 'develop', 'create website', 'build website', 'responsive'],
    description: 'Custom web applications, responsive websites, and web solutions'
  },
  branding: {
    name: 'Branding & Identity',
    link: '/branding-identity',
    keywords: ['brand', 'branding', 'identity', 'logo', 'design', 'visual identity', 'brand identity', 'corporate identity', 'brand design', 'logo design'],
    description: 'Complete branding solutions including logos, brand guidelines, and visual identity'
  },
  uiux: {
    name: 'UI/UX Design',
    link: '/uiux-design',
    keywords: ['ui', 'ux', 'design', 'interface', 'user experience', 'ui design', 'ux design', 'wireframe', 'mockup', 'app design', 'interface design'],
    description: 'Beautiful and intuitive user interfaces and experiences'
  },
  animation3d: {
    name: '3D Animation',
    link: '/3d-animation',
    keywords: ['3d', 'animation', '3d animation', 'motion', 'visual effects', 'vfx', 'rendering', 'animated', 'motion graphics', '3d model'],
    description: 'Professional 3D animations and visual effects'
  },
  orders: {
    name: 'All Services',
    link: '/services',
    keywords: ['order', 'my order', 'orders', 'project', 'my project', 'track', 'status', 'services', 'all services', 'offerings'],
    description: 'View all services and place orders'
  },
  portfolio: {
    name: 'Portfolio',
    link: '/case-studies',
    keywords: ['portfolio', 'case study', 'examples', 'showcase', 'previous work', 'our work', 'past projects', 'featured work'],
    description: 'Explore our portfolio and case studies'
  },
  career: {
    name: 'Career',
    link: '/apply-employee',
    keywords: ['join team', 'team member', 'employment opportunity', 'vacancy', 'opening', 'position available', 'hiring', 'recruitment'],
    description: 'Join our creative team'
  },
  blog: {
    name: 'Blog',
    link: '/blog',
    keywords: ['blog', 'article', 'news', 'tips', 'insights', 'tutorial', 'guide', 'read'],
    description: 'Read our blog for industry insights'
  }
};

// AI responses with links based on categories
const getBotResponseWithLinks = (userMessage, category = 'general') => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Priority-based keyword matching for accurate service detection
  let detectedService = null;
  let maxMatches = 0;
  
  for (const [key, service] of Object.entries(serviceLinks)) {
    const matches = service.keywords.filter(keyword => lowerMessage.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedService = service;
    }
  }

  // Dynamic responses based on detected service or category
  let response = '';
  let link = null;
  let linkText = null;

  // Greeting detection
  if (lowerMessage.match(/^(hello|hi|hey|greetings|start|help)\b/)) {
    response = "Hello! 👋 I'm SIRA, your AI Assistant at RK Creative Hub. I'm here to help you find the perfect service for your needs. What would you like help with?";
  } 
  // Bye detection with different send-off messages
  else if (/\b(bye|goodbye|see you|farewell|take care|see ya|later|cya|adios|ciao)\b/.test(lowerMessage)) {
    const sendOffMessages = [
      "👋 Goodbye! It was great chatting with you. Feel free to come back anytime!",
      "🌟 Take care! Looking forward to our next conversation. Have a wonderful day!",
      "🚀 Until next time! Don't hesitate to reach out when you need creative solutions.",
      "✨ Farewell! Remember, we're always here to help with your creative projects.",
      "💫 See you soon! Thanks for exploring RK Creative Hub with me.",
      "🎨 Goodbye for now! Keep creating amazing things!",
      "🌈 Take care and stay creative! Come back anytime you need inspiration.",
      "⭐ Farewell! Your next creative journey awaits. Safe travels!",
      "🎭 Until we meet again! Keep the creative spark alive.",
      "🎯 Goodbye! Ready to help whenever you're ready to create something amazing."
    ];
    
    response = sendOffMessages[Math.floor(Math.random() * sendOffMessages.length)];
  } 
  // Sharp service detection - if user mentions specific service
  else if (detectedService && maxMatches > 0) {
    response = `Perfect! You're looking for ${detectedService.name}. ${detectedService.description}. 

Let me show you what we offer in this service.`;
    link = detectedService.link;
    linkText = `Explore ${detectedService.name}`;
  }
  // Order/Services - Show all services
  else if (lowerMessage.includes('order') || lowerMessage.includes('service') && !lowerMessage.includes('service area')) {
    response = `Great! We offer comprehensive creative services:

🌐 Web Development - Custom web apps & responsive websites
🎨 Branding & Identity - Complete brand design & identity
✨ UI/UX Design - Beautiful, intuitive interfaces
🎬 3D Animation - Professional animations & effects

Which service interests you most?`;
    link = '/services';
    linkText = 'View All Services';
  }
  // Pricing inquiry
  else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('pricing') || lowerMessage.includes('quote')) {
    response = `Our pricing is tailored to your project needs:

💰 Web Development: From ₹2,07,500
💰 Branding & Identity: From ₹1,24,500
💰 UI/UX Design: Custom quotes
💰 3D Animation: Custom quotes

Ready to get a personalized quote for your project?`;
    link = '/services';
    linkText = 'Get a Custom Quote';
  }
  // Timeline inquiry
  else if (lowerMessage.includes('time') || lowerMessage.includes('how long') || lowerMessage.includes('duration') || lowerMessage.includes('timeline') || lowerMessage.includes('how fast')) {
    response = `Project timelines vary based on complexity:

⏱️ Small Projects: 1-2 weeks
⏱️ Medium Projects: 2-4 weeks  
⏱️ Large Projects: 4-8+ weeks

We'll discuss your specific timeline requirements to meet your deadlines!`;
    link = '/services';
    linkText = 'Discuss Your Project';
  }
  // Portfolio/Work inquiry
  else if (lowerMessage.includes('portfolio') || lowerMessage.includes('case study') || lowerMessage.includes('previous work') || lowerMessage.includes('what have you done') || lowerMessage.includes('examples')) {
    response = `Check out our portfolio to see the amazing projects we've completed! Each case study showcases our expertise across different industries.`;
    link = '/case-studies';
    linkText = 'View Our Portfolio';
  }
  // Contact inquiry
  else if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('reach') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
    response = `You can reach us through:

📧 Email: rajkayal7281@gmail.com
📞 Phone: Available during business hours
💬 Chat: You're already chatting!
📋 Contact Form: For detailed inquiries

How can we help you today?`;
    link = '/services';
    linkText = 'Contact Us';
  }
  // Specific job seeking phrases
  else if (lowerMessage.includes('like to work') || lowerMessage.includes('want to join') || lowerMessage.includes('interested in working') ||
           lowerMessage.includes('seeking for job') || lowerMessage.includes('looking for employment') || lowerMessage.includes('job seeker') ||
           lowerMessage.includes('need to join') || lowerMessage.includes('join in work') || lowerMessage.includes('join your company') ||
           lowerMessage.includes('i need to join')) {
    response = `That's fantastic! 🌟 We're thrilled that you're interested in joining RK Creative Hub. 

We believe great work happens when passionate people come together. Our team works on exciting projects across web development, design, branding, and animation.

To apply, you'll need to prepare:
• Your resume/portfolio
• Links to your previous work
• A brief cover letter

Ready to start your journey with us?`;
    link = '/apply-employee';
    linkText = 'Start Your Application';
  }
  // Blog/Articles inquiry
  else if (lowerMessage.includes('blog') || lowerMessage.includes('article') || lowerMessage.includes('news') || lowerMessage.includes('tips') || lowerMessage.includes('tutorial') || lowerMessage.includes('guide')) {
    response = `Our blog features articles, tips, and industry insights about design, development, and creative trends.`;
    link = '/blog';
    linkText = 'Read Our Blog';
  }
  // Default - ask for clarification
  else {
    response = `I'm SIRA, and I'm here to help! I can assist you with:

🎯 Finding the right service for your creative project
💰 Pricing and quotes for our services
⏱️ Project timelines and planning
👥 Information about joining our creative team
📚 Learning about our work and expertise

Are you looking for our services, or interested in joining our team?`;
    link = '/services';
    linkText = 'Explore Our Services';
  }

  return { response, link, linkText };
};

// Save user message and get bot response
const sendMessage = async (req, res) => {
  try {
    const { userId, userName, userEmail, message, sessionId, category } = req.body;

    if (!userId || !userName || !userEmail || !message || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save user message
    const userMsg = new ChatMessage({
      userId,
      userName,
      userEmail,
      message,
      sender: 'user',
      sessionId,
      category: category || 'general'
    });

    await userMsg.save();

    // Generate bot response with enhanced logic and links
    const { response: botResponseText, link, linkText } = getBotResponseWithLinks(message, category);

    // Save bot message
    const botMsg = new ChatMessage({
      userId,
      userName,
      userEmail,
      message: botResponseText,
      sender: 'bot',
      sessionId,
      category: category || 'general'
    });

    await botMsg.save();

    res.json({
      userMessage: userMsg,
      botMessage: botMsg,
      botResponse: botResponseText,
      suggestedLink: link,
      suggestedLinkText: linkText
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

// Get chat history for user
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(history);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Get session messages
const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await ChatMessage.find({ sessionId })
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Error fetching session messages:', err);
    res.status(500).json({ error: 'Failed to fetch session messages' });
  }
};

// Admin: Get all chat messages
const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, resolved, isRead } = req.query;

    let filter = {};
    if (resolved !== undefined) filter.resolved = resolved === 'true';
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const messages = await ChatMessage.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email');

    const total = await ChatMessage.countDocuments(filter);

    res.json({
      messages,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Admin: Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ChatMessage.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    res.json(message);
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

// Admin: Mark conversation as resolved
const markAsResolved = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { resolved, adminNotes } = req.body;

    await ChatMessage.updateMany(
      { sessionId },
      { resolved, adminNotes }
    );

    const messages = await ChatMessage.find({ sessionId });

    res.json(messages);
  } catch (err) {
    console.error('Error resolving conversation:', err);
    res.status(500).json({ error: 'Failed to resolve conversation' });
  }
};

// Get chat statistics
const getChatStats = async (req, res) => {
  try {
    const totalMessages = await ChatMessage.countDocuments();
    const totalUsers = await ChatMessage.countDocuments({ sender: 'user' });
    const unresolvedCount = await ChatMessage.countDocuments({ resolved: false });
    const unreadCount = await ChatMessage.countDocuments({ isRead: false, sender: 'user' });

    const messagesByCategory = await ChatMessage.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalMessages,
      totalUsers,
      unresolvedCount,
      unreadCount,
      messagesByCategory
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// Star/unstar message
const toggleStar = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { isStarred } = req.body;

    const message = await ChatMessage.findByIdAndUpdate(
      messageId,
      { isStarred },
      { new: true }
    );

    res.json(message);
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

export default {
  sendMessage,
  getChatHistory,
  getSessionMessages,
  getAllMessages,
  markAsRead,
  markAsResolved,
  getChatStats,
  toggleStar
};
