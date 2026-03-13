import LandscapeHoverCard from "@/components/LandscapeHoverCard";
import identityStarterKitImage from "@/assets/Identity Starter Kit.png";
import campaignVisualPacksImage from "@/assets/Campaign Visual Packs.png";
import motionEditStudioImage from "@/assets/Motion Edit Studio.png";
import designFixPolishImage from "@/assets/Design Fix & Polish.png";
import websiteGrowthBuildImage from "@/assets/Website Growth Build.png";
import techSupportCellImage from "@/assets/Tech Support Cell.png";

const Services = () => {
  const services = [
    {
      title: "Identity Starter Kit",
      description: "Logos, color palettes, and brand marks crafted for launch-ready businesses.",
      image: identityStarterKitImage,
      href: "/services-overview",
    },
    {
      title: "Campaign Visual Packs",
      description: "Post series, ads, and story creatives for social and paid performance campaigns.",
      image: campaignVisualPacksImage,
      href: "/services-overview",
    },
    {
      title: "Motion Edit Studio",
      description: "Reels, product teasers, and promo edits built to hold attention and convert.",
      image: motionEditStudioImage,
      href: "/services-overview",
    },
    {
      title: "Design Fix & Polish",
      description: "Photo cleanup, visual refinements, posters, and print-ready edits delivered fast.",
      image: designFixPolishImage,
      href: "/services-overview",
    },
    {
      title: "Website Growth Build",
      description: "Landing pages, business sites, and e-commerce builds focused on speed and scale.",
      image: websiteGrowthBuildImage,
      href: "/services",
    },
    {
      title: "Tech Support Cell",
      description: "Hosting, deployment, maintenance, and custom software support for operations.",
      image: techSupportCellImage,
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
        </div>
      </div>
    </section>
  );
};

export default Services;
