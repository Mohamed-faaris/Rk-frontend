import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LandscapeHoverCard from "@/components/LandscapeHoverCard";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const Services = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Identity Starter Kit",
      description: "Logos, color palettes, and brand marks crafted for launch-ready businesses.",
      image: project1,
      href: "/services-overview",
    },
    {
      title: "Campaign Visual Packs",
      description: "Post series, ads, and story creatives for social and paid performance campaigns.",
      image: project2,
      href: "/services-overview",
    },
    {
      title: "Motion Edit Studio",
      description: "Reels, product teasers, and promo edits built to hold attention and convert.",
      image: project3,
      href: "/services-overview",
    },
    {
      title: "Design Fix & Polish",
      description: "Photo cleanup, visual refinements, posters, and print-ready edits delivered fast.",
      image: project4,
      href: "/services-overview",
    },
    {
      title: "Website Growth Build",
      description: "Landing pages, business sites, and e-commerce builds focused on speed and scale.",
      image: project1,
      href: "/services",
    },
    {
      title: "Tech Support Cell",
      description: "Hosting, deployment, maintenance, and custom software support for operations.",
      image: project2,
      href: "/services",
    },
  ];

  return (
    <section id="services" className="relative py-24 md:py-32 bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold break-normal">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto break-normal">
              Comprehensive digital solutions tailored to elevate your brand and achieve your goals.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <LandscapeHoverCard
                key={service.title}
                image={service.image}
                title={service.title}
                description={service.description}
                ctaLabel="Explore Service"
                href={service.href}
                className={index % 2 === 0 ? "" : "lg:translate-y-2"}
              />
            ))}
          </div>

          {/* Let's Order Now Button */}
          <div className="text-center">
            <Button
              onClick={() => navigate('/services')}
              className="bg-accent hover:bg-accent/90 font-bold text-lg px-8 py-6 rounded-lg transition-all duration-300 shadow-gold hover:shadow-lg group"
            >
              Let's Order Now!
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
