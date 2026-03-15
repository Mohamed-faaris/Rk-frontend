import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { serviceCategories } from '@/lib/serviceCatalog';

const servicePageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'RajKayal Creative Hub',
      url: 'https://rkch.tech',
      logo: 'https://rkch.tech/rklogofinal.png',
    },
    {
      '@type': 'CollectionPage',
      name: 'Design and Software Services Pricing',
      url: 'https://rkch.tech/services',
      description: 'Service pricing for branding, websites, UI/UX, social content, video editing, and custom software projects from RajKayal Creative Hub.',
    },
    {
      '@type': 'ItemList',
      itemListElement: serviceCategories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: category.title,
      })),
    },
  ],
};

const AllServicesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      <Seo
        title="Design & Software Services Pricing | RajKayal"
        description="Browse RajKayal Creative Hub pricing for logos, branding, website design, web development, UI/UX, social media creatives, video editing, and custom software services."
        canonicalPath="/services"
        imagePath="/rajkayal-large.png"
        imageWidth="256"
        imageHeight="256"
        keywords="RajKayal services, web development pricing, branding packages, UI UX design cost, logo design pricing, video editing services"
        jsonLd={servicePageJsonLd}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-[#D4AF37] focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>

      <header>
        <Navbar />
      </header>

      <main id="main-content" className="pt-16 md:pt-20">
        <section className="relative overflow-hidden border-b border-[#D4AF37]/20 bg-[radial-gradient(circle_at_top,#33260A_0%,#0A0A0A_45%,#080808_100%)] py-10 md:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-[#D4AF37]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#B68A2F]/20 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <Badge className="brand-display border border-[#D4AF37]/60 bg-[#1A1305] px-4 py-1 text-[#F6D77A]">
            RajKayal Creative Hub
          </Badge>
          <h1 className="mx-auto mt-4 flex max-w-5xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[clamp(1.5rem,4vw,3.75rem)] font-bold leading-tight text-[#F8E6A2]">
            <span className="whitespace-nowrap">Design &amp; Software</span>
            <span className="whitespace-nowrap">Service Price List</span>
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-[#D5D5D5] sm:text-base md:text-lg">
            Affordable and professional pricing for small businesses, schools, colleges, startups, and local town clients who need branding, design, websites, and custom software support from a single creative partner.
          </p>
          <p className="mx-auto mt-4 max-w-4xl text-sm leading-7 text-[#CFCFCF] sm:text-base">
            This page gives you a practical view of our starting price ranges, the categories we cover, and the kinds of deliverables you can request right away. If you need a logo, a shop board, a school ID card, a landing page, an online store, or an internal business tool, you can use this list to estimate scope before booking a consultation. Every project can still be tailored based on complexity, turnaround time, quantity, content requirements, and revisions.
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

        <section aria-labelledby="pricing-filters" className="sticky top-16 z-20 border-y border-[#D4AF37]/20 bg-[#0A0A0A]/95 py-3 backdrop-blur md:top-20 md:py-4">
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

        <section className="border-b border-[#D4AF37]/15 bg-[#090909] py-8 md:py-12">
          <div className="container mx-auto grid gap-6 px-4 md:grid-cols-[1.5fr_1fr]">
            <article className="rounded-2xl border border-[#D4AF37]/15 bg-[#111111] p-6 shadow-[0_0_0_1px_rgba(212,175,55,0.03)]">
              <h2 className="text-2xl font-semibold text-[#F6D77A]">How to use this service catalog</h2>
              <p className="mt-4 text-sm leading-7 text-[#D8D8D8] sm:text-base">
                The amounts shown here are realistic starting ranges for common design and software requests. Simple tasks such as basic logo work, social media creatives, background removal, or single poster layouts stay near the lower end. Projects with deeper strategy, more pages, custom illustrations, animation work, integrations, or multiple revision rounds usually move toward the upper end.
              </p>
              <p className="mt-4 text-sm leading-7 text-[#D8D8D8] sm:text-base">
                We also work with bundled requirements. Schools and colleges often combine ID cards, notices, letterheads, and web updates. Local businesses usually request branding, storefront graphics, social media post packs, and a business website together. Startups often need UI design, a launch landing page, product explainers, and ongoing maintenance in one coordinated plan.
              </p>
              <p className="mt-4 text-sm leading-7 text-[#D8D8D8] sm:text-base">
                If your requirement does not fit neatly into one card, use the consultation or enquiry links below. We can prepare a custom package based on your timeline, asset readiness, content support needs, domain or hosting setup, and how much ongoing technical support you want after launch.
              </p>
            </article>

            <aside className="rounded-2xl border border-[#D4AF37]/15 bg-[#111111] p-6">
              <h2 className="text-xl font-semibold text-[#F6D77A]">Explore related pages</h2>
              <nav aria-label="Related service pages" className="mt-4 space-y-3">
                <Link className="block rounded-lg border border-[#D4AF37]/20 px-4 py-3 text-sm text-[#F5F5F5] transition-colors hover:bg-[#D4AF37]/10" to="/services-overview">
                  View the full services overview
                </Link>
                <Link className="block rounded-lg border border-[#D4AF37]/20 px-4 py-3 text-sm text-[#F5F5F5] transition-colors hover:bg-[#D4AF37]/10" to="/branding-identity">
                  Browse branding and identity projects
                </Link>
                <Link className="block rounded-lg border border-[#D4AF37]/20 px-4 py-3 text-sm text-[#F5F5F5] transition-colors hover:bg-[#D4AF37]/10" to="/web-development">
                  Explore web development capabilities
                </Link>
                <Link className="block rounded-lg border border-[#D4AF37]/20 px-4 py-3 text-sm text-[#F5F5F5] transition-colors hover:bg-[#D4AF37]/10" to="/uiux-design">
                  Review UI/UX design services
                </Link>
                <Link className="block rounded-lg border border-[#D4AF37]/20 px-4 py-3 text-sm text-[#F5F5F5] transition-colors hover:bg-[#D4AF37]/10" to="/contact">
                  Contact the RajKayal team
                </Link>
              </nav>
            </aside>
          </div>
        </section>

        <section id="services-content" aria-labelledby="pricing-list-heading" className="py-6 md:py-14">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="mb-6 md:mb-8">
            <h2 id="pricing-list-heading" className="text-2xl font-semibold text-[#F6D77A] sm:text-3xl">Service pricing by category</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#D2D2D2] sm:text-base">
              Compare our pricing across design, branding, web, e-commerce, maintenance, and software development services. Use the category filter to narrow the list or send an enquiry directly from any category card.
            </p>
          </div>
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
                        className="grid grid-cols-1 items-center gap-2 rounded-md border border-transparent px-2 py-2.5 transition-colors hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/5 active:bg-[#D4AF37]/10 sm:grid-cols-[1fr_auto]"
                      >
                        <p className="min-w-0 break-normal text-xs leading-relaxed text-[#EFEFEF] sm:text-sm md:text-[15px]">{service.name}</p>
                        <div className="mt-1 flex items-center justify-start whitespace-normal text-xs font-semibold text-[#F6D77A] sm:mt-0 sm:justify-end sm:whitespace-nowrap sm:text-sm md:text-[15px]">
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
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-[#D0D0D0] sm:text-base">
            We create tailored plans for schools, colleges, small businesses, startups, and local brands across India. If you need recurring design support, a launch bundle, or a combined website and branding package, we can structure scope and pricing around your exact goals.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-[#D4AF37] font-semibold text-black hover:bg-[#C59B2F]">
              <Link to="/contact">Get Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#D4AF37]/50 bg-transparent text-[#F6D77A] hover:bg-[#D4AF37]/10">
              <Link to="/contact">Request Project Samples</Link>
            </Button>
          </div>
        </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AllServicesPage;





