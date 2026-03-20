import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-yellow-900/10 to-black z-0" />
      
      {/* Accent Light */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4 animate-fade-in-up">
            <h2 className="fairy-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold break-normal leading-tight">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto break-normal px-2 sm:px-0">
              Watch our featured projects showcase.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
            <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border/60 shadow-gold aspect-video bg-black/80">
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

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur px-4 py-3">
              <p className="text-sm sm:text-base text-muted-foreground">
                On mobile, use full screen for the best viewing experience.
              </p>
              <Button asChild className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <a
                  href="https://youtu.be/n0Fa4-Rzgrw?si=-eDctFYNJqgnLssO"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open featured project video on YouTube"
                >
                  Open on YouTube
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;