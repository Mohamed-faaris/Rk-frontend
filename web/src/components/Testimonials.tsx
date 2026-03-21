import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Code2, FileText, Info, Palette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import sivasuriyanRajaImage from "@/assets/SivasuriyanRaja.png";
import mohamedAbuBakkarImage from "@/assets/MOHAMED ABU BAKKAR M .png";
import mohamedFaarisImage from "@/assets/MOHAMED FAARIS K M.png";
import namasivayenImage from "@/assets/NAMASIVAYEN N S.png";
import nithishKumarImage from "@/assets/NITHISH KUMAR V.png";
import pallaviImage from "@/assets/PALLAVI P.png";
import viswaGuruPrasathImage from "@/assets/VISWA GURU PRASATH J .png";
import yogeshImage from "@/assets/YOGESH M.png";
import "@/styles/team-cards.scss";

const Testimonials = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const teamMembers = [
    {
      id: "sivasuriyan-raja",
      name: "SIVASURIYAN RAJA",
      role: "Founder & Creative Director",
      bio: "Leads RajKayal Creative Hub with a focus on brand storytelling, premium visual systems, and long-term client direction.",
      skills: ["Brand Strategy", "Creative Direction", "Client Consulting"],
      icon: Briefcase,
      image: sivasuriyanRajaImage,
      imagePosition: "center 18%",
      fullName: "Sivasuriyan Raja",
      title: "Founder, Creative Director",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "mohamed-abu-bakkar",
      name: "MOHAMED ABU BAKKAR M",
      role: "CEO",
      bio: "Leads company vision, strategic growth, and high-level decision making across all teams.",
      skills: ["Leadership", "Business Strategy", "Client Relations"],
      icon: Briefcase,
      image: mohamedAbuBakkarImage,
      imagePosition: "center 18%",
      fullName: "MOHAMED ABU BAKKAR M",
      title: "Chief Executive Officer",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "mohamed-faaris",
      name: "MOHAMED FAARIS K M",
      role: "CTO",
      bio: "Owns engineering execution, architecture quality, and reliable delivery across frontend and backend systems.",
      skills: ["Engineering Management", "Architecture", "Team Delivery"],
      icon: Code2,
      image: mohamedFaarisImage,
      imagePosition: "center 18%",
      fullName: "MOHAMED FAARIS K M",
      title: "Chief Technology Officer",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "namasivayen",
      name: "NAMASIVAYEN N S",
      role: "HR & Admin Executive",
      bio: "Manages hiring coordination, people operations, and day-to-day administrative support.",
      skills: ["People Operations", "Recruitment Support", "Administration"],
      icon: Briefcase,
      image: namasivayenImage,
      imagePosition: "center 18%",
      fullName: "NAMASIVAYEN N S",
      title: "HR & Admin Executive",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "nithish-kumar",
      name: "NITHISH KUMAR V",
      role: "Sales Manager",
      bio: "Leads sales pipeline, proposal discussions, and customer conversion initiatives.",
      skills: ["Sales Strategy", "Negotiation", "Client Conversion"],
      icon: Briefcase,
      image: nithishKumarImage,
      imagePosition: "center 18%",
      fullName: "NITHISH KUMAR V",
      title: "Sales Manager",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "pallavi",
      name: "PALLAVI P",
      role: "Project Manager",
      bio: "Coordinates planning, timelines, and cross-functional delivery to keep projects on track.",
      skills: [
        "Project Planning",
        "Execution Tracking",
        "Stakeholder Coordination",
      ],
      icon: Palette,
      image: pallaviImage,
      imagePosition: "center 18%",
      fullName: "PALLAVI P",
      title: "Project Manager",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "viswa-guru-prasath",
      name: "VISWA GURU PRASATH J",
      role: "Finance & Business Analyst",
      bio: "Handles financial analysis, reporting, and data-backed business decisions.",
      skills: ["Financial Analysis", "Business Reporting", "Forecasting"],
      icon: Briefcase,
      image: viswaGuruPrasathImage,
      imagePosition: "center 12%",
      imageScale: 1.12,
      fullName: "VISWA GURU PRASATH J",
      title: "Finance & Business Analyst",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "yogesh",
      name: "YOGESH M",
      role: "Marketing Manager",
      bio: "Drives brand growth through campaigns, positioning, and audience engagement.",
      skills: ["Campaign Strategy", "Brand Marketing", "Growth"],
      icon: Palette,
      image: yogeshImage,
      imagePosition: "center 12%",
      imageScale: 1.12,
      fullName: "YOGESH M",
      title: "Marketing Manager",
      location: "Tamil Nadu, India",
      socials: [],
    },
  ];

  return (
    <section
      id="testimonials"
      className="team-cards relative bg-secondary/30 py-24 shadow-sm dark:bg-background md:py-32"
    >
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      <div className="container mx-auto relative z-10 px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="animate-fade-in-up mb-16 space-y-4 text-center">
            <h2 className="fairy-display text-4xl md:text-5xl lg:text-6xl font-bold break-normal text-foreground">
              Our <span className="gradient-text">Team</span>
            </h2>
            <p className="mx-auto max-w-2xl break-normal text-xl text-muted-foreground">
              Meet the people leading RajKayal Creative Hub across leadership,
              engineering, operations, and growth.
            </p>
          </div>

          <div className="team-card-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="card">
                <div className="card__border">
                  <div className="card__perfil">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="card__img"
                        loading="lazy"
                        decoding="async"
                        style={{
                          objectPosition: member.imagePosition,
                          transform: member.imageScale
                            ? `scale(${member.imageScale})`
                            : undefined,
                        }}
                      />
                    ) : (
                      <member.icon className="card__img" aria-hidden="true" />
                    )}
                  </div>
                </div>

                <h3 className="card__name" title={member.name}>
                  {member.name}
                </h3>
                <span className="card__profession break-normal">
                  {member.role}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setActiveCard((current) =>
                      current === member.id ? null : member.id,
                    )
                  }
                  className="card__info-toggle"
                  aria-expanded={activeCard === member.id}
                  aria-controls={`${member.id}-info`}
                  aria-label={`${activeCard === member.id ? "Hide" : "Show"} more information for ${member.name}`}
                >
                  {activeCard === member.id ? (
                    <X size={18} />
                  ) : (
                    <Info size={18} />
                  )}
                </button>

                <div
                  id={`${member.id}-info`}
                  className={`info ${activeCard === member.id ? "is-open" : ""}`}
                >
                  <div className="info__border">
                    <div className="info__perfil">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={`${member.name} profile`}
                          className="info__img"
                          loading="lazy"
                          decoding="async"
                          style={{
                            objectPosition: member.imagePosition,
                            transform: member.imageScale
                              ? `scale(${member.imageScale})`
                              : undefined,
                          }}
                        />
                      ) : (
                        <member.icon className="info__img" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  <div className="info__data">
                    <h4 className="info__name" title={member.fullName}>
                      {member.fullName}
                    </h4>
                    <p className="info__profession break-normal">
                      {member.title}
                    </p>
                    <p className="info__location break-normal">
                      {member.location}
                    </p>
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

          {/* Join Team CTA */}
          <div className="mt-14 text-center">
            <Button
              onClick={() => navigate("/apply-employee")}
              className="bg-accent hover:bg-accent/90 shadow-gold px-8 py-3 text-base font-semibold"
            >
              <FileText className="w-4 h-4 mr-2" />
              Apply to Join RKCH Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
