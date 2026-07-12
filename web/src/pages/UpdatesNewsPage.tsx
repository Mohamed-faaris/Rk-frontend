import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Maximize2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import updatesNewsService, { UpdatesNewsItem, normalizeGoogleDriveEmbedUrl } from '@/lib/updatesNewsService';
import GoogleDrivePreview from '@/components/GoogleDrivePreview';

const getPreviewText = (value: string, maxLength = 220) => {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
};

export default function UpdatesNewsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<UpdatesNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<UpdatesNewsItem | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const data = await updatesNewsService.listPublished();
        setItems(data);
      } catch {
        setError('Failed to load updates and news. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      setActiveIndex(0);
      setSelectedItem(null);
      return;
    }

    setActiveIndex((currentIndex) => Math.min(currentIndex, items.length - 1));
  }, [items]);

  const activeItem = items[activeIndex] || null;

  const openItem = (item: UpdatesNewsItem) => {
    setSelectedItem(item);
  };

  const goToPrevious = () => {
    if (items.length === 0) {
      return;
    }

    setActiveIndex((currentIndex) => (currentIndex === 0 ? items.length - 1 : currentIndex - 1));
  };

  const goToNext = () => {
    if (items.length === 0) {
      return;
    }

    setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
  };

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items]);

  // fade animation on slide change
  useEffect(() => {
    setFadeIn(false);
    const t = window.setTimeout(() => setFadeIn(true), 20);
    return () => window.clearTimeout(t);
  }, [activeIndex]);

  // touch handlers for swipe support
  const handleTouchStart = (e: any) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: any) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const delta = touchStartX - touchEndX;
    const threshold = 50; // px
    if (delta > threshold) {
      goToNext();
    } else if (delta < -threshold) {
      goToPrevious();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="mb-6 md:mb-8">
            <Button onClick={() => navigate('/#about')} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

            <div className="mb-8 md:mb-12 max-w-4xl space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs md:text-sm text-accent">
              <Sparkles className="w-4 h-4" />
              Company updates
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Updates <span className="gradient-text">& News</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-base md:text-lg leading-relaxed">
              Published announcements, project highlights, and studio news presented as a single slide at a time with manual navigation.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <Card className="border-border">
              <CardContent className="py-10 text-center text-muted-foreground">
                Loading updates and news...
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-10 text-center text-muted-foreground">
                No updates published yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Top navigation removed — using bottom-centered indicators */}

              <Card className="relative group overflow-hidden border-border/70 bg-card/90 shadow-xl shadow-black/5 transition-all duration-300 hover:border-accent/40">
                <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                  <button
                    type="button"
                    onClick={() => activeItem && openItem(activeItem)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="relative isolate block w-full overflow-hidden bg-black text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={activeItem ? `Open full update for ${activeItem.title}` : 'Open update'}
                  >
                    <div className={`aspect-video w-full transition-opacity duration-300 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                      <GoogleDrivePreview
                        src={activeItem?.imageUrl || ''}
                        title={activeItem?.title || 'Update preview'}
                        className="aspect-video w-full"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4 md:p-6">
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <Maximize2 className="h-3.5 w-3.5" />
                        Click to view the full update
                      </div>
                    </div>
                  </button>

                  <div className="flex flex-col justify-between border-t border-border/60 lg:border-t-0 lg:border-l">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {activeItem && new Date(activeItem.publishedAt || activeItem.createdAt).toLocaleDateString()}
                      </div>
                      <CardTitle className="text-2xl md:text-3xl leading-tight">
                        {activeItem?.title}
                      </CardTitle>
                      <CardDescription>
                        By {activeItem?.author?.name || 'Admin'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 pb-6">
                      <p className="text-sm md:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {activeItem ? getPreviewText(activeItem.description) : ''}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="button"
                          className="gap-2"
                          onClick={() => activeItem && openItem(activeItem)}
                        >
                          Read full update
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        {/* removed 'Open slide' button (desktop end-to-end overlay buttons used instead) */}
                      </div>

                      {/* indicators moved below the image for centered pill/dot style */}
                    </CardContent>
                  </div>
                </div>
                {/* left/right overlay nav */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPrevious}
                    aria-label="Previous slide"
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/30 hover:bg-accent/15 text-white shadow-sm transition"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNext}
                    aria-label="Next slide"
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/30 hover:bg-accent/15 text-white shadow-sm transition"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </Card>

              {/* Bottom-centered indicators */}
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-2">
                  {items.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={() => setActiveIndex(idx)}
                      className={
                        idx === activeIndex
                          ? 'h-2.5 sm:h-3 px-4 rounded-full bg-yellow-400 shadow-md transition-all duration-300 ease-in-out'
                          : 'h-2.5 w-2.5 rounded-full bg-gray-300 transition-all duration-300 ease-in-out'
                      }
                    />
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Dialog open={Boolean(selectedItem)} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-5xl w-[calc(100%-1rem)] max-h-[90vh] overflow-y-auto p-0">
          {selectedItem && (
            <div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="h-full w-full"
                  src={normalizeGoogleDriveEmbedUrl(selectedItem.imageUrl)}
                  title={`${selectedItem.title} full preview`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="space-y-5 p-5 md:p-8">
                <DialogHeader className="text-left">
                  <DialogDescription className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Full update
                  </DialogDescription>
                  <DialogTitle className="text-2xl md:text-4xl leading-tight">
                    {selectedItem.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(selectedItem.publishedAt || selectedItem.createdAt).toLocaleDateString()}
                  </span>
                  <span>By {selectedItem.author?.name || 'Admin'}</span>
                </div>

                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed text-foreground/90">
                  {selectedItem.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}