import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechLogoStrip from "@/components/TechLogoStrip";
import About from "@/components/About";
import UpdatesNewsSection from "@/components/UpdatesNewsSection";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import OurTeam from "@/components/OurTeam";
import Contact from "@/components/Contact";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <TechLogoStrip />
        <About />
        <div className="relative isolate">
          <div className="homepage-sections-wrapper">
            <UpdatesNewsSection />
            <Services />
            <Portfolio />
            <OurTeam />
            <ReviewsSection />
            <Contact />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
