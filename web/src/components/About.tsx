import {
  Target,
  Eye,
  Rocket,
  Palette,
  Globe,
  ShoppingCart,
  Video,
  Code2,
  Megaphone,
  Wrench,
  CreditCard,
  Camera,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { logger } from "@/lib/logger";

const About = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      video.currentTime = 0;
      video.play().catch(err => logger.debug('Autoplay prevented:', err));
    };

    const playVideo = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => logger.debug('Video playing'))
          .catch(err => logger.debug('Autoplay error:', err));
      }
    };

    playVideo();

    const handleInteraction = () => {
      playVideo();
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  const pillars = [
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To become the most trusted creative and technology partner for businesses, schools, startups, and local brands across India — empowering every client with world-class design and software that drives real growth.",
    },
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To deliver affordable, high-quality design and development solutions — from branding and social media to websites and custom software — so that every business, no matter how small, can compete with confidence.",
    },
    {
      icon: Rocket,
      title: "Our Approach",
      description:
        "We combine creative excellence with technical precision. Every project starts with understanding your goals, and ends only when you're proud of what you've launched.",
    },
  ];

  const services = [
    { icon: CreditCard,  label: "ID Card Designs" },
    { icon: Palette,     label: "Logo Design" },
    { icon: Megaphone,   label: "Advertisement Designs" },
    { icon: Camera,      label: "Photoshop Services" },
    { icon: Globe,       label: "Website Design & Development" },
    { icon: ShoppingCart,label: "E-Commerce Development" },
    { icon: Video,       label: "Video Editing" },
    { icon: Code2,       label: "Software Development" },
    { icon: Wrench,      label: "Web Maintenance & Tech Services" },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from Hero section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-background/0 to-background/100 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* ── Section Header ── */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="fairy-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold break-normal">
              <span className="gradient-text">About</span> Our Company
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto break-normal">
              RajKayal Creative Hub — a passionate creative &amp; technology studio
              building digital experiences that make brands stand out.
            </p>
          </div>

          {/* ── Story + Video ── */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-20">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground break-normal">
                Crafting Digital Excellence Since Day One
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed break-normal">
                RajKayal Creative Hub is a freshly launched creative venture driven by
                passion, innovation, and a relentless commitment to quality. We're
                building on cutting-edge design principles and modern development
                practices to create experiences that truly connect with audiences.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed break-normal">
                Our team brings fresh perspectives and deep expertise across design,
                development, animation, video editing, and digital strategy. We serve
                businesses, schools, colleges, startups, and local brands all across
                India — delivering premium results at accessible prices.
              </p>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm border border-accent/20 overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  controls={false}
                  onError={(e) => logger.error('Video error:', e)}
                  onLoadedData={() => {
                    logger.debug('Video loaded, attempting autoplay');
                    const video = videoRef.current;
                    if (video) {
                      video.play().catch(err => logger.debug('Autoplay error:', err));
                    }
                  }}
                >
                  <source src="/rajka.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          {/* ── Vision · Mission · Approach ── */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 mb-16 md:mb-20">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="group p-5 sm:p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <pillar.icon className="w-7 h-7 text-accent" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground break-normal">
                  {pillar.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed break-normal">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* ── Services We Provide ── */}
          <div className="text-center mb-10 space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground break-normal">
              Services We <span className="gradient-text">Provide</span>
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto break-normal">
              From creative design to full-stack development — one studio, everything you need.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => (
              <div
                key={service.label}
                className="group flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-gold transition-all duration-300 cursor-default"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-sm sm:text-base font-medium text-foreground leading-snug break-normal">
                  {service.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
