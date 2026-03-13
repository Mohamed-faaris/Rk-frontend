export type ServiceItem = {
  name: string;
  price: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  services: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'id-card',
    title: 'ID Card Designs',
    services: [
      { name: 'School ID Card', price: '₹300 - ₹500' },
      { name: 'College ID Card', price: '₹500 - ₹800' },
      { name: 'Corporate ID Card', price: '₹800 - ₹1,500' },
    ],
  },
  {
    id: 'logo-design',
    title: 'Logo Design',
    services: [
      { name: 'Basic Logo', price: '₹800 - ₹1,500' },
      { name: 'Professional Logo', price: '₹1,500 - ₹4,000' },
      { name: 'Premium Brand Logo', price: '₹5,000+' },
    ],
  },
  {
    id: 'printing-designs',
    title: 'Printing Designs',
    services: [
      { name: 'Visiting Card', price: '₹300 - ₹700' },
      { name: 'Letterhead', price: '₹300 - ₹600' },
      { name: 'Invoice / Bill Book', price: '₹400 - ₹800' },
      { name: 'Envelope Design', price: '₹150 - ₹400' },
    ],
  },
  {
    id: 'advertisement-designs',
    title: 'Advertisement Designs',
    services: [
      { name: 'Poster Design', price: '₹500 - ₹1,200' },
      { name: 'Flyer Design', price: '₹500 - ₹1,200' },
      { name: 'Banner / Flex', price: '₹800 - ₹2,000' },
      { name: 'Invitation Design', price: '₹300 - ₹1,500' },
    ],
  },
  {
    id: 'social-media-designs',
    title: 'Social Media Designs',
    services: [
      { name: 'Social Media Post', price: '₹200 - ₹500' },
      { name: 'Instagram / Facebook Ad', price: '₹300 - ₹700' },
      { name: 'Social Media Pack (10 Posts)', price: '₹1,500 - ₹3,000' },
    ],
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    services: [
      { name: 'Basic Video Editing', price: '₹500 - ₹1,500' },
      { name: 'YouTube Video Editing', price: '₹1,500 - ₹4,000' },
      { name: 'Reel / Shorts Editing', price: '₹300 - ₹800' },
      { name: 'Promo / Advertisement Video', price: '₹2,000 - ₹6,000' },
    ],
  },
  {
    id: 'photoshop-services',
    title: 'Photoshop Services',
    services: [
      { name: 'Photo Editing / Retouch', price: '₹150 - ₹500' },
      { name: 'Background Removal', price: '₹50 - ₹150 per image' },
      { name: 'Photo Manipulation', price: '₹500 - ₹1,500' },
      { name: 'Poster Photoshop Design', price: '₹500 - ₹1,200' },
    ],
  },
  {
    id: 'branding-designs',
    title: 'Branding Designs',
    services: [
      { name: 'Vehicle / Lorry Design', price: '₹1,500 - ₹5,000' },
      { name: 'Shop Board Design', price: '₹1,000 - ₹3,000' },
      { name: 'Complete Branding Package', price: '₹3,000 - ₹8,000' },
    ],
  },
  {
    id: 'website-design',
    title: 'Website Design',
    services: [
      { name: 'Basic Website Design (1-3 Pages)', price: '₹3,000 - ₹7,000' },
      { name: 'Business Website (4-6 Pages)', price: '₹7,000 - ₹15,000' },
      { name: 'Professional Website', price: '₹15,000 - ₹30,000' },
      { name: 'Landing Page Design', price: '₹2,000 - ₹5,000' },
    ],
  },
  {
    id: 'website-development',
    title: 'Website Development',
    services: [
      { name: 'Static Website Development', price: '₹5,000 - ₹12,000' },
      { name: 'Dynamic Website Development', price: '₹12,000 - ₹35,000' },
      { name: 'Portfolio Website', price: '₹5,000 - ₹10,000' },
      { name: 'Blog Website', price: '₹6,000 - ₹12,000' },
    ],
  },
  {
    id: 'ecommerce-development',
    title: 'E-Commerce Development',
    services: [
      { name: 'Basic Online Store', price: '₹15,000 - ₹30,000' },
      { name: 'Medium E-Commerce Website', price: '₹30,000 - ₹60,000' },
      { name: 'Advanced E-Commerce Platform', price: '₹60,000 - ₹1,50,000+' },
    ],
  },
  {
    id: 'web-maintenance',
    title: 'Web Maintenance',
    services: [
      { name: 'Monthly Website Maintenance', price: '₹1,000 - ₹3,000' },
      { name: 'Website Update / Bug Fix', price: '₹500 - ₹2,000' },
    ],
  },
  {
    id: 'software-development',
    title: 'Software Development',
    services: [
      { name: 'Desktop Application', price: '₹5,000 - ₹25,000' },
      { name: 'Custom Business Software', price: '₹15,000 - ₹80,000' },
      { name: 'Management Systems (School / Shop / Office)', price: '₹10,000 - ₹50,000' },
    ],
  },
  {
    id: 'tech-services',
    title: 'Other Tech Services',
    services: [
      { name: 'Website Hosting Setup', price: '₹1,000 - ₹3,000' },
      { name: 'Domain Setup', price: '₹500 - ₹1,500' },
      { name: 'Website Deployment', price: '₹1,000 - ₹3,000' },
      { name: 'Bug Fixing / Code Debugging', price: '₹500 - ₹2,000' },
    ],
  },
];