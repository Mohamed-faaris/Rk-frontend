import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Code2, FileText, Info, Palette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import sivasuriyanRajaImage from "@/assets/SivasuriyanRaja.png";
import mohamedAbuBakkarImage from "@/assets/MOHAMED ABU BAKKAR M .webp";
import mohamedFaarisImage from "@/assets/MOHAMED FAARIS K M.webp";
import namasivayenImage from "@/assets/NAMASIVAYEN N S.webp";
import nithishKumarImage from "@/assets/NITHISH KUMAR V.webp";
import pallaviImage from "@/assets/PALLAVI_OLD.jpg";
import vivehaImage from "@/assets/VIVEHA V.png";
import viswaGuruPrasathImage from "@/assets/VISWA GURU PRASATH J .webp";
import yogeshImage from "@/assets/YOGESH M.webp";
import "@/styles/team-cards.scss";
import ProfileCard from "./ProfileCard";

const OurTeam = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const teamMembers = [
    {
      id: "sivasuriyan-raja",
      name: "Mr SIVASURIYAN RAJA",
      role: "Founder & Creative Director",
      bio: "Leads RajKayal Creative Hub with a focus on brand storytelling, premium visual systems, and long-term client direction.",
      skills: ["Brand Strategy", "Creative Direction", "Client Consulting"],
      icon: Briefcase,
      image: sivasuriyanRajaImage,
      imagePosition: "center 18%",
      fullName: "Mr SIVASURIYAN RAJA",
      title: "Founder, Creative Director",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "mohamed-abu-bakkar",
      name: "Mr MOHAMED ABU BAKKAR M",
      role: "CEO",
      bio: "Leads company vision, strategic growth, and high-level decision making across all teams.",
      skills: ["Leadership", "Business Strategy", "Client Relations"],
      icon: Briefcase,
      image: mohamedAbuBakkarImage,
      imagePosition: "center 18%",
      fullName: "Mr MOHAMED ABU BAKKAR M",
      title: "Chief Executive Officer",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "mohamed-faaris",
      name: "Mr MOHAMED FAARIS K M",
      role: "CTO",
      bio: "Owns engineering execution, architecture quality, and reliable delivery across frontend and backend systems.",
      skills: ["Engineering Management", "Architecture", "Team Delivery"],
      icon: Code2,
      image: mohamedFaarisImage,
      imagePosition: "center 18%",
      fullName: "Mr MOHAMED FAARIS K M",
      title: "Chief Technology Officer",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "namasivayen",
      name: "Mr NAMASIVAYEN N S",
      role: "HR & Admin Executive",
      bio: "Manages hiring coordination, people operations, and day-to-day administrative support.",
      skills: ["People Operations", "Recruitment Support", "Administration"],
      icon: Briefcase,
      image: namasivayenImage,
      imagePosition: "center 18%",
      fullName: "Mr NAMASIVAYEN N S",
      title: "HR & Admin Executive",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "nithish-kumar",
      name: "Mr NITHISH KUMAR V",
      role: "Sales Manager",
      bio: "Leads sales pipeline, proposal discussions, and customer conversion initiatives.",
      skills: ["Sales Strategy", "Negotiation", "Client Conversion"],
      icon: Briefcase,
      image: nithishKumarImage,
      imagePosition: "center 18%",
      fullName: "Mr NITHISH KUMAR V",
      title: "Sales Manager",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "pallavi",
      name: "Ms PALLAVI P",
      role: "Project Manager",
      bio: "Coordinates planning, timelines, and cross-functional delivery to keep projects on track.",
      skills: [
        "Project Planning",
        "Execution Tracking",
        "Stakeholder Coordination",
      ],
      icon: Palette,
      image: pallaviImage,
      imagePosition: "center 0%",
      imageScale: 1,
      fullName: "Ms PALLAVI P",
      title: "Project Manager",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "viveha",
      name: "Ms VIVEHA V",
      role: "Designing Head",
      bio: "Leads visual design direction and ensures every brand touchpoint stays consistent and impactful.",
      skills: ["Design Leadership", "Visual Direction", "Brand Consistency"],
      icon: Palette,
      image: vivehaImage,
      imagePosition: "center 18%",
      fullName: "Ms VIVEHA V",
      title: "Designing Head",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "viswa-guru-prasath",
      name: "Mr VISWA GURU PRASATH J",
      role: "Finance & Business Analyst",
      bio: "Handles financial analysis, reporting, and data-backed business decisions.",
      skills: ["Financial Analysis", "Business Reporting", "Forecasting"],
      icon: Briefcase,
      image: viswaGuruPrasathImage,
      imagePosition: "center 0%",
      imageScale: 1,
      fullName: "Mr VISWA GURU PRASATH J",
      title: "Finance & Business Analyst",
      location: "Tamil Nadu, India",
      socials: [],
    },
    {
      id: "yogesh",
      name: "Mr YOGESH M",
      role: "Marketing Manager",
      bio: "Drives brand growth through campaigns, positioning, and audience engagement.",
      skills: ["Campaign Strategy", "Brand Marketing", "Growth"],
      icon: Palette,
      image: yogeshImage,
      imagePosition: "center 12%",
      imageScale: 1.12,
      fullName: "Mr YOGESH M",
      title: "Marketing Manager",
      location: "Tamil Nadu, India",
      socials: [],
    },
  ];

  return (
    <section
      id="testimonials"
      className="team-cards relative shadow-sm dark:bg-background"
    >
      {/* Smooth fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      {/* ── Centred wrapper ── */}
      <div className="team-section-inner">
        {/* Section Header */}
        <div className="team-section-header">
          <h2 className="fairy-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold break-normal text-foreground">
            Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground">
            Meet the people leading RajKayal Creative Hub across leadership,
            engineering, operations, and growth.
          </p>
        </div>

        {/* ── Card grid container ── */}
        <div className="team-grid">
          {teamMembers.map((member) => (
            <ProfileCard
              key={member.id}
              name={member.name}
              title={member.role}
              handle={member.id}
              status={member.location}
              contactText="View Profile"
              avatarUrl={member.image || ""}
              miniAvatarUrl={member.image || ""}
              imagePosition={member.imagePosition}
              imageScale={member.imageScale}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => navigate("/apply-employee")}
              behindGlowEnabled={true}
              innerGradient="linear-gradient(145deg,#1c1913 0%,#2c2411 100%)"
              behindGlowColor="rgba(215, 175, 80, 0.5)"
              className="w-full"
            />
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="join-btn">
          <Button
            onClick={() => navigate("/apply-employee")}
            className="bg-accent hover:bg-accent/90 shadow-gold px-8 py-3 text-base font-semibold"
          >
            <FileText className="w-4 h-4 mr-2" />
            Apply to Join RKCH Team
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
