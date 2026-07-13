import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { contactService } from "@/lib/contactService";
import { logger } from "@/lib/logger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "consultation",
    subject: "",
    message: "",
  });

  // Check URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type === 'consultation' || type === 'collaboration') {
      setFormData(prev => ({ ...prev, inquiryType: type }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to send a message.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await contactService.sendMessage({
        name: formData.name,
        email: formData.email,
        inquiryType: formData.inquiryType as 'consultation' | 'collaboration' | 'quote' | 'support' | 'other',
        subject: formData.subject,
        message: formData.message,
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({ 
        name: "", 
        email: "", 
        inquiryType: "consultation", 
        subject: "", 
        message: "" 
      });
    } catch (error: any) {
      logger.error('Contact form error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "rajkayal7281@gmail.com",
      href: "mailto:rajkayal7281@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8754616454",
      href: "tel:+91 8754616454",
    },
    {
      icon: MapPin,
      label: "Trichy, Tamil Nadu, India",
      value: "Trichy, Tamil Nadu, India",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="fairy-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold break-normal">
              Get in <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto break-normal">
              Ready to start your next project? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="bg-background border-border focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="bg-background border-border focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="inquiryType" className="text-sm font-medium text-foreground">
                    Inquiry Type *
                  </label>
                  <Select
                    value={formData.inquiryType}
                    onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
                  >
                    <SelectTrigger className="bg-background border-border focus:border-accent">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Free Consultation</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="quote">Request Quote</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="bg-background border-border focus:border-accent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    required
                    rows={6}
                    className="bg-background border-border focus:border-accent resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent/90 shadow-gold group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground break-normal">
                  Contact Information
                </h3>
                <p className="text-muted-foreground leading-relaxed break-normal">
                  We're here to answer any questions you may have about our services. 
                  Reach out to us and we'll respond as soon as we can.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-accent/50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
                      <info.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-muted-foreground mb-1 break-normal">
                        {info.label}
                      </div>
                      <div className="text-foreground font-medium break-normal">
                        {info.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Office Hours */}
              <div className="p-4 sm:p-6 rounded-lg bg-card border border-border">
                <h4 className="text-lg font-bold text-foreground mb-4 break-normal">
                  Office Hours
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="text-foreground font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-foreground font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-foreground font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

