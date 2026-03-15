import LandscapeHoverCard from "@/components/LandscapeHoverCard";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const Portfolio = () => {
  const projects = [
    {
      title: "Retail Checkout Upgrade",
      category: "Web Commerce",
      image: project1,
      description: "Frictionless storefront flow designed to lift order completion.",
      link: "/web-development",
    },
    {
      title: "Premium Identity Launch",
      category: "Brand Systems",
      image: project2,
      description: "A complete visual toolkit for a high-end product line debut.",
      link: "/branding-identity",
    },
    {
      title: "Motion Product Story",
      category: "3D Visuals",
      image: project3,
      description: "Immersive campaign visuals built for paid and social creative.",
      link: "/3d-animation",
    },
    {
      title: "Fintech UX Sprint",
      category: "UI/UX Design",
      image: project4,
      description: "A mobile-first interface focused on trust, speed, and clarity.",
      link: "/uiux-design",
    },
  ];

  return (
    <section id="portfolio" className="py-24 md:py-32 relative overflow-hidden bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-yellow-900/10 to-black z-0" />
      
      {/* Accent Light */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="fairy-display text-4xl md:text-5xl lg:text-6xl font-bold break-normal">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto break-normal">
              Explore our latest work and see how we bring creative visions to life.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <LandscapeHoverCard
                key={project.title}
                image={project.image}
                title={project.title}
                description={`${project.category} • ${project.description}`}
                ctaLabel="View Project"
                href={project.link}
                className={index % 2 === 0 ? "" : "md:translate-y-3"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;