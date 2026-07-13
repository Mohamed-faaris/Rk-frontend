import { useState, useEffect, useRef, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, Send, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { reviewService, Review, CreateReviewRequest } from "@/lib/reviewService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// ─── Star Rating Input ───────────────────────────────────────────────────────
const StarRatingInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className="transition-transform hover:scale-110 focus:outline-none"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          aria-label={`${s} star${s !== 1 ? "s" : ""}`}
        >
          <Star
            size={28}
            className={`transition-colors duration-150 ${
              s <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// ─── Star Display ─────────────────────────────────────────────────────────────
const StarDisplay = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={`${
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground/30"
        }`}
      />
    ))}
  </div>
);

// ─── Review Form Modal ────────────────────────────────────────────────────────
const ReviewFormModal = ({
  onClose,
  onSuccess,
  existingReview,
}: {
  onClose: () => void;
  onSuccess: () => void;
  existingReview?: Review | null;
}) => {
  const [form, setForm] = useState<CreateReviewRequest>({
    rating: existingReview?.rating ?? 0,
    title: existingReview?.title ?? "",
    comment: existingReview?.comment ?? "",
    service: existingReview?.service ?? "general",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const services = [
    { value: "general", label: "General Experience" },
    { value: "branding", label: "Branding & Identity" },
    { value: "web-development", label: "Web Development" },
    { value: "3d-animation", label: "3D Animation" },
    { value: "uiux-design", label: "UI/UX Design" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      if (existingReview) {
        await reviewService.update(existingReview._id, form);
        toast({ title: "Review updated!", description: "Your review has been updated." });
      } else {
        await reviewService.create(form);
        toast({ title: "Review submitted!", description: "Thank you for your feedback!" });
      }
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to submit review.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-accent/20 via-accent/10 to-transparent p-6 pb-4 border-b border-border">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
          <h2 id="review-modal-title" className="text-xl font-bold text-foreground">
            {existingReview ? "Edit Your Review" : "Share Your Experience"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your honest feedback helps us improve
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <CheckCircle size={56} className="text-green-400 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
            <p className="text-muted-foreground">Your review has been submitted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Your Rating <span className="text-red-400">*</span>
              </label>
              <StarRatingInput value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
              {form.rating > 0 && (
                <p className="text-xs text-muted-foreground">
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating]}
                </p>
              )}
            </div>

            {/* Service */}
            <div className="space-y-2">
              <label htmlFor="review-service" className="text-sm font-semibold text-foreground">
                Service
              </label>
              <select
                id="review-service"
                value={form.service}
                onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              >
                {services.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="review-title" className="text-sm font-semibold text-foreground">
                Review Title <span className="text-red-400">*</span>
              </label>
              <input
                id="review-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Summarize your experience"
                required
                maxLength={100}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label htmlFor="review-comment" className="text-sm font-semibold text-foreground">
                Your Review <span className="text-red-400">*</span>
              </label>
              <textarea
                id="review-comment"
                value={form.comment}
                onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                placeholder="Tell us about your experience in detail..."
                required
                maxLength={1000}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{form.comment.length}/1000</p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent hover:bg-accent/90 shadow-gold disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={16} />
                  {existingReview ? "Update Review" : "Submit Review"}
                </span>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({
  review,
  isOwn,
  onEdit,
  onDelete,
}: {
  review: Review;
  isOwn: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = review.comment && review.comment.length > 150;

  const initials = review.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const serviceLabels: Record<string, string> = {
    branding: "Branding",
    "web-development": "Web Dev",
    "3d-animation": "3D Animation",
    "uiux-design": "UI/UX",
    general: "General",
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  return (
    <div className="relative group flex flex-col h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5">
      {/* Quote icon */}
      <Quote
        size={32}
        className="absolute top-4 right-4 text-accent/15 group-hover:text-accent/25 transition-colors"
      />

      {/* "Your Review" badge */}
      {isOwn && (
        <div className="absolute top-4 left-4 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 font-medium">
          <span>✦</span> Your Review
        </div>
      )}

      {/* Stars + service badge */}
      <div className={`flex items-center justify-between ${isOwn ? 'mt-7' : ''} mb-4`}>
        <StarDisplay rating={review.rating} />
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium border border-accent/20">
          {serviceLabels[review.service] || "General"}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-foreground text-base mb-2 line-clamp-1">{review.title}</h3>

      {/* Comment */}
      <div className="flex-1 flex flex-col">
        <p className={`text-muted-foreground text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-4'}`}>
          {review.comment}
        </p>
        {isLong && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors mt-2 self-start"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Reviewer info */}
      <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent/70 to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{review.name}</p>
            <p className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</p>
          </div>
        </div>

        {/* Edit/Delete for own review */}
        {isOwn && (
          <div className="flex gap-1.5">
            <button
              onClick={onEdit}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
              aria-label="Edit review"
              title="Edit your review"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
              aria-label="Delete review"
              title="Delete your review"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main ReviewsSection Component ───────────────────────────────────────────
const ReviewsSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);

  const cardsPerView = useRef(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Responsive cards per view
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) cardsPerView.current = 1;
      else if (window.innerWidth < 1024) cardsPerView.current = 2;
      else cardsPerView.current = 3;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await reviewService.getAll({ limit: 50 });
      setReviews(res.data);
      setAvgRating(res.avgRating);
      setTotalReviews(res.totalReviews);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyReview = useCallback(async () => {
    if (!user) return;
    try {
      const res = await reviewService.getMyReview();
      setMyReview(res.data);
    } catch {
      // silently ignore
    }
  }, [user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchMyReview();
  }, [fetchMyReview]);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || reviews.length <= cardsPerView.current) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const max = Math.max(0, reviews.length - cardsPerView.current);
        return prev >= max ? 0 : prev + 1;
      });
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, reviews.length]);

  const maxIndex = Math.max(0, reviews.length - cardsPerView.current);

  const goNext = () => {
    setAutoPlay(false);
    setCurrentIndex((p) => Math.min(p + 1, maxIndex));
  };

  const goPrev = () => {
    setAutoPlay(false);
    setCurrentIndex((p) => Math.max(p - 1, 0));
  };

  const handleWriteReview = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setEditingReview(myReview || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete your review?")) return;
    try {
      await reviewService.delete(id);
      toast({ title: "Review deleted", description: "Your review has been removed." });
      setMyReview(null);
      fetchReviews();
    } catch {
      toast({ title: "Error", description: "Failed to delete review.", variant: "destructive" });
    }
  };

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    pct: reviews.length > 0
      ? (reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <>
      {/* Form Modal */}
      {showForm && (
        <ReviewFormModal
          onClose={() => { setShowForm(false); setEditingReview(null); }}
          onSuccess={() => { fetchReviews(); fetchMyReview(); }}
          existingReview={editingReview}
        />
      )}

      <section
        id="reviews"
        className="relative py-24 md:py-32 bg-background overflow-hidden"
      >
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        </div>

        {/* Top fade from previous section */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-secondary/30 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">

            {/* ── Section Header ── */}
            <div className="text-center mb-16 space-y-4 animate-fade-in-up">
              <h2 className="fairy-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold break-normal text-foreground">
                Client <span className="gradient-text">Reviews</span>
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto break-normal">
                Real experiences from our valued clients
              </p>
            </div>

            {/* ── Stats Row ── */}
            {!loading && totalReviews > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-center">
                {/* Big Rating */}
                <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
                  <div className="text-5xl sm:text-7xl font-black text-foreground leading-none mb-2">
                    {avgRating.toFixed(1)}
                  </div>
                  <StarDisplay rating={avgRating} size={20} />
                  <p className="text-muted-foreground text-sm mt-2">
                    Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Breakdown bars */}
                <div className="lg:col-span-2 space-y-2">
                  {ratingBreakdown.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-4 text-right">{star}</span>
                      <Star size={12} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Write Review Button ── */}
            <div className="flex flex-col items-center gap-3 mb-12">
              <Button
                id="write-review-btn"
                onClick={handleWriteReview}
                className="bg-accent hover:bg-accent/90 shadow-gold px-8 py-3 text-base font-semibold gap-2 group"
              >
                {myReview ? (
                  <>
                    <Edit2 size={18} className="group-hover:rotate-12 transition-transform" />
                    Edit Your Review
                  </>
                ) : (
                  <>
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    Write a Review
                  </>
                )}
              </Button>
              {!user && (
                <p className="text-sm text-muted-foreground">
                  <span
                    className="text-accent underline underline-offset-2 cursor-pointer hover:text-accent/80 transition-colors"
                    onClick={() => navigate("/login")}
                  >
                    Log in
                  </span>{" "}
                  to share your experience
                </p>
              )}
            </div>

            {/* ── Loading ── */}
            {loading && (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
              </div>
            )}

            {/* ── Empty State ── */}
            {!loading && reviews.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                  <Star size={36} className="text-accent/60" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">
                  Be the first to share your experience with RajKayal Creative Hub!
                </p>
              </div>
            )}

            {/* ── Carousel ── */}
            {!loading && reviews.length > 0 && (
              <div className="relative">
                {/* Nav buttons */}
                {reviews.length > cardsPerView.current && (
                  <>
                    <button
                      id="review-prev-btn"
                      onClick={goPrev}
                      disabled={currentIndex === 0}
                      className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center bg-card border border-border shadow-lg hover:border-accent/50 hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                      aria-label="Previous reviews"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      id="review-next-btn"
                      onClick={goNext}
                      disabled={currentIndex >= maxIndex}
                      className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center bg-card border border-border shadow-lg hover:border-accent/50 hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                      aria-label="Next reviews"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Cards viewport */}
                <div className="overflow-hidden">
                  <div
                    className="flex gap-6 transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(calc(-${currentIndex} * (100% / ${cardsPerView.current} + 24px / ${cardsPerView.current})))`,
                    }}
                  >
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="flex-shrink-0"
                        style={{ width: `calc((100% - ${(cardsPerView.current - 1) * 24}px) / ${cardsPerView.current})` }}
                      >
                        <ReviewCard
                          review={review}
                          isOwn={!!user && myReview?._id === review._id}
                          onEdit={() => { setEditingReview(review); setShowForm(true); }}
                          onDelete={() => handleDelete(review._id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots */}
                {reviews.length > cardsPerView.current && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setAutoPlay(false); setCurrentIndex(i); }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentIndex
                            ? "w-6 bg-accent"
                            : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                        aria-label={`Go to review group ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsSection;
