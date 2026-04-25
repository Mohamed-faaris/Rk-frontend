import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import businessAnalyticsUpdateService, { BusinessAnalyticsUpdate } from '@/lib/businessAnalyticsUpdateService';

export default function BusinessInsightsPage() {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState<BusinessAnalyticsUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        setIsLoading(true);
        const data = await businessAnalyticsUpdateService.listPublished();
        setUpdates(data);
      } catch {
        setError('Failed to load business insights. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUpdates();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-6 md:mb-8">
            <Button
              onClick={() => navigate('/#home')}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">
              Business <span className="gradient-text">Insights Blog</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Revenue performance, order trends, and strategic updates shared by our Finance & Business Analyst.
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
                Loading business insights...
              </CardContent>
            </Card>
          ) : updates.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-10 text-center text-muted-foreground">
                No business insights published yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 md:gap-6">
              {updates.map((update) => (
                <Card key={update._id} className="border-border hover:border-accent/40 transition-colors">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {update.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <CardTitle className="text-xl md:text-2xl">{update.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-4 text-xs md:text-sm">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(update.publishedAt || update.createdAt).toLocaleDateString()}
                      </span>
                      <span>By {update.author?.name || 'Finance Team'}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm md:text-base text-muted-foreground">{update.summary}</p>
                    <p className="whitespace-pre-wrap text-sm md:text-base">{update.content}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                      <Card className="border-border">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">Total Orders</p>
                          <p className="text-lg font-semibold">{update.metricsSnapshot?.totalOrders ?? 0}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-border">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">Completed</p>
                          <p className="text-lg font-semibold">{update.metricsSnapshot?.completedOrders ?? 0}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-border">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">Today Revenue</p>
                          <p className="text-lg font-semibold">₹{(update.metricsSnapshot?.todayRevenue ?? 0).toLocaleString('en-IN')}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-border">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">Week Revenue</p>
                          <p className="text-lg font-semibold">₹{(update.metricsSnapshot?.weekRevenue ?? 0).toLocaleString('en-IN')}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-border">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">Month Revenue</p>
                          <p className="text-lg font-semibold">₹{(update.metricsSnapshot?.monthRevenue ?? 0).toLocaleString('en-IN')}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Snapshot captured at publish time
                    </div>
                  </CardContent>
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
