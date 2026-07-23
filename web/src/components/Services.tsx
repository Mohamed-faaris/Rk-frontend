import { ArrowRight, ArrowLeft, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpecularButton from "@/components/ui/SpecularButton";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import CardSwap, { Card, CardSwapHandle } from "@/components/CardSwap";
import {
  CreditCard, Palette, Megaphone, Camera,
  Globe, ShoppingCart, Video, Code2, Wrench
} from "lucide-react";

const serviceCards = [
  {
    icon: Palette,
    title: "Logo & Brand Design",
    tagline: "Build a brand that stands out",
    description:
      "Logos, color palettes, typography systems, and brand marks crafted for launch-ready businesses that want to make a lasting impression.",
    highlights: ["Logo & wordmark design", "Color palette & typography", "Brand guidelines", "Stationery & ID design"],
    gradient: "from-yellow-500/20 to-amber-600/10",
    accent: "#D4AF37",
  },
  {
    icon: Megaphone,
    title: "Campaign Visual Packs",
    tagline: "Content that drives conversions",
    description:
      "Post series, ads, and story creatives for social media and paid performance campaigns — designed to scroll-stop and convert.",
    highlights: ["Social media posts", "Story & reel templates", "Ad creatives (Meta/Google)", "Event banners"],
    gradient: "from-orange-500/20 to-red-600/10",
    accent: "#F97316",
  },
  {
    icon: Video,
    title: "Motion Edit Studio",
    tagline: "Video that holds attention",
    description:
      "Reels, product teasers, and promo edits built to hold attention, grow your audience, and convert viewers into customers.",
    highlights: ["Short-form reels & TikToks", "Product teasers", "Promo & event videos", "Subtitle & caption design"],
    gradient: "from-purple-500/20 to-violet-600/10",
    accent: "#A855F7",
  },
  {
    icon: Camera,
    title: "Photoshop & Design Fix",
    tagline: "Polish every pixel",
    description:
      "Photo retouching, background removal, visual refinements, posters, and print-ready edits delivered fast and at high quality.",
    highlights: ["Photo editing & retouching", "Background removal", "Poster & flyer design", "Print-ready exports"],
    gradient: "from-pink-500/20 to-rose-600/10",
    accent: "#EC4899",
  },
  {
    icon: Globe,
    title: "Website Growth Build",
    tagline: "Your 24/7 sales engine",
    description:
      "Landing pages, business sites, and e-commerce builds focused on speed, SEO, and scale — built to grow with your business.",
    highlights: ["Landing pages & portfolios", "Business & corporate sites", "E-commerce stores", "SEO & performance"],
    gradient: "from-blue-500/20 to-cyan-600/10",
    accent: "#3B82F6",
  },
  {
    icon: Code2,
    title: "Software Development",
    tagline: "Custom tools, built for you",
    description:
      "Custom software and web applications built to streamline your operations, automate workflows, and scale your business.",
    highlights: ["Custom web apps", "Internal dashboards", "API integrations", "Automation tools"],
    gradient: "from-green-500/20 to-emerald-600/10",
    accent: "#10B981",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Development",
    tagline: "Stores that sell while you sleep",
    description:
      "Full-featured online stores built to convert visitors into paying customers with smooth checkout flows and mobile-first design.",
    highlights: ["Product catalogue setup", "Payment gateway integration", "Mobile-first checkout", "Inventory management"],
    gradient: "from-teal-500/20 to-cyan-600/10",
    accent: "#14B8A6",
  },
  {
    icon: CreditCard,
    title: "ID Card & Print Design",
    tagline: "Professional print collateral",
    description:
      "Professional ID cards, brochures, certificates, and print-ready designs that represent your business with authority.",
    highlights: ["ID & access cards", "Brochures & catalogues", "Certificates & awards", "Business cards"],
    gradient: "from-indigo-500/20 to-blue-600/10",
    accent: "#6366F1",
  },
  {
    icon: Wrench,
    title: "Tech Support & Maintenance",
    tagline: "We keep your systems running",
    description:
      "Hosting management, deployment, bug fixes, security updates, and custom software support to keep your operations smooth.",
    highlights: ["Hosting & deployment", "Bug fixes & updates", "Security monitoring", "Custom tech support"],
    gradient: "from-slate-500/20 to-gray-600/10",
    accent: "#94A3B8",
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardSwapRef = useRef<CardSwapHandle>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isCoolingDown = useRef(false);

  // Fade-transition the left content when active card changes
  useEffect(() => {
    if (activeIdx === displayIdx) return;
    setIsTransitioning(true);
    const t = setTimeout(() => {
      setDisplayIdx(activeIdx);
      setIsTransitioning(false);
    }, 220);
    return () => clearTimeout(t);
  }, [activeIdx]);



  const svc = serviceCards[displayIdx];
  const Icon = svc.icon;
  const total = serviceCards.length;
  const progress = ((displayIdx + 1) / total) * 100;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 md:py-32 bg-secondary/30 dark:bg-background shadow-sm overflow-hidden"
    >
      {/* Fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="fairy-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold break-normal">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto break-normal">
              Comprehensive digital solutions tailored to elevate your brand and achieve your goals.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-0" style={{ minHeight: 600 }}>

            {/* ── Left: Dynamic service info ─────────────────────────── */}
            <div className="lg:w-1/2 lg:pr-16 z-10 w-full">

              {/* Animated content block */}
              <div
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? 'translateY(14px)' : 'translateY(0px)',
                  transition: 'opacity 0.22s ease, transform 0.22s ease',
                }}
              >
                {/* Icon + number */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: `${svc.accent}22`,
                      border: `1px solid ${svc.accent}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: 26, height: 26, color: svc.accent }} />
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: svc.accent,
                      textTransform: 'uppercase',
                    }}
                  >
                    {svc.tagline}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground break-normal mb-4">
                  {svc.title}
                </h3>

                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed break-normal mb-6">
                  {svc.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 mb-8">
                  {svc.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: svc.accent,
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${svc.accent}80`,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress + Navigation */}
              <div className="mb-8">
                {/* Counter & Buttons */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {String(displayIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => cardSwapRef.current?.swapPrev()} 
                      className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                      aria-label="Previous Service"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => cardSwapRef.current?.swapNext()} 
                      className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                      aria-label="Next Service"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-0.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%`, background: svc.accent }}
                  />
                </div>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center gap-2 mb-8">
                {serviceCards.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === displayIdx ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === displayIdx ? svc.accent : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label={`Service ${i + 1}`}
                  />
                ))}
              </div>

              {/* CTA */}
              <SpecularButton
                onClick={() => navigate('/services')}
                size="lg"
                tint="#d7af50"
                tintOpacity={0.1}
                baseColor="#1c1913"
                textColor="#f5f5f5"
                lineColor="#d7af50"
                className="mt-4 group"
                autoAnimate={true}
              >
                <span className="relative inline-flex items-center font-bold font-sans">
                  Let's Order Now!
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                </span>
              </SpecularButton>
            </div>

            {/* ── Right: CardSwap ──────────────────────────────────────── */}
            <div
              className="lg:w-1/2 relative w-full"
              style={{ height: 600 }}
            >
              <CardSwap
                ref={cardSwapRef}
                width={420}
                height={300}
                cardDistance={52}
                verticalDistance={62}
                delay={5000}
                pauseOnHover={true}
                skewAmount={5}
                easing="elastic"
                onActiveChange={setActiveIdx}
              >
                {serviceCards.map((service) => {
                  const SvcIcon = service.icon;
                  return (
                    <Card
                      key={service.title}
                      style={{
                        background: 'linear-gradient(135deg, #0d0d0d 0%, #181818 100%)',
                        border: `1px solid ${service.accent}35`,
                        boxShadow: `0 0 40px ${service.accent}12, inset 0 1px 0 ${service.accent}18`,
                      }}
                    >
                      <div
                        style={{
                          padding: '32px 36px',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div>
                          {/* Card icon */}
                          <div
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: 13,
                              background: `${service.accent}1a`,
                              border: `1px solid ${service.accent}40`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 18,
                            }}
                          >
                            <SvcIcon style={{ width: 26, height: 26, color: service.accent }} />
                          </div>

                          {/* Card title */}
                          <h3 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>
                            {service.title}
                          </h3>

                          {/* Card tagline */}
                          <p style={{ color: '#71717a', fontSize: 13, lineHeight: 1.65 }}>
                            {service.description}
                          </p>
                        </div>

                        {/* Card footer */}
                        <div
                          style={{
                            marginTop: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              color: service.accent,
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}
                          >
                            <span style={{ width: 22, height: 1, background: service.accent, display: 'inline-block' }} />
                            View Pricing
                          </div>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: `${service.accent}18`,
                              border: `1px solid ${service.accent}40`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ArrowRight style={{ width: 13, height: 13, color: service.accent }} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </CardSwap>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
