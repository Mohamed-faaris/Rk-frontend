import BusinessAnalyticsUpdate from '../models/BusinessAnalyticsUpdate.js';
import Order from '../models/Order.js';

const buildMetricsSnapshot = async () => {
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 30);

  const [
    totalOrders,
    completedOrders,
    todayCompleted,
    weekCompleted,
    monthCompleted
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'completed' }),
    Order.find({ status: 'completed', completedDate: { $gte: todayStart } }).select('budget totalAmount'),
    Order.find({ status: 'completed', completedDate: { $gte: weekStart } }).select('budget totalAmount'),
    Order.find({ status: 'completed', completedDate: { $gte: monthStart } }).select('budget totalAmount')
  ]);

  const sumRevenue = (orders) => orders.reduce((sum, order) => sum + (order.budget || order.totalAmount || 0), 0);

  return {
    totalOrders,
    completedOrders,
    todayRevenue: sumRevenue(todayCompleted),
    weekRevenue: sumRevenue(weekCompleted),
    monthRevenue: sumRevenue(monthCompleted)
  };
};

export const listPublishedBusinessAnalyticsUpdates = async (req, res) => {
  try {
    const updates = await BusinessAnalyticsUpdate.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: updates.length,
      data: updates
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch business analytics updates'
    });
  }
};

export const getBusinessAnalyticsUpdateById = async (req, res) => {
  try {
    const update = await BusinessAnalyticsUpdate.findOne({
      _id: req.params.id,
      isPublished: true
    });

    if (!update) {
      return res.status(404).json({ success: false, error: 'Update not found' });
    }

    return res.status(200).json({ success: true, data: update });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch update' });
  }
};

export const createBusinessAnalyticsUpdate = async (req, res) => {
  try {
    const { title, summary, content, tags, isPublished } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title, summary, and content are required'
      });
    }

    const metricsSnapshot = await buildMetricsSnapshot();

    const update = await BusinessAnalyticsUpdate.create({
      title,
      summary,
      content,
      tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
      isPublished: isPublished !== false,
      publishedAt: new Date(),
      metricsSnapshot,
      author: {
        id: req.user.id,
        name: req.user.name || 'Finance Team',
        role: req.user.role
      }
    });

    return res.status(201).json({ success: true, data: update });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create business analytics update'
    });
  }
};

export const updateBusinessAnalyticsUpdate = async (req, res) => {
  try {
    const { title, summary, content, tags, isPublished } = req.body;

    const existing = await BusinessAnalyticsUpdate.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Update not found' });
    }

    const metricsSnapshot = await buildMetricsSnapshot();

    const updated = await BusinessAnalyticsUpdate.findByIdAndUpdate(
      req.params.id,
      {
        ...(title ? { title } : {}),
        ...(summary ? { summary } : {}),
        ...(content ? { content } : {}),
        ...(Array.isArray(tags) ? { tags: tags.map((tag) => String(tag).trim()).filter(Boolean) } : {}),
        ...(typeof isPublished === 'boolean' ? { isPublished } : {}),
        metricsSnapshot,
        publishedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update business analytics update'
    });
  }
};

export const deleteBusinessAnalyticsUpdate = async (req, res) => {
  try {
    const deleted = await BusinessAnalyticsUpdate.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Update not found' });
    }

    return res.status(200).json({ success: true, message: 'Update deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete business analytics update'
    });
  }
};
