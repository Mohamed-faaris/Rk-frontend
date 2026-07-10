import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import GoogleDrivePreview from '@/components/GoogleDrivePreview';
import updatesNewsService, { UpdatesNewsItem, normalizeGoogleDriveEmbedUrl } from '@/lib/updatesNewsService';

const UpdatesNewsSection = () => {
  const [items, setItems] = useState<UpdatesNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section id="updates-news" className="relative py-24 md:py-32 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,185,19,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(253,185,19,0.05),transparent_30%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 md:gap-6 mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs md:text-sm text-accent">
              Latest highlights
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-3 max-w-3xl">
                <h2 className="fairy-display text-4xl md:text-5xl font-bold">
                  <span className="gradient-text">Updates</span> & News
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Fresh studio announcements, project highlights, and company updates shared directly from the admin dashboard.
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
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Card key={item._id} className="group overflow-hidden border-border bg-card/90 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 hover:-translate-y-1">
                  <GoogleDrivePreview
                    src={normalizeGoogleDriveEmbedUrl(item.imageUrl)}
                    title={item.title}
                    className="aspect-[16/10]"
                  />
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpdatesNewsSection;