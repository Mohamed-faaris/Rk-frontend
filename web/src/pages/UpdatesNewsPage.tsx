import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GoogleDrivePreview from '@/components/GoogleDrivePreview';
import updatesNewsService, { UpdatesNewsItem, normalizeGoogleDriveEmbedUrl } from '@/lib/updatesNewsService';

export default function UpdatesNewsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<UpdatesNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

          <div className="mb-8 md:mb-12 max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs md:text-sm text-accent mb-4">
              Company updates
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Updates <span className="gradient-text">& News</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-base md:text-lg leading-relaxed">
              Published announcements, project highlights, and studio news with Google Drive image embeds managed by the admin team.
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
            <div className="grid gap-6">
              {items.map((item) => (
                <Card key={item._id} className="overflow-hidden border-border">
                  <div className="grid lg:grid-cols-[1.2fr_1fr]">
                    <GoogleDrivePreview
                      src={normalizeGoogleDriveEmbedUrl(item.imageUrl)}
                      title={item.title}
                      className="aspect-[16/10] lg:min-h-[420px]"
                    />
                    <div className="flex flex-col justify-between">
                      <CardHeader>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                        </div>
                        <CardTitle className="text-2xl md:text-3xl leading-tight">{item.title}</CardTitle>
                        <CardDescription>
                          By {item.author?.name || 'Admin'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-6">
                        <p className="text-sm md:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}