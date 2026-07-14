import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechLogoStrip from "@/components/TechLogoStrip";
import About from "@/components/About";
import UpdatesNewsSection from "@/components/UpdatesNewsSection";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
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
          <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#d4af37_100%)]"></div>
          <div className="homepage-sections-wrapper">
            <UpdatesNewsSection />
            <Services />
            <Portfolio />
            <Testimonials />
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
