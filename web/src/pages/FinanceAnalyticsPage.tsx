import { FormEvent, useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LineChart, RefreshCw, Save, RotateCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import revenueService, { RevenueStats } from '@/lib/revenueService';
import businessAnalyticsUpdateService, { BusinessAnalyticsUpdate } from '@/lib/businessAnalyticsUpdateService';

const chartWidth = 760;
const chartHeight = 240;

export default function FinanceAnalyticsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [updates, setUpdates] = useState<BusinessAnalyticsUpdate[]>([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('Revenue, Orders, Growth');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterType, setFilterType] = useState('last30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specificDate, setSpecificDate] = useState('');
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to calculate dates based on filter type
  const getDateRange = (type: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(today);
    const end = new Date(today);

    switch (type) {
      case 'today':
        return { start: today.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };
      case 'last7days':
        start.setDate(start.getDate() - 7);
        return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };
      case 'last30days':
        start.setDate(start.getDate() - 30);
        return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };
      case 'thismonth':
        start.setDate(1);
        return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };
      case 'specific':
        return { start: specificDate, end: specificDate };
      case 'custom':
        return { start: startDate, end: endDate };
      default:
        start.setDate(start.getDate() - 30);
        return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };
    }
  };

  useEffect(() => {
    if (!user) return;

    const canAccess = ['admin', 'ceo', 'finance_analyst'].includes(user.role);
    if (!canAccess) {
      navigate('/');
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const dateRange = getDateRange(filterType);
        const [statsData, updateData] = await Promise.all([
          revenueService.getRevenueStats(
            dateRange.start || undefined,
            dateRange.end || undefined
          ),
          businessAnalyticsUpdateService.listPublished()
        ]);
        setStats(statsData);
        setUpdates(updateData);
        setLastRefreshTime(new Date());
      } catch {
        setError('Failed to load finance analytics data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, user, filterType, startDate, endDate, specificDate]);

  // Auto-refresh effect
  useEffect(() => {
    if (!isAutoRefreshEnabled) {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
        autoRefreshIntervalRef.current = null;
      }
      return;
    }

    const loadData = async () => {
      try {
        const dateRange = getDateRange(filterType);
        const [statsData, updateData] = await Promise.all([
          revenueService.getRevenueStats(
            dateRange.start || undefined,
            dateRange.end || undefined
          ),
          businessAnalyticsUpdateService.listPublished()
        ]);
        setStats(statsData);
        setUpdates(updateData);
        setLastRefreshTime(new Date());
      } catch (err) {
        console.error('Auto-refresh error:', err);
      }
    };

    autoRefreshIntervalRef.current = setInterval(loadData, refreshInterval * 1000);

    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
        autoRefreshIntervalRef.current = null;
      }
    };
  }, [isAutoRefreshEnabled, refreshInterval, filterType, startDate, endDate, specificDate]);

  const chartPoints = useMemo(() => {
    if (!stats?.chart?.length) return '';

    const data = stats.chart;
    const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
    const stepX = chartWidth / Math.max(data.length - 1, 1);

    return data
      .map((d, index) => {
        const x = index * stepX;
        const y = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 20) - 10;
        return `${x},${y}`;
      })
      .join(' ');
  }, [stats]);

  const handlePublish = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError('Title, summary, and content are required.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      await businessAnalyticsUpdateService.create({
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        isPublished: true
      });

      setTitle('');
      setSummary('');
      setContent('');
      setSuccess('Business analytics update published successfully.');

      const dateRange = getDateRange(filterType);
      const [statsData, updateData] = await Promise.all([
        revenueService.getRevenueStats(dateRange.start || undefined, dateRange.end || undefined),
        businessAnalyticsUpdateService.listPublished()
      ]);
      setStats(statsData);
      setUpdates(updateData);
    } catch {
      setError('Failed to publish analytics update.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Button onClick={() => navigate('/#home')} variant="outline" className="gap-2 w-full md:w-auto">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Button onClick={() => navigate('/business-insights')} variant="outline" className="gap-2 w-full md:w-auto">
              <LineChart className="w-4 h-4" />
              View Public Business Blog
            </Button>
          </div>

          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">
              Finance & Business <span className="gradient-text">Analytics Updates</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Track order and revenue performance, then publish strategic updates as public business blog posts.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-6 bg-green-900/20 border-green-500/50">
              <AlertDescription className="text-green-500">{success}</AlertDescription>
            </Alert>
          )}

          {!isLoading && (
            <Card className="border-border mb-6">
              <CardHeader>
                <CardTitle>Auto-Refresh Settings</CardTitle>
                <CardDescription>Enable automatic data refresh</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="auto-refresh-toggle"
                      type="checkbox"
                      checked={isAutoRefreshEnabled}
                      onChange={(e) => setIsAutoRefreshEnabled(e.target.checked)}
                      className="w-5 h-5 rounded border-border cursor-pointer"
                    />
                    <Label htmlFor="auto-refresh-toggle" className="cursor-pointer">
                      {isAutoRefreshEnabled ? '✓ Auto-Refresh Enabled' : 'Enable Auto-Refresh'}
                    </Label>
                  </div>

                  {isAutoRefreshEnabled && (
                    <div className="space-y-2 pl-8">
                      <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="refresh-interval"
                          type="number"
                          min="10"
                          max="300"
                          value={refreshInterval}
                          onChange={(e) => setRefreshInterval(Math.max(10, parseInt(e.target.value) || 30))}
                          className="border-border w-24"
                        />
                        <span className="text-xs text-muted-foreground">seconds</span>
                      </div>
                    </div>
                  )}

                  {lastRefreshTime && (
                    <div className="text-xs text-muted-foreground pl-8">
                      Last refresh: {lastRefreshTime.toLocaleTimeString('en-IN')}
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      if (isAutoRefreshEnabled) {
                        setIsAutoRefreshEnabled(false);
                      }
                    }}
                    disabled={!isAutoRefreshEnabled}
                    variant="outline"
                    className="gap-2 w-full"
                  >
                    <RotateCw className="w-4 h-4" />
                    Stop Auto-Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {success && (
            <Alert className="mb-6 bg-green-900/20 border-green-500/50">
              <AlertDescription className="text-green-500">{success}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <Card className="border-border">
              <CardContent className="py-10 text-center text-muted-foreground">Loading analytics...</CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <Card className="border-border">
                  <CardHeader className="pb-2"><CardDescription>Orders Today</CardDescription></CardHeader>
                  <CardContent><CardTitle>{stats?.today.orders ?? 0}</CardTitle></CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader className="pb-2"><CardDescription>Orders This Week</CardDescription></CardHeader>
                  <CardContent><CardTitle>{stats?.week.orders ?? 0}</CardTitle></CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader className="pb-2"><CardDescription>Orders This Month</CardDescription></CardHeader>
                  <CardContent><CardTitle>{stats?.month.orders ?? 0}</CardTitle></CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader className="pb-2"><CardDescription>Revenue This Week</CardDescription></CardHeader>
                  <CardContent><CardTitle>₹{(stats?.week.revenue ?? 0).toLocaleString('en-IN')}</CardTitle></CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader className="pb-2"><CardDescription>Revenue This Month</CardDescription></CardHeader>
                  <CardContent><CardTitle>₹{(stats?.month.revenue ?? 0).toLocaleString('en-IN')}</CardTitle></CardContent>
                </Card>
              </div>

              <Card className="border-border mb-8">
                <CardHeader>
                  <CardTitle>
                    {filterType === 'today' && 'Revenue Graph - Today'}
                    {filterType === 'last7days' && 'Revenue Graph - Last 7 Days'}
                    {filterType === 'last30days' && 'Revenue Graph - Last 30 Days'}
                    {filterType === 'thismonth' && 'Revenue Graph - This Month'}
                    {filterType === 'specific' && `Revenue Graph - ${specificDate ? new Date(specificDate).toLocaleDateString('en-IN') : 'Select Date'}`}
                    {filterType === 'custom' && startDate && endDate && `Revenue Graph - ${new Date(startDate).toLocaleDateString('en-IN')} to ${new Date(endDate).toLocaleDateString('en-IN')}`}
                    {filterType === 'custom' && (!startDate || !endDate) && 'Revenue Graph - Select Date Range'}
                  </CardTitle>
                  <CardDescription>
                    {filterType === 'specific' ? 'Revenue for selected date.' : 'Revenue from completed orders for selected period.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="min-w-[700px] w-full h-64" role="img" aria-label="Revenue graph">
                      <rect x="0" y="0" width={chartWidth} height={chartHeight} fill="transparent" />
                      <line x1="0" y1={chartHeight - 10} x2={chartWidth} y2={chartHeight - 10} stroke="currentColor" opacity="0.2" />
                      <polyline
                        fill="none"
                        stroke="hsl(var(--accent))"
                        strokeWidth="3"
                        points={chartPoints}
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border mb-8">
                <CardHeader>
                  <CardTitle>Publish New Business Update</CardTitle>
                  <CardDescription>
                    This will appear as a blog post in the public business insights page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePublish} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly revenue trend and key takeaways" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Summary</Label>
                      <Input id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary for blog cards" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Detailed Update</Label>
                      <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="Describe order movement, revenue direction, and strategic recommendations..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Revenue, Orders, Business Strategy" />
                    </div>
                    <Button type="submit" disabled={isSaving} className="bg-accent hover:bg-accent/90 gap-2">
                      {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSaving ? 'Publishing...' : 'Publish Update'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Recently Published</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {updates.slice(0, 5).map((update) => (
                    <div key={update._id} className="border border-border rounded-md p-3">
                      <p className="font-medium">{update.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(update.publishedAt || update.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {updates.length === 0 && <p className="text-sm text-muted-foreground">No updates published yet.</p>}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
