import { useState } from "react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import rkchblogsImage from "@/assets/rkchblogs.png";

const Portfolio = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePreviousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1));
  };

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
              Explore our showcase and insights.
            </p>
          </div>

          {/* Carousel Container */}
          <div className="max-w-4xl mx-auto">
            {/* Slide 1: Featured Project */}
            {currentSlide === 0 && (
              <div className="space-y-4 sm:space-y-5 animate-fade-in">
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
            )}

            {/* Slide 2: Blog/Insights Intro */}
            {currentSlide === 1 && (
              <div className="space-y-4 sm:space-y-5 animate-fade-in">
                <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border/60 shadow-gold bg-black aspect-video flex items-center justify-center">
                  <img 
                    src={rkchblogsImage} 
                    alt="Business Insights Blog" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur px-4 py-3">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Discover our latest business insights and analytics.
                  </p>
                  <Button asChild className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                    <a
                      href="/business-insights"
                      aria-label="View business insights blog"
                    >
                      Read Blog
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-6 sm:mt-8">
              <Button
                onClick={handlePreviousSlide}
                variant="outline"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-border/50 hover:border-accent/50 hover:bg-accent/10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>

              {/* Slide Indicators */}
              <div className="flex gap-2">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-accent w-6 sm:w-8"
                        : "bg-border/60 w-2 sm:h-3 hover:bg-border"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNextSlide}
                variant="outline"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-border/50 hover:border-accent/50 hover:bg-accent/10"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;