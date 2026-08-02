import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechLogoStrip from "@/components/TechLogoStrip";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { lazy, Suspense } from "react";

const UpdatesNewsSection = lazy(() => import("@/components/UpdatesNewsSection"));
const Services = lazy(() => import("@/components/Services"));
const Portfolio = lazy(() => import("@/components/Portfolio"));
const OurTeam = lazy(() => import("@/components/OurTeam"));
const Contact = lazy(() => import("@/components/Contact"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "RajKayal Creative Hub",
      url: "https://rkch.tech",
      logo: "https://rkch.tech/rklogofinal.webp",
      description:
        "RajKayal Creative Hub delivers branding, web design, UI/UX, 3D animation, and custom software services for businesses across India.",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      name: "RajKayal Creative Hub",
      url: "https://rkch.tech",
    },
  ],
};

const SectionFallback = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="animate-pulse w-8 h-8 rounded-full border-2 border-accent border-t-transparent" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="RajKayal Creative Hub | Design & Development Company"
        description="RajKayal Creative Hub delivers branding, web design, UI/UX, 3D animation, and custom software services for businesses that need polished digital experiences."
        canonicalPath="/"
        imagePath="/rklogofinal.webp"
        imageWidth="256"
        imageHeight="256"
        keywords="RajKayal Creative Hub, branding agency, web design, UI UX design, logo design, 3D animation, custom software, Tamil Nadu"
        jsonLd={homeJsonLd}
      />

      {/* Skip navigation — visible only on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-black focus:font-semibold"
      >
        Skip to main content
      </a>

      <header>
        <Navbar />
      </header>

      <main id="main-content" className="relative z-10">
        {/* Hidden SEO description for crawlers — not visible to users */}
        <p className="sr-only">
          RajKayal Creative Hub is a premium design and development company based in Tamil Nadu, India. We offer
          branding and identity design, website design and development, UI/UX design, social media creatives,
          3D animation, video editing, and custom software solutions. Our team works with businesses, startups,
          schools, colleges, and local brands to deliver polished digital experiences. Explore our services,
          view our portfolio, meet the team, and get in touch for a free consultation.
        </p>

        <Hero />
        <TechLogoStrip />
        <About />
        <div className="relative isolate">
          <div className="homepage-sections-wrapper">
            <Suspense fallback={<SectionFallback />}>
              <UpdatesNewsSection />
              <Services />
              <Portfolio />
              <OurTeam />
              <ReviewsSection />
              <Contact />
            </Suspense>
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Index;
