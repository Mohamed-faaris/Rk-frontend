import UpdatesNews from '../models/UpdatesNews.js';

const normalizeGoogleDriveEmbedUrl = (value) => {
  if (!value) {
    return value;
  }

  const trimmed = String(value).trim();

  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.includes('drive.google.com/file/d/') && trimmed.includes('/preview')) {
    return trimmed;
  }

  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  const openMatch = trimmed.match(/[?&]id=([^&]+)/i);
  if (openMatch?.[1] && trimmed.includes('drive.google.com')) {
    return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
  }

  return trimmed;
};

export const listPublishedUpdatesNews = async (req, res) => {
  try {
    const items = await UpdatesNews.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch updates and news'
    });
  }
};

export const listAllUpdatesNews = async (req, res) => {
  try {
    const items = await UpdatesNews.find()
      .sort({ publishedAt: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch updates and news'
    });
  }
};

export const getUpdatesNewsById = async (req, res) => {
  try {
    const item = await UpdatesNews.findOne({
      _id: req.params.id,
      isPublished: true
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Update not found' });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch update' });
  }
};

export const createUpdatesNews = async (req, res) => {
  try {
    const { title, description, imageUrl, imageAlt, isPublished } = req.body;

    if (!title || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and image URL are required'
      });
    }

    const item = await UpdatesNews.create({
      title,
      description,
      imageUrl: normalizeGoogleDriveEmbedUrl(imageUrl),
      imageAlt: imageAlt?.trim() || 'Updates and news image',
      isPublished: isPublished !== false,
      publishedAt: new Date(),
      author: {
        id: req.user.id,
        name: req.user.name || 'Admin',
        role: req.user.role
      }
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create update'
    });
  }
};

export const updateUpdatesNews = async (req, res) => {
  try {
    const { title, description, imageUrl, imageAlt, isPublished } = req.body;

    const existing = await UpdatesNews.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Update not found' });
    }

    const updated = await UpdatesNews.findByIdAndUpdate(
      req.params.id,
      {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(imageUrl ? { imageUrl: normalizeGoogleDriveEmbedUrl(imageUrl) } : {}),
        ...(typeof imageAlt === 'string' ? { imageAlt: imageAlt.trim() || 'Updates and news image' } : {}),
        ...(typeof isPublished === 'boolean' ? { isPublished } : {})
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update update'
    });
  }
};

export const deleteUpdatesNews = async (req, res) => {
  try {
    const deleted = await UpdatesNews.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Update not found' });
    }

    return res.status(200).json({ success: true, message: 'Update deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete update'
    });
  }
};