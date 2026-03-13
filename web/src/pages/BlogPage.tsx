import { useState } from "react";
import { Calendar, Clock, ArrowRight, Search, Tag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GradientBlinds from "@/components/GradientBlinds.tsx";
import Footer from "@/components/Footer";
import LandscapeHoverCard from "@/components/LandscapeHoverCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BlogPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "Landing Pages That Convert Faster",
      excerpt: "A practical breakdown of structure, copy hierarchy, and visual flow that improves conversion in under 5 seconds.",
      category: "Web Design",
      author: "RajKayal Team",
      date: "2024-11-15",
      readTime: "5 min read",
      image: "/blog/The Future of Web Design Trends to Watch in 2024.png",
      tags: ["Design", "Trends", "Web Development"]
    },
    {
      id: 2,
      title: "Storyboard to Motion in 7 Steps",
      excerpt: "How our team converts rough ideas into polished motion content for ads, reels, and product demos.",
      category: "3D Animation",
      author: "RajKayal Team",
      date: "2024-11-10",
      readTime: "8 min read",
      image: "/blog/Creating Stunning 3D Animations A Beginner's.png",
      tags: ["3D", "Animation", "Tutorial"]
    },
    {
      id: 3,
      title: "Brand Identity That Feels Premium",
      excerpt: "Positioning, visual tone, and consistency rules that make small brands look enterprise-ready.",
      category: "Branding",
      author: "RajKayal Team",
      date: "2024-11-05",
      readTime: "6 min read",
      image: "/blog/Building a Strong Brand Identity Essential Steps.png",
      tags: ["Branding", "Identity", "Marketing"]
    },
    {
      id: 4,
      title: "Mobile UX Audits That Cut Drop-Off",
      excerpt: "A concise checklist we use to remove friction from onboarding, checkout, and key task flows.",
      category: "UI/UX",
      author: "RajKayal Team",
      date: "2024-10-28",
      readTime: "7 min read",
      image: "/blog/UIUX Best Practices for Mobile Applications.png",
      tags: ["UI/UX", "Mobile", "Design"]
    },
    {
      id: 5,
      title: "Visual Hooks for Better Ad Recall",
      excerpt: "Creative direction patterns that make campaign visuals memorable across social and performance channels.",
      category: "Marketing",
      author: "RajKayal Team",
      date: "2024-10-20",
      readTime: "5 min read",
      image: "/blog/The Power of Visual Storytelling in Digital.png",
      tags: ["Marketing", "Storytelling", "Content"]
    },
    {
      id: 6,
      title: "Responsive Layouts Without Guesswork",
      excerpt: "A framework for scaling typography, spacing, and media so interfaces stay clean on every viewport.",
      category: "Web Design",
      author: "RajKayal Team",
      date: "2024-10-15",
      readTime: "6 min read",
      image: "/blog/Responsive Design Making Your Website Work.png",
      tags: ["Responsive", "Web Design", "Development"]
    }
  ];

  const categories = ["all", "Web Design", "3D Animation", "Branding", "UI/UX", "Marketing"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GradientBlinds gradientColors={['#C6A345', '#8B7520', '#D4AF6A']} />

      {/* Hero Section */}
      <section className="pt-20 md:pt-24 lg:pt-32 pb-12 md:pb-16 px-4 bg-gradient-to-b from-secondary/30 to-background relative z-10">
        <div className="container mx-auto max-w-6xl">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-6 md:mb-8 gap-2 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="text-center">
            <Badge className="mb-3 md:mb-4 bg-accent shadow-gold text-xs md:text-sm py-1 md:py-1.5">
              Insights & Resources
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 break-normal">
              Our <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto break-normal">
              Stay updated with the latest insights, trends, and best practices in digital design and development.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6 md:py-8 px-4 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border focus:border-accent text-xs md:text-sm h-8 md:h-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${selectedCategory === category 
                    ? "bg-accent hover:bg-accent/90" 
                    : "border-border hover:border-accent hover:text-accent"} text-xs md:text-sm py-1 md:py-2 px-2 md:px-3 h-8 md:h-10`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <div key={post.id} className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <LandscapeHoverCard
                    image={post.image}
                    title={post.title}
                    description={`${post.category} • ${post.excerpt}`}
                    ctaLabel="Read Insight"
                    href="/contact"
                    className={index % 2 === 0 ? "" : "lg:translate-y-2"}
                  />
                  <div className="flex flex-wrap gap-2 px-1">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <div key={tagIndex} className="flex items-center gap-1 text-xs text-accent">
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 break-normal">
            Want to Stay <span className="gradient-text">Updated</span>?
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 break-normal">
            Subscribe to our newsletter for the latest insights and exclusive content delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-background border-border focus:border-accent text-xs md:text-sm h-8 md:h-10"
            />
            <Button className="bg-accent hover:bg-accent/90 shadow-gold text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
