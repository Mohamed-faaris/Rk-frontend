import ChatMessage from '../models/ChatMessage.js';

const serviceCatalog = [
  {
    id: 'id-card',
    name: 'ID Card Designs',
    link: '/services',
    description: 'School, college, and corporate ID card design services.',
    keywords: ['id card', 'identity card', 'school id', 'college id', 'corporate id', 'employee id'],
    services: [
      { name: 'School ID Card', price: '₹300 - ₹500' },
      { name: 'College ID Card', price: '₹500 - ₹800' },
      { name: 'Corporate ID Card', price: '₹800 - ₹1,500' },
    ],
  },
  {
    id: 'logo-design',
    name: 'Logo Design',
    link: '/services',
    description: 'Basic, professional, and premium brand logo packages.',
    keywords: ['logo', 'logo design', 'brand logo', 'professional logo', 'premium logo'],
    services: [
      { name: 'Basic Logo', price: '₹800 - ₹1,500' },
      { name: 'Professional Logo', price: '₹1,500 - ₹4,000' },
      { name: 'Premium Brand Logo', price: '₹5,000+' },
    ],
  },
  {
    id: 'printing-designs',
    name: 'Printing Designs',
    link: '/services',
    description: 'Print-ready brand stationery and business collateral.',
    keywords: ['visiting card', 'business card', 'letterhead', 'invoice', 'bill book', 'envelope design', 'print design', 'printing design'],
    services: [
      { name: 'Visiting Card', price: '₹300 - ₹700' },
      { name: 'Letterhead', price: '₹300 - ₹600' },
      { name: 'Invoice / Bill Book', price: '₹400 - ₹800' },
      { name: 'Envelope Design', price: '₹150 - ₹400' },
    ],
  },
  {
    id: 'advertisement-designs',
    name: 'Advertisement Designs',
    link: '/services',
    description: 'Posters, flyers, banners, and outdoor ad creatives.',
    keywords: ['poster', 'flyer', 'banner', 'flex', 'advertisement', 'ad design', 'promo poster'],
    services: [
      { name: 'Poster Design', price: '₹500 - ₹1,200' },
      { name: 'Flyer Design', price: '₹500 - ₹1,200' },
      { name: 'Banner / Flex', price: '₹800 - ₹2,000' },
      { name: 'Invitation Design', price: '₹300 - ₹1,500' },
    ],
  },
  {
    id: 'social-media-designs',
    name: 'Social Media Designs',
    link: '/services',
    description: 'Social media post design, ad creatives, and post packs.',
    keywords: ['social media', 'instagram post', 'facebook ad', 'social post', 'social media post', 'social media pack', 'instagram ad'],
    services: [
      { name: 'Social Media Post', price: '₹200 - ₹500' },
      { name: 'Instagram / Facebook Ad', price: '₹300 - ₹700' },
      { name: 'Social Media Pack (10 Posts)', price: '₹1,500 - ₹3,000' },
    ],
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    link: '/services',
    description: 'Editing for YouTube videos, reels, promos, and ad creatives.',
    keywords: ['video editing', 'youtube editing', 'youtube video', 'reel editing', 'shorts editing', 'promo video', 'advertisement video', 'video editor'],
    services: [
      { name: 'Basic Video Editing', price: '₹500 - ₹1,500' },
      { name: 'YouTube Video Editing', price: '₹1,500 - ₹4,000' },
      { name: 'Reel / Shorts Editing', price: '₹300 - ₹800' },
      { name: 'Promo / Advertisement Video', price: '₹2,000 - ₹6,000' },
    ],
  },
  {
    id: 'photoshop-services',
    name: 'Photoshop Services',
    link: '/services',
    description: 'Retouching, background removal, poster edits, and manipulation work.',
    keywords: ['photoshop', 'photo editing', 'retouch', 'background removal', 'photo manipulation', 'image editing'],
    services: [
      { name: 'Photo Editing / Retouch', price: '₹150 - ₹500' },
      { name: 'Background Removal', price: '₹50 - ₹150 per image' },
      { name: 'Photo Manipulation', price: '₹500 - ₹1,500' },
      { name: 'Poster Photoshop Design', price: '₹500 - ₹1,200' },
    ],
  },
  {
    id: 'branding-designs',
    name: 'Branding Designs',
    link: '/branding-identity',
    description: 'Vehicle graphics, shop boards, and bundled branding packages.',
    keywords: ['branding', 'brand identity', 'vehicle design', 'lorry design', 'shop board', 'branding package', 'visual identity'],
    services: [
      { name: 'Vehicle / Lorry Design', price: '₹1,500 - ₹5,000' },
      { name: 'Shop Board Design', price: '₹1,000 - ₹3,000' },
      { name: 'Complete Branding Package', price: '₹3,000 - ₹8,000' },
    ],
  },
  {
    id: 'website-design',
    name: 'Website Design',
    link: '/web-development',
    description: 'Landing pages and business website design packages.',
    keywords: ['website design', 'web design', 'landing page', 'business website design', 'professional website design'],
    services: [
      { name: 'Basic Website Design (1-3 Pages)', price: '₹3,000 - ₹7,000' },
      { name: 'Business Website (4-6 Pages)', price: '₹7,000 - ₹15,000' },
      { name: 'Professional Website', price: '₹15,000 - ₹30,000' },
      { name: 'Landing Page Design', price: '₹2,000 - ₹5,000' },
    ],
  },
  {
    id: 'website-development',
    name: 'Website Development',
    link: '/web-development',
    description: 'Static, dynamic, portfolio, and blog website development.',
    keywords: ['website development', 'web development', 'static website', 'dynamic website', 'portfolio website', 'blog website', 'build website', 'develop website'],
    services: [
      { name: 'Static Website Development', price: '₹5,000 - ₹12,000' },
      { name: 'Dynamic Website Development', price: '₹12,000 - ₹35,000' },
      { name: 'Portfolio Website', price: '₹5,000 - ₹10,000' },
      { name: 'Blog Website', price: '₹6,000 - ₹12,000' },
    ],
  },
  {
    id: 'ecommerce-development',
    name: 'E-Commerce Development',
    link: '/web-development',
    description: 'Online store builds for small, medium, and advanced commerce needs.',
    keywords: ['ecommerce', 'e-commerce', 'online store', 'shopping website', 'store website', 'cart', 'checkout'],
    services: [
      { name: 'Basic Online Store', price: '₹15,000 - ₹30,000' },
      { name: 'Medium E-Commerce Website', price: '₹30,000 - ₹60,000' },
      { name: 'Advanced E-Commerce Platform', price: '₹60,000 - ₹1,50,000+' },
    ],
  },
  {
    id: 'web-maintenance',
    name: 'Web Maintenance',
    link: '/services',
    description: 'Ongoing site updates, support, and bug fixing.',
    keywords: ['maintenance', 'website maintenance', 'site update', 'website update', 'bug fix', 'support', 'monthly maintenance'],
    services: [
      { name: 'Monthly Website Maintenance', price: '₹1,000 - ₹3,000' },
      { name: 'Website Update / Bug Fix', price: '₹500 - ₹2,000' },
    ],
  },
  {
    id: 'software-development',
    name: 'Software Development',
    link: '/services',
    description: 'Desktop apps, custom business tools, and management systems.',
    keywords: ['software development', 'desktop application', 'custom software', 'business software', 'management system', 'school management', 'shop management', 'office management'],
    services: [
      { name: 'Desktop Application', price: '₹5,000 - ₹25,000' },
      { name: 'Custom Business Software', price: '₹15,000 - ₹80,000' },
      { name: 'Management Systems (School / Shop / Office)', price: '₹10,000 - ₹50,000' },
    ],
  },
  {
    id: 'tech-services',
    name: 'Other Tech Services',
    link: '/services',
    description: 'Hosting, domain, deployment, and debugging assistance.',
    keywords: ['hosting', 'domain', 'deployment', 'deploy website', 'debugging', 'code debugging', 'bug fixing', 'website hosting setup'],
    services: [
      { name: 'Website Hosting Setup', price: '₹1,000 - ₹3,000' },
      { name: 'Domain Setup', price: '₹500 - ₹1,500' },
      { name: 'Website Deployment', price: '₹1,000 - ₹3,000' },
      { name: 'Bug Fixing / Code Debugging', price: '₹500 - ₹2,000' },
    ],
  },
];

const specialtyServices = [
  {
    name: 'UI/UX Design',
    link: '/uiux-design',
    description: 'User experience design, wireframes, flows, and interface systems for apps and websites.',
    keywords: ['ui', 'ux', 'uiux', 'ui/ux', 'user experience', 'interface design', 'wireframe', 'prototype', 'app design'],
    pricingNote: 'UI/UX projects are quoted based on screen count, flows, research depth, prototyping, and revisions.',
  },
  {
    name: '3D Animation',
    link: '/3d-animation',
    description: '3D animation, product visuals, motion graphics, and rendered scenes.',
    keywords: ['3d', '3d animation', 'animation', 'motion graphics', 'vfx', 'rendering', 'product visualization'],
    pricingNote: '3D animation is usually quoted after scope review because duration, modeling effort, and render quality affect pricing heavily.',
  },
  {
    name: 'Career',
    link: '/apply-employee',
    description: 'Apply to join the RK Creative Hub team.',
    keywords: ['career', 'job', 'apply', 'hiring', 'vacancy', 'opening', 'join team', 'join your company'],
  },
];

const sendOffMessages = [
  '👋 Goodbye! It was great chatting with you. Feel free to come back anytime!',
  '🌟 Take care! Looking forward to our next conversation. Have a wonderful day!',
  "🚀 Until next time! Don't hesitate to reach out when you need creative solutions.",
  "✨ Farewell! Remember, we're always here to help with your creative projects.",
  '💫 See you soon! Thanks for exploring RK Creative Hub with me.',
  '🎨 Goodbye for now! Keep creating amazing things!',
  '🌈 Take care and stay creative! Come back anytime you need inspiration.',
  '⭐ Farewell! Your next creative journey awaits. Safe travels!',
  '🎭 Until we meet again! Keep the creative spark alive.',
  "🎯 Goodbye! Ready to help whenever you're ready to create something amazing.",
];

const pricingIntentPattern = /price|cost|how much|pricing|quote|budget|rate|charges/;
const timelineIntentPattern = /time|how long|duration|timeline|how fast|deadline|delivery/;
const serviceIntentPattern = /service|services|offer|offering|catalog|price list|pricing list|service list|help me choose/;
const contactIntentPattern = /contact|call|reach|email|phone|get in touch/;
const portfolioIntentPattern = /portfolio|case study|previous work|what have you done|examples|show me your work/;
const jobIntentPattern = /work for you|work with you|join your team|join the team|looking for job|seeking job|want to work|apply for job|job application|employment|join company|need to join|join in work|want to join|interested in joining|join your company|i need to join|like to work|interested in working|seeking for job|looking for employment|job seeker/;

const formatServiceLines = (services, limit = services.length) => services
  .slice(0, limit)
  .map((service) => `• ${service.name}: ${service.price}`)
  .join('\n');

const getCategoryTimeline = (categoryId) => {
  switch (categoryId) {
    case 'id-card':
    case 'logo-design':
    case 'printing-designs':
    case 'advertisement-designs':
    case 'social-media-designs':
    case 'photoshop-services':
      return 'Most single-design requests in this category are usually delivered in about 1-3 working days, depending on quantity and revisions.';
    case 'video-editing':
      return 'Video editing timelines usually range from 1-5 days based on footage length, motion work, subtitles, and revision rounds.';
    case 'website-design':
    case 'website-development':
      return 'Website design and development typically take about 1-4 weeks depending on page count, content readiness, and custom features.';
    case 'ecommerce-development':
    case 'software-development':
      return 'E-commerce and software projects usually take about 2-8+ weeks depending on integrations, admin flows, and testing scope.';
    case 'web-maintenance':
    case 'tech-services':
      return 'Maintenance, deployment, domain, hosting, and bug-fix requests are often handled within the same day to a few working days.';
    default:
      return 'Final delivery depends on complexity, content readiness, feedback speed, and the number of revisions required.';
  }
};

// Natural language intent map — conversational phrases mapped to catalog category IDs
const naturalLanguageIntents = [
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
  { patterns: ['visiting card', 'visiting cards', 'business card', 'business cards', 'name card', 'need visiting card', 'design business card'], categoryId: 'printing-designs' },
  { patterns: ['letterhead design', 'need letterhead', 'company letterhead', 'official letterhead'], categoryId: 'printing-designs' },
  { patterns: ['invoice design', 'bill book design', 'bill design', 'receipt design', 'challan design'], categoryId: 'printing-designs' },
  { patterns: ['envelope design', 'design envelope'], categoryId: 'printing-designs' },
  // Advertisement
  { patterns: ['need a poster', 'make a poster', 'design a poster', 'event poster', 'poster for event', 'create poster', 'promo poster', 'poster needed'], categoryId: 'advertisement-designs' },
  { patterns: ['need a flyer', 'make a flyer', 'design a flyer', 'event flyer', 'product flyer', 'flyer needed'], categoryId: 'advertisement-designs' },
  { patterns: ['banner design', 'make a banner', 'design a banner', 'flex design', 'hoarding design', 'outdoor banner', 'standee design'], categoryId: 'advertisement-designs' },
  // Social Media
  { patterns: ['instagram post', 'instagram design', 'facebook post', 'facebook design', 'social media post', 'social media design', 'social media creative', 'post design', 'social posts', 'content design'], categoryId: 'social-media-designs' },
  { patterns: ['instagram ad', 'facebook ad', 'social media ad', 'paid ad design', 'ad creative', 'social ad'], categoryId: 'social-media-designs' },
  // Video Editing
  { patterns: ['edit my video', 'edit a video', 'need video editing', 'video edit needed', 'video editor needed', 'cut my video', 'trim video'], categoryId: 'video-editing' },
  { patterns: ['edit youtube', 'youtube editing', 'edit youtube video', 'youtube video editor', 'edit my youtube'], categoryId: 'video-editing' },
  { patterns: ['edit my reel', 'reel editing', 'reel edit', 'edit reel', 'instagram reel', 'edit shorts', 'shorts editing'], categoryId: 'video-editing' },
  { patterns: ['promo video', 'promotional video', 'ad video', 'product video', 'commercial video', 'advertisement video'], categoryId: 'video-editing' },
  // Branding
  { patterns: ['shop board', 'signboard', 'sign board', 'shop sign', 'name board', 'store sign'], categoryId: 'branding-designs' },
  { patterns: ['vehicle design', 'lorry design', 'truck design', 'van design', 'car wrap', 'vehicle branding'], categoryId: 'branding-designs' },
  { patterns: ['complete branding', 'full branding', 'brand kit', 'branding package', 'brand package'], categoryId: 'branding-designs' },
  // Website Design
  { patterns: ['design my website', 'need website design', 'web design needed', 'create landing page', 'landing page design', 'need a landing page', 'make landing page'], categoryId: 'website-design' },
  // Website Development
  { patterns: ['make a website', 'build a website', 'create a website', 'need a website', 'i need a website', 'develop a website', 'want a website', 'get a website', 'new website', 'website for my business', 'website for my shop', 'website for school', 'website for college', 'personal website'], categoryId: 'website-development' },
  // E-Commerce
  { patterns: ['online store', 'sell online', 'start online shop', 'ecommerce website', 'e-commerce website', 'shopping website', 'sell my products online', 'online selling', 'product website', 'need online shop'], categoryId: 'ecommerce-development' },
  // Software Development
  { patterns: ['school management', 'college management', 'shop management', 'inventory management', 'management software', 'management system', 'business management system'], categoryId: 'software-development' },
  { patterns: ['desktop app', 'desktop application', 'desktop software', 'windows application', 'custom software', 'business software', 'office software'], categoryId: 'software-development' },
  // Web Maintenance
  { patterns: ['fix my website', 'website not working', 'website broken', 'update my website', 'website support', 'monthly website support'], categoryId: 'web-maintenance' },
  // Tech Services
  { patterns: ['hosting setup', 'set up hosting', 'need hosting', 'web hosting setup', 'website hosting needed'], categoryId: 'tech-services' },
  { patterns: ['domain setup', 'register domain', 'need a domain', 'domain registration', 'buy a domain'], categoryId: 'tech-services' },
  { patterns: ['deploy website', 'website deployment', 'launch my website', 'go live', 'put website online'], categoryId: 'tech-services' },
  { patterns: ['fix bugs', 'bug fixing', 'debug code', 'fix code error', 'code debugging', 'code not working'], categoryId: 'tech-services' },
];

const findBestCatalogMatch = (message) => {
  // First pass: check natural language intent phrases (highest priority)
  for (const intent of naturalLanguageIntents) {
    for (const pattern of intent.patterns) {
      if (message.includes(pattern)) {
        const found = serviceCatalog.find((c) => c.id === intent.categoryId);
        if (found) return found;
      }
    }
  }

  // Second pass: score by category name + keyword + service name matching
  let bestMatch = null;
  let highestScore = 0;

  for (const category of serviceCatalog) {
    let score = 0;

    if (message.includes(category.name.toLowerCase())) {
      score += 10;
    }

    for (const keyword of category.keywords) {
      if (message.includes(keyword)) {
        score += keyword.includes(' ') ? 4 : 2;
      }
    }

    for (const service of category.services) {
      const serviceName = service.name.toLowerCase();
      if (message.includes(serviceName)) {
        score += 6;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = category;
    }
  }

  return highestScore > 0 ? bestMatch : null;
};

const findSpecialtyMatch = (message) => {
  let bestMatch = null;
  let highestScore = 0;

  for (const service of specialtyServices) {
    let score = 0;

    if (message.includes(service.name.toLowerCase())) {
      score += 8;
    }

    for (const keyword of service.keywords) {
      if (message.includes(keyword)) {
        score += keyword.includes(' ') ? 4 : 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = service;
    }
  }

  return highestScore > 0 ? bestMatch : null;
};

const getBotResponseWithLinks = (userMessage, category = 'general') => {
  const lowerMessage = userMessage.toLowerCase().trim();
  const matchedCategory = findBestCatalogMatch(lowerMessage);
  const matchedSpecialty = findSpecialtyMatch(lowerMessage);

  let response = '';
  let link = null;
  let linkText = null;

  if (/^(hello|hi|hey|greetings|start|help|what can you do)\b/.test(lowerMessage)) {
    response = "Hello! 👋 I'm SIRA, your AI Assistant at RK Creative Hub. I can help you compare service categories, understand pricing, and point you to the right page for your project.";
  } else if (/\b(bye|goodbye|see you|farewell|take care|see ya|later|cya|adios|ciao)\b/.test(lowerMessage)) {
    response = sendOffMessages[Math.floor(Math.random() * sendOffMessages.length)];
  } else if (jobIntentPattern.test(lowerMessage)) {
    response = `That's great to hear! We regularly work across design, branding, websites, UI/UX, and animation projects.

To apply, keep your resume, portfolio links, and a short introduction ready. You can start from our careers page.`;
    link = '/apply-employee';
    linkText = 'Start Your Application';
  } else if (contactIntentPattern.test(lowerMessage)) {
    response = `You can reach us through:

📧 Email: rajkayal7281@gmail.com
💬 Chat: Right here in SIRA
📋 Contact Form: Best for project briefs and requirements

If you already know the service you need, I can point you to the right category first.`;
    link = '/contact';
    linkText = 'Contact Us';
  } else if (portfolioIntentPattern.test(lowerMessage)) {
    response = 'You can contact us to review recent project samples and delivery examples across branding, web, and creative work.';
    link = '/contact';
    linkText = 'Request Project Samples';
  } else if (pricingIntentPattern.test(lowerMessage) && matchedCategory) {
    response = `${matchedCategory.name} pricing currently includes:

${formatServiceLines(matchedCategory.services)}

These are practical starting ranges. Final pricing depends on complexity, quantity, revisions, content readiness, and turnaround time.`;
    link = matchedCategory.link;
    linkText = `View ${matchedCategory.name}`;
  } else if (pricingIntentPattern.test(lowerMessage) && matchedSpecialty && matchedSpecialty.pricingNote) {
    response = `${matchedSpecialty.name} is available, but it is usually quoted after understanding the exact scope.

${matchedSpecialty.pricingNote}`;
    link = matchedSpecialty.link;
    linkText = `Explore ${matchedSpecialty.name}`;
  } else if (pricingIntentPattern.test(lowerMessage)) {
    response = `Our public services catalog currently includes pricing across categories like:

• Logo Design: ₹800 - ₹5,000+
• Website Design: ₹2,000 - ₹30,000
• Website Development: ₹5,000 - ₹35,000
• E-Commerce Development: ₹15,000 - ₹1,50,000+
• Video Editing: ₹300 - ₹6,000
• Software Development: ₹5,000 - ₹80,000

If you tell me the exact service, I can narrow it down further.`;
    link = '/services';
    linkText = 'View Service Pricing';
  } else if (timelineIntentPattern.test(lowerMessage) && matchedCategory) {
    response = `${matchedCategory.name} timeline guidance:

${getCategoryTimeline(matchedCategory.id)}`;
    link = matchedCategory.link;
    linkText = `Discuss ${matchedCategory.name}`;
  } else if (timelineIntentPattern.test(lowerMessage)) {
    response = `Timeline depends on the service type.

Simple design requests can be finished in days, websites usually take 1-4 weeks, and larger e-commerce or software builds can take several weeks based on scope and approvals.`;
    link = '/services';
    linkText = 'Discuss Your Project';
  } else if (matchedCategory) {
    response = `I can help with ${matchedCategory.name}.

${matchedCategory.description}

Here are the main options:
${formatServiceLines(matchedCategory.services)}

If you want, tell me which item you need and I can guide you on the likely fit.`;
    link = matchedCategory.link;
    linkText = `Explore ${matchedCategory.name}`;
  } else if (matchedSpecialty) {
    response = `I can help with ${matchedSpecialty.name}.

${matchedSpecialty.description}`;
    link = matchedSpecialty.link;
    linkText = `Explore ${matchedSpecialty.name}`;
  } else if (serviceIntentPattern.test(lowerMessage)) {
    response = `We currently help across these service groups:

• ID cards, logos, print designs, posters, and social media creatives
• Video editing and Photoshop support
• Branding packages and shop board design
• Website design, website development, and e-commerce stores
• Website maintenance, hosting, domains, deployment, and debugging
• Desktop apps, custom business software, and management systems

Tell me the exact service you need, and I'll point you to the right pricing category.`;
    link = '/services';
    linkText = 'View All Service Categories';
  } else {
    response = `I'm SIRA, and I can help you with service pricing, category selection, timelines, project sample requests, and hiring information.

Try asking about a specific service like logo design, website development, poster design, video editing, hosting setup, or software development.`;
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
