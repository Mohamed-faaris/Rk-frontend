import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import GoogleDrivePreview from '@/components/GoogleDrivePreview';
import updatesNewsService, {
  UpdatesNewsItem,
  SaveUpdatesNewsPayload,
  normalizeGoogleDriveEmbedUrl
} from '@/lib/updatesNewsService';
import { ArrowLeft, PencilLine, PlusCircle, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';

const emptyForm: SaveUpdatesNewsPayload = {
  title: '',
  description: '',
  imageUrl: '',
  imageAlt: '',
  isPublished: true
};

export default function AdminUpdatesNewsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<UpdatesNewsItem[]>([]);
  const [form, setForm] = useState<SaveUpdatesNewsPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await updatesNewsService.listAll();
      setItems(data);
    } catch {
      setError('Failed to load updates and news.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (item: UpdatesNewsItem) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt || '',
      isPublished: item.isPublished
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.description.trim() || !form.imageUrl.trim()) {
      setError('Title, description, and image URL are required.');
      return;
    }

    try {
      setSaving(true);
      const payload: SaveUpdatesNewsPayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: normalizeGoogleDriveEmbedUrl(form.imageUrl),
        imageAlt: form.imageAlt?.trim() || 'Updates and news image',
        isPublished: form.isPublished
      };

      if (editingId) {
        await updatesNewsService.update(editingId, payload);
        setSuccess('Update published item updated successfully.');
      } else {
        await updatesNewsService.create(payload);
        setSuccess('Update published item created successfully.');
      }

      resetForm();
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save update.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this update and news item?')) {
      return;
    }

    try {
      await updatesNewsService.remove(id);
      setSuccess('Update deleted successfully.');
      await loadItems();
    } catch {
      setError('Failed to delete update.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-8">
          <div className="flex flex-col gap-4">
            <Button onClick={() => navigate('/admin')} variant="outline" className="gap-2 self-start">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin Dashboard
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Updates & News Manager</h1>
              <p className="text-muted-foreground mt-2 max-w-3xl">
                Publish studio updates, attach Google Drive preview links, and control what appears on the public page.
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Update' : 'Create Update'}</CardTitle>
                <CardDescription>
                  Use a Google Drive sharing link and it will be converted to an embeddable preview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="New project launch, company milestone, or announcement"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={form.description}
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                      placeholder="Write the full update shown on the public page"
                      rows={7}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Google Drive Image Link</label>
                    <Input
                      value={form.imageUrl}
                      onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste the share link or preview link. The system will normalize it for iframe embedding.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image Alt Text</label>
                    <Input
                      value={form.imageAlt || ''}
                      onChange={(event) => setForm((current) => ({ ...current, imageAlt: event.target.value }))}
                      placeholder="Optional accessibility label"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <input
                      id="isPublished"
                      type="checkbox"
                      checked={form.isPublished !== false}
                      onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
                      className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="isPublished">Publish immediately</label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={saving} className="gap-2">
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                      {editingId ? 'Update Item' : 'Create Item'}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl md:text-2xl font-semibold">Published Items</h2>
                <Button onClick={loadItems} disabled={loading} variant="outline" className="gap-2">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {items.length === 0 ? (
                <Card className="border-dashed border-border">
                  <CardContent className="py-10 text-center text-muted-foreground">
                    No updates published yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {items.map((item) => (
                    <Card key={item._id} className="overflow-hidden border-border">
                      <div className="grid md:grid-cols-[220px_1fr]">
                        <GoogleDrivePreview
                          src={normalizeGoogleDriveEmbedUrl(item.imageUrl)}
                          title={item.title}
                          className="aspect-[16/11] md:min-h-[220px]"
                        />
                        <div className="flex flex-col justify-between">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={item.isPublished ? 'default' : 'secondary'}>
                                {item.isPublished ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                                {item.isPublished ? 'Published' : 'Hidden'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
                            <CardDescription>By {item.author?.name || 'Admin'}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-0">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" variant="outline" size="sm" onClick={() => handleEdit(item)} className="gap-2">
                                <PencilLine className="w-4 h-4" />
                                Edit
                              </Button>
                              <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(item._id)} className="gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}