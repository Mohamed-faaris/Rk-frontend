import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechLogoStrip from "@/components/TechLogoStrip";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { lazy, Suspense } from "react";

const UpdatesNewsSection = lazy(() => import("@/components/UpdatesNewsSection"));
const Services = lazy(() => import("@/components/Services"));
const Portfolio = lazy(() => import("@/components/Portfolio"));
const OurTeam = lazy(() => import("@/components/OurTeam"));
const Contact = lazy(() => import("@/components/Contact"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));

const SectionFallback = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="animate-pulse w-8 h-8 rounded-full border-2 border-accent border-t-transparent" />
  </div>
);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative z-10">
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
      <Footer />
    </div>
  );
};

export default Index;
