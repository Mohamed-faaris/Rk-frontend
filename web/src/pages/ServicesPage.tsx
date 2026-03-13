import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientBlinds from "@/components/GradientBlinds.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { serviceCategories } from '@/lib/serviceCatalog';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoryTabs = useMemo(
    () => [{ id: 'all', name: 'All Services' }, ...serviceCategories.map((category) => ({ id: category.id, name: category.title }))],
    [],
  );

  const filteredCategories = selectedCategory === 'all'
    ? serviceCategories
    : serviceCategories.filter((category) => category.id === selectedCategory);

  const handleOrderService = (serviceTitle: string) => {
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('showAuthPopup'));
      return;
    }
    navigate(`/services/order/${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* GradientBlinds Background */}
        <div className="absolute inset-0 z-0">
          <GradientBlinds
            gradientColors={['#D4AF37', '#F4C542', '#FFD700']}
            angle={45}
            noise={0.15}
            blindCount={10}
            blindMinWidth={100}
            spotlightRadius={0.55}
            spotlightSoftness={1.0}
            spotlightOpacity={0.6}
            mouseDampening={0.25}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
            dpr={0.75}
            slideDirection="left"
            slideDuration={1.2}
            slideDelay={0}
          />
        </div>
        
        {/* Overlay for content readability */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold gradient-text" style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(244, 197, 66, 0.4), 0 4px 20px rgba(0, 0, 0, 0.8)'
            }}>
              Services Price Catalog
            </h1>
            <p className="text-base md:text-lg lg:text-2xl text-white max-w-2xl mx-auto" style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(212, 175, 55, 0.3)'
            }}>
              Browse service pricing by category for branding, print, websites, e-commerce, maintenance, and custom software work.
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
              {categoryTabs.slice(1, 7).map((tab) => (
                <Badge key={tab.id} variant="outline" className="shrink-0 border-[#D4AF37]/50 bg-black/30 text-[#F6D77A]">
                  {tab.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-y border-[#D4AF37]/20 bg-[#0A0A0A]/95 py-3 backdrop-blur md:py-4">
        <div className="sr-only">
          <h2 id="pricing-filters">Filter service categories</h2>
        </div>
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

      <section id="services-content" aria-labelledby="pricing-list-heading" className="py-12 md:py-16 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4" style={{ position: 'relative', zIndex: 10 }}>
          <div className="mb-8 max-w-3xl">
            <h2 id="pricing-list-heading" className="text-2xl font-semibold text-[#F6D77A] sm:text-3xl">Service pricing by category</h2>
            <p className="mt-3 text-sm leading-7 text-[#E5E5E5] sm:text-base">
              Remove the guesswork and compare pricing across design, branding, websites, maintenance, and software development categories from one catalog.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 lg:gap-8 max-w-7xl mx-auto">
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
                        <p className="min-w-0 break-normal text-xs leading-relaxed text-[#EFEFEF] sm:text-sm md:text-[15px]">{service.name}</p>
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

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-secondary/30 dark:bg-background shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text" style={{
              textShadow: '0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(244, 197, 66, 0.3), 0 2px 15px rgba(0, 0, 0, 0.8)'
            }}>
              Ready to Start Your Project?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white" style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 15px rgba(212, 175, 55, 0.3)'
            }}>
              Let's discuss your vision and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const element = document.querySelector('#contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                    // Update URL with query param
                    window.history.replaceState(null, '', '/?type=consultation#contact');
                  }, 100);
                }}
                className="bg-accent hover:bg-accent/90 font-semibold px-8 py-3 shadow-gold"
              >
                Get Free Consultation
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/#portfolio')}
                className="border-border bg-transparent text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent px-8 py-3"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicesPage;
