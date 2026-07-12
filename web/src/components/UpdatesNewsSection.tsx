import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Maximize2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import updatesNewsService, { UpdatesNewsItem, normalizeGoogleDriveEmbedUrl } from '@/lib/updatesNewsService';

const getPreviewText = (value: string, maxLength = 220) => {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
};

const UpdatesNewsSection = () => {
  const [items, setItems] = useState<UpdatesNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<UpdatesNewsItem | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await updatesNewsService.listPublished();
        setItems(data.slice(0, 3));
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
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

  return (
    <section id="updates-news" className="relative overflow-hidden py-24 md:py-32 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,185,19,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(253,185,19,0.05),transparent_30%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 md:gap-6 mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs md:text-sm text-accent">
              <Sparkles className="w-4 h-4" />
              Latest highlights
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-3 max-w-3xl">
                <h2 className="fairy-display text-4xl md:text-5xl font-bold">
                  <span className="gradient-text">Updates</span> & News
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Fresh studio announcements, project highlights, and company updates shared as a single featured slide on the homepage.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2 self-start lg:self-auto">
                <Link to="/updates-news">
                  View all updates
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border-border overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="space-y-3 p-5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card className="border-dashed border-border bg-card/70">
              <CardContent className="py-14 text-center space-y-3">
                <p className="text-lg font-semibold">No updates published yet</p>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  When the admin publishes a new update or news item, it will appear here with a Google Drive preview.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/70 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={goToPrevious}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-border/50 hover:border-accent/50 hover:bg-accent/10"
                    aria-label="Previous update"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={goToNext}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-border/50 hover:border-accent/50 hover:bg-accent/10"
                    aria-label="Next update"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </div>
              </div>

              <Card className="group overflow-hidden border-border/70 bg-card/90 shadow-xl shadow-black/5 transition-all duration-300 hover:border-accent/40">
                <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                  <button
                    type="button"
                    onClick={() => activeItem && setSelectedItem(activeItem)}
                    className="relative isolate block w-full overflow-hidden bg-black text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={activeItem ? `Open full update for ${activeItem.title}` : 'Open update'}
                  >
                    <div className="aspect-video w-full bg-black">
                      <iframe
                        className="pointer-events-none h-full w-full"
                        src={normalizeGoogleDriveEmbedUrl(activeItem?.imageUrl || '')}
                        title={activeItem?.title || 'Update preview'}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
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
                    <CardContent className="space-y-5 p-5 md:p-6 lg:p-8">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {activeItem && new Date(activeItem.publishedAt || activeItem.createdAt).toLocaleDateString()}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                          {activeItem?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          By {activeItem?.author?.name || 'Admin'}
                        </p>
                      </div>

                      <p className="text-sm md:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {activeItem ? getPreviewText(activeItem.description) : ''}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="button"
                          className="gap-2"
                          onClick={() => activeItem && setSelectedItem(activeItem)}
                        >
                          Read full update
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={() => activeItem && setSelectedItem(activeItem)}
                        >
                          Open slide
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>

                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

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
    </section>
  );
};

export default UpdatesNewsSection;