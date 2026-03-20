const Portfolio = () => {
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
          <div className="text-center mb-12 space-y-4 animate-fade-in-up">
            <h2 className="fairy-display text-4xl md:text-5xl lg:text-6xl font-bold break-normal">
              Featured <span className="gradient-text">Project</span>
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto break-normal">
              Watch our featured project showcase.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 shadow-gold aspect-video bg-black/80">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/n0Fa4-Rzgrw"
                title="Featured Project Video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;