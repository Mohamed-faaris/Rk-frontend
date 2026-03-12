import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';

type ServiceItem = {
  name: string;
  price: string;
};

type ServiceCategory = {
  id: string;
  title: string;
  services: ServiceItem[];
};

const AllServicesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const serviceCategories: ServiceCategory[] = [
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

  const categoryTabs = useMemo(
    () => [{ id: 'all', name: 'All Services' }, ...serviceCategories.map((category) => ({ id: category.id, name: category.title }))],
    [serviceCategories],
  );

  const filteredCategories = selectedCategory === 'all'
    ? serviceCategories
    : serviceCategories.filter((category) => category.id === selectedCategory);

  const handleOrderService = (serviceTitle?: string) => {
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('showAuthPopup'));
      return;
    }
    navigate(`/services/order/${encodeURIComponent(serviceTitle || 'General Service')}`);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-[#D4AF37]/20 bg-[radial-gradient(circle_at_top,#33260A_0%,#0A0A0A_45%,#080808_100%)] py-10 md:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-[#D4AF37]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#B68A2F]/20 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <Badge className="border border-[#D4AF37]/60 bg-[#1A1305] px-4 py-1 text-[#F6D77A]">
            RajKayal Creative Hub
          </Badge>
          <h1 className="mx-auto mt-4 max-w-5xl text-2xl font-bold leading-tight text-[#F8E6A2] sm:text-3xl md:text-5xl lg:text-6xl">
            Design &amp; Software Service Price List – 2026
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-xs text-[#D5D5D5] sm:text-sm md:text-base">
            Affordable and professional pricing for small businesses, schools, colleges, startups, and local town clients.
          </p>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
            {categoryTabs.slice(1, 7).map((tab) => (
              <Badge key={tab.id} variant="outline" className="shrink-0 border-[#D4AF37]/40 bg-black/30 text-[#F6D77A]">
                {tab.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-y border-[#D4AF37]/20 bg-[#0A0A0A]/95 py-3 backdrop-blur md:py-4">
        <div className="mx-auto w-full max-w-screen-xl overflow-hidden px-3 sm:px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
            {categoryTabs.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`h-9 shrink-0 rounded-full border px-3 text-xs sm:px-4 sm:text-sm ${
                  selectedCategory === category.id
                    ? 'border-[#D4AF37] bg-[#D4AF37] text-black hover:bg-[#c9a328]'
                    : 'border-[#D4AF37]/40 bg-transparent text-[#EED27A] hover:bg-[#D4AF37]/10'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 md:py-14">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                className="border-[#D4AF37]/25 bg-gradient-to-b from-[#121212] to-[#0B0B0B] text-white shadow-[0_0_0_1px_rgba(212,175,55,0.05)]"
              >
                <CardHeader className="border-b border-[#D4AF37]/20 px-4 py-3 md:px-6 md:py-4">
                  <CardTitle className="text-base font-semibold text-[#F6D77A] sm:text-xl">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pt-4 sm:px-6 sm:pt-5">
                  <div className="space-y-2">
                    {category.services.map((service) => (
                      <div
                        key={`${category.id}-${service.name}`}
                        className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-md border border-transparent px-2 py-2.5 transition-colors hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/5 active:bg-[#D4AF37]/10"
                      >
                        <p className="min-w-0 break-words text-xs leading-relaxed text-[#EFEFEF] sm:text-sm md:text-[15px]">{service.name}</p>
                        <div className="flex shrink-0 items-center justify-end whitespace-nowrap text-xs font-semibold text-[#F6D77A] sm:text-sm md:text-[15px]">
                          <IndianRupee className="mr-0.5 h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{service.price.replace('₹', '')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Button
                      onClick={() => handleOrderService(category.title)}
                      size="sm"
                      className="h-9 bg-[#D4AF37] px-4 text-xs font-semibold text-black hover:bg-[#C59B2F] sm:h-10 sm:px-5 sm:text-sm"
                    >
                      <span className="hidden sm:inline">Enquire {category.title}</span>
                      <span className="sm:hidden">Enquire Now</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D4AF37]/20 bg-[#0A0A0A] py-10 md:py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-[#F6D77A] sm:text-2xl md:text-3xl">Custom Packages Available</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs text-[#D0D0D0] sm:text-sm md:text-base">
            We create tailored plans for schools, colleges, small businesses, startups, and local brands across India.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const element = document.querySelector('#contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                  window.history.replaceState(null, '', '/?type=consultation#contact');
                }, 100);
              }}
              className="bg-[#D4AF37] font-semibold text-black hover:bg-[#C59B2F]"
            >
              Get Free Consultation
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/#portfolio')}
              className="border-[#D4AF37]/50 bg-transparent text-[#F6D77A] hover:bg-[#D4AF37]/10"
            >
              View Our Work
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AllServicesPage;





