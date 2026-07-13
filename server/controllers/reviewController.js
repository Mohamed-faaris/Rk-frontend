import Review from '../models/Review.js';

// @desc    Get all approved reviews (public — visible to everyone)
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const { service, limit = 50, page = 1 } = req.query;
    let query = { status: 'approved' };

    if (service && service !== 'all') query.service = service;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    // Calculate average rating across ALL approved reviews
    const ratingAgg = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const avgRating = ratingAgg.length > 0 ? parseFloat(ratingAgg[0].avgRating.toFixed(1)) : 0;
    const totalReviews = ratingAgg.length > 0 ? ratingAgg[0].count : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      avgRating,
      totalReviews,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single review by ID (public)
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get the logged-in user's own review
// @route   GET /api/reviews/user/my-review
// @access  Private
export const getMyReview = async (req, res) => {
  try {
    // req.user.id is set by the protect middleware (not _id)
    const review = await Review.findOne({ user: req.user.id });
    res.status(200).json({ success: true, data: review || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a review (one per user)
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { rating, title, comment, service } = req.body;

    if (!rating || !title || !comment) {
      return res.status(400).json({ error: 'Please provide rating, title, and comment' });
    }

    // One review per user
    const existing = await Review.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({
        error: 'You have already submitted a review. You can edit your existing review.'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      name: req.user.name,
      email: req.user.email || '',
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      service: service || 'general'
    });

    console.log('Review created:', { id: review._id, name: review.name, rating: review.rating });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private (owner or admin)
export const updateReview = async (req, res) => {
  try {
    const { rating, title, comment, service } = req.body;

    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    // Ownership check
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this review' });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        ...(rating && { rating: parseInt(rating) }),
        ...(title && { title: title.trim() }),
        ...(comment && { comment: comment.trim() }),
        ...(service && { service }),
        status: 'approved'
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (owner or admin)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get ALL reviews regardless of status (admin)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Approve / reject a review (admin)
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) return res.status(404).json({ error: 'Review not found' });

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
