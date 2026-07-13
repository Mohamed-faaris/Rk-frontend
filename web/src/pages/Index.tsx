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
        <UpdatesNewsSection />
        <Services />
        <Portfolio />
        <Testimonials />
        <ReviewsSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
