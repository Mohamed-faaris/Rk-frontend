import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CardSwap, { Card } from "@/components/CardSwap";
import { CreditCard, Palette, Megaphone, Camera, Globe, ShoppingCart, Video, Code2, Wrench } from "lucide-react";

const serviceCards = [
  {
    icon: Palette,
    title: "Logo & Brand Design",
    description: "Logos, color palettes, and brand marks crafted for launch-ready businesses.",
    gradient: "from-yellow-500/20 to-amber-600/10",
    accent: "#D4AF37",
  },
  {
    icon: Megaphone,
    title: "Campaign Visual Packs",
    description: "Post series, ads, and story creatives for social and paid performance campaigns.",
    gradient: "from-orange-500/20 to-red-600/10",
    accent: "#F97316",
  },
  {
    icon: Video,
    title: "Motion Edit Studio",
    description: "Reels, product teasers, and promo edits built to hold attention and convert.",
    gradient: "from-purple-500/20 to-violet-600/10",
    accent: "#A855F7",
  },
  {
    icon: Camera,
    title: "Photoshop & Design Fix",
    description: "Photo cleanup, visual refinements, posters, and print-ready edits delivered fast.",
    gradient: "from-pink-500/20 to-rose-600/10",
    accent: "#EC4899",
  },
  {
    icon: Globe,
    title: "Website Growth Build",
    description: "Landing pages, business sites, and e-commerce builds focused on speed and scale.",
    gradient: "from-blue-500/20 to-cyan-600/10",
    accent: "#3B82F6",
  },
  {
    icon: Code2,
    title: "Software Development",
    description: "Custom software and applications built to streamline your operations and scale.",
    gradient: "from-green-500/20 to-emerald-600/10",
    accent: "#10B981",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Development",
    description: "Full-featured online stores built to convert visitors into paying customers.",
    gradient: "from-teal-500/20 to-cyan-600/10",
    accent: "#14B8A6",
  },
  {
    icon: CreditCard,
    title: "ID Card & Print Design",
    description: "Professional ID cards, brochures, and print-ready designs for your business.",
    gradient: "from-indigo-500/20 to-blue-600/10",
    accent: "#6366F1",
  },
  {
    icon: Wrench,
    title: "Tech Support & Maintenance",
    description: "Hosting, deployment, maintenance, and custom software support for operations.",
    gradient: "from-slate-500/20 to-gray-600/10",
    accent: "#94A3B8",
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="relative py-24 md:py-32 bg-secondary/30 dark:bg-background shadow-sm overflow-hidden">
      {/* Smooth fade from previous section */}
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

          {/* CardSwap Layout */}
          <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-0 min-h-[520px]">
            {/* Left: Text content */}
            <div className="lg:w-1/2 space-y-6 lg:pr-12 z-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground break-normal">
                From Creative Design to<br />
                <span className="gradient-text">Full-Stack Development</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed break-normal">
                One studio, everything you need. We combine creative excellence with
                technical precision — delivering premium results at accessible prices for
                businesses, schools, startups, and local brands across India.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {["Logo & Branding", "Social Media Designs", "Video Editing & Reels", "Websites & E-Commerce", "Software Development", "Tech Support"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate('/services')}
                className="group relative overflow-hidden rounded-lg bg-accent px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold text-accent-foreground shadow-gold transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-lg"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                <span className="relative inline-flex items-center">
                  Let's Order Now!
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                </span>
              </Button>
            </div>

            {/* Right: CardSwap */}
            <div className="lg:w-1/2 relative h-[500px] w-full">
              <CardSwap
                width={340}
                height={220}
                cardDistance={55}
                verticalDistance={65}
                delay={3500}
                pauseOnHover={true}
                skewAmount={5}
                easing="elastic"
              >
                {serviceCards.map((service) => {
                  const Icon = service.icon;
                  return (
                    <Card
                      key={service.title}
                      style={{
                        background: `linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)`,
                        border: `1px solid ${service.accent}40`,
                        boxShadow: `0 0 30px ${service.accent}15, inset 0 1px 0 ${service.accent}20`,
                      }}
                    >
                      <div
                        style={{ padding: '28px 32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                      >
                        <div>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 12,
                              background: `${service.accent}20`,
                              border: `1px solid ${service.accent}40`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 16,
                            }}
                          >
                            <Icon style={{ width: 24, height: 24, color: service.accent }} />
                          </div>
                          <h3 style={{ color: '#ffffff', fontSize: 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
                            {service.title}
                          </h3>
                          <p style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 1.6 }}>
                            {service.description}
                          </p>
                        </div>
                        <div
                          style={{
                            marginTop: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            color: service.accent,
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                          }}
                        >
                          <span style={{ width: 20, height: 1, background: service.accent, display: 'inline-block' }} />
                          VIEW SERVICE
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
