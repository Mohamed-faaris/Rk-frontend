import { useState } from "react";
import { Briefcase, Code2, Github, Info, Instagram, Linkedin, Palette, X } from "lucide-react";
import sivasuriyanRajaImage from "@/assets/SivasuriyanRaja.png";
import "@/styles/team-cards.scss";

const Testimonials = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const teamMembers = [
    {
      id: "sivasuriyan-raja",
      name: "Sivasuriyan Raja",
      role: "Founder & Creative Director",
      bio: "Leads RajKayal Creative Hub with a focus on brand storytelling, premium visual systems, and long-term client direction.",
      skills: ["Brand Strategy", "Creative Direction", "Client Consulting"],
      icon: Briefcase,
      image: sivasuriyanRajaImage,
      fullName: "Sivasuriyan Raja",
      title: "Founder, Creative Director",
      location: "Tamil Nadu, India",
      socials: [
        { href: "https://www.linkedin.com/in/sivasuriyan-raja-86b044312", label: "LinkedIn", icon: Linkedin },
        {
          href: "https://www.instagram.com/sivasuriyan_raja?igsh=MTgzZHhncGp6ZXc1dw%3D%3D&utm_source=qr",
          label: "Instagram",
          icon: Instagram,
        },
        { href: "https://github.com/SivasuriyanRaja", label: "GitHub", icon: Github },
      ],
    },
    {
      id: "design-team",
      name: "Design Team",
      role: "Visual Design & UI/UX",
      bio: "Crafts polished interfaces, print assets, and marketing visuals that balance clarity, elegance, and conversion-focused thinking.",
      skills: ["UI/UX Design", "Social Media Design", "Print & Branding"],
      icon: Palette,
      fullName: "RajKayal Design Team",
      title: "UI/UX, Branding & Visual Communication",
      location: "Remote / India",
      socials: [
        { href: "https://www.linkedin.com/in/sivasuriyan-raja-86b044312", label: "LinkedIn", icon: Linkedin },
      ],
    },
    {
      id: "development-team",
      name: "Development Team",
      role: "Web & Software Engineering",
      bio: "Builds responsive websites, scalable applications, and dependable digital systems that support business growth and operations.",
      skills: ["React Development", "Backend Systems", "Deployment & Support"],
      icon: Code2,
      fullName: "RajKayal Development Team",
      title: "Frontend, Backend & Deployment Systems",
      location: "Remote / India",
      socials: [
        { href: "https://github.com/SivasuriyanRaja", label: "GitHub", icon: Github },
      ],
    },
  ];

  return (
    <section id="testimonials" className="team-cards relative bg-secondary/30 py-24 shadow-sm dark:bg-background md:py-32">
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      <div className="container mx-auto relative z-10 px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="animate-fade-in-up mb-16 space-y-4 text-center">
            <h2 className="fairy-display break-normal text-4xl font-bold md:text-5xl lg:text-6xl">
              Our <span className="gradient-text">Team</span>
            </h2>
            <p className="mx-auto max-w-2xl break-normal text-xl text-muted-foreground">
              Meet the people shaping RajKayal Creative Hub across strategy, design, and development.
            </p>
          </div>

          <div className="team-card-grid">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="card"
                style={{
                  ["--glow-delay" as string]: `${index * 0.65}s`,
                  ["--glow-delay-secondary" as string]: `${index * 0.65 + 1.1}s`,
                }}
              >
                <div className="card__glow" aria-hidden="true">
                  <span className="card__glow-orb card__glow-orb--primary" />
                  <span className="card__glow-orb card__glow-orb--secondary" />
                </div>

                <div className="card__border">
                  <div className="card__perfil">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="card__img" />
                    ) : (
                      <member.icon className="card__img" aria-hidden="true" />
                    )}
                  </div>
                </div>

                <h3 className="card__name break-normal">{member.name}</h3>
                <span className="card__profession break-normal">{member.role}</span>

                <div id={`${member.id}-info`} className={`info ${activeCard === member.id ? "is-open" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setActiveCard((current) => (current === member.id ? null : member.id))}
                    className="info__icon"
                    aria-expanded={activeCard === member.id}
                    aria-controls={`${member.id}-info`}
                    aria-label={`${activeCard === member.id ? "Hide" : "Show"} more information for ${member.name}`}
                  >
                    {activeCard === member.id ? <X size={18} /> : <Info size={18} />}
                  </button>

                  <div className="info__border">
                    <div className="info__perfil">
                      {member.image ? (
                        <img src={member.image} alt={`${member.name} profile`} className="info__img" />
                      ) : (
                        <member.icon className="info__img" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  <div className="info__data">
                    <h4 className="info__name break-normal">{member.fullName}</h4>
                    <p className="info__profession break-normal">{member.title}</p>
                    <p className="info__location break-normal">{member.location}</p>
                    <p className="info__bio break-normal">{member.bio}</p>
                  </div>

                  <div className="info__skills">
                    {member.skills.map((skill) => (
                      <span key={skill} className="info__skill break-normal">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="info__social">
                    {member.socials.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="info__social-link"
                          aria-label={`${member.name} ${social.label}`}
                        >
                          <span className="info__social-icon">
                            <Icon size={14} />
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
