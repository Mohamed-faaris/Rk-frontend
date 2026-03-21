import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(201,169,97,0.12),transparent_35%),linear-gradient(180deg,#050505_0%,#090909_45%,#0f0f0f_100%)]" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-black/20 to-black/45 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-28 z-[2] bg-gradient-to-b from-transparent to-background pointer-events-none" />

      {/* Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 z-20 relative">
        <div className="max-w-5xl mx-auto text-center space-y-3 animate-fade-in-up flex flex-col items-center justify-center">
          {/* RK Badge Featured */}
          <div className="flex justify-center items-center animate-fade-in w-full px-4">
            <div className="relative flex items-center justify-center">
              <img src="/rklogofinal.png" alt="RajKayal Logo" className="h-40 w-40 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-96 lg:w-96 xl:h-[28rem] xl:w-[28rem] drop-shadow-[0_0_14px_rgba(255,215,0,0.45)]" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm mx-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs sm:text-sm font-medium text-accent">
              Premium Creative Hub Since 2024
            </span>
          </div>

          {/* Main Heading */}
          <div className="w-full px-4 flex justify-center items-center">
            <h1 className="brand-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center" style={{ filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.5))' }}>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent">RajKayal</span>
              <span className="brand-display gradient-text mx-2">Creative Hub</span>
            </h1>
          </div>

          {/* Subheading */}
          <div className="w-full px-4">
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center">
              Where creativity meets technology. We craft exceptional digital
              experiences that inspire and transform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 shadow-gold group min-w-[200px]"
              asChild
            >
              <a href="#services" className="flex items-center justify-center">
                Explore Our Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-accent/50 text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent min-w-[200px]"
              asChild
            >
              <a href="#contact" className="flex items-center justify-center">Get in Touch</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

