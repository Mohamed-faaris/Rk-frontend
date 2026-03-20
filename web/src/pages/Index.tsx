import Navbar from "@/components/Navbar";
import { lazy, Suspense } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useAdaptiveEffects } from "@/hooks/useAdaptiveEffects";

const GradientBlinds = lazy(() => import("@/components/GradientBlinds"));

const Index = () => {
  const { canUseHeavyEffects, effectsReady } = useAdaptiveEffects();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {canUseHeavyEffects && effectsReady && (
        <Suspense fallback={null}>
          <GradientBlinds />
        </Suspense>
      )}
      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
