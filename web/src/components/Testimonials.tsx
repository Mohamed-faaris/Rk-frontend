import { Briefcase, Code2, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const teamMembers = [
    {
      name: "Sivasuriyan Raja",
      role: "Founder & Creative Director",
      bio: "Leads RajKayal Creative Hub with a focus on brand storytelling, premium visual systems, and long-term client direction.",
      skills: ["Brand Strategy", "Creative Direction", "Client Consulting"],
      icon: Briefcase,
    },
    {
      name: "Design Team",
      role: "Visual Design & UI/UX",
      bio: "Crafts polished interfaces, print assets, and marketing visuals that balance clarity, elegance, and conversion-focused thinking.",
      skills: ["UI/UX Design", "Social Media Design", "Print & Branding"],
      icon: Palette,
    },
    {
      name: "Development Team",
      role: "Web & Software Engineering",
      bio: "Builds responsive websites, scalable applications, and dependable digital systems that support business growth and operations.",
      skills: ["React Development", "Backend Systems", "Deployment & Support"],
      icon: Code2,
    },
  ];

  return (
    <section id="testimonials" className="relative py-24 md:py-32 bg-secondary/30 dark:bg-background shadow-sm">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="fairy-display text-4xl md:text-5xl lg:text-6xl font-bold break-normal">
              Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto break-normal">
              Meet the people shaping RajKayal Creative Hub across strategy, design, and development.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.name} className="border-border hover:border-accent/50 transition-all duration-300 shadow-elevated bg-card/95 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <member.icon className="h-7 w-7" />
                    </div>
                    <div className="rounded-full border border-accent/20 px-3 py-1 text-xs font-medium text-accent">
                      Team Profile
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground break-normal">{member.name}</h3>
                    <p className="text-sm font-medium text-accent break-normal">{member.role}</p>
                  </div>

                  <p className="mt-5 text-muted-foreground leading-relaxed break-normal">
                    {member.bio}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
