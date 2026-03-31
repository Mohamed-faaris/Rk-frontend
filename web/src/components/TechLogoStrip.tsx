import { Code2, Figma, Globe, MonitorCog, Palette, Rocket } from "lucide-react";
import LogoLoop from "@/components/LogoLoop";

const techLogos = [
  {
    node: <Code2 className="h-[1em] w-[1em]" />,
    title: "Web Development",
    href: "#services",
  },
  {
    node: <MonitorCog className="h-[1em] w-[1em]" />,
    title: "UI and UX",
    href: "#services",
  },
  {
    node: <Palette className="h-[1em] w-[1em]" />,
    title: "Branding",
    href: "#services",
  },
  {
    node: <Figma className="h-[1em] w-[1em]" />,
    title: "Design Systems",
    href: "#services",
  },
  {
    node: <Globe className="h-[1em] w-[1em]" />,
    title: "SEO and Visibility",
    href: "#services",
  },
  {
    node: <Rocket className="h-[1em] w-[1em]" />,
    title: "Growth Launch",
    href: "#contact",
  },
];

const TechLogoStrip = () => {
  return (
    <section className="relative py-8 md:py-10 bg-secondary/20" aria-label="Technology strip">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-accent/20 bg-background/70 backdrop-blur-sm">
          <div
            className="h-[96px] md:h-[108px] relative overflow-hidden"
            style={{
              color: "hsl(var(--gold))",
              textShadow: "0 0 18px hsla(45, 70%, 52%, 0.28)",
            }}
          >
            <LogoLoop
              logos={techLogos}
              speed={95}
              direction="left"
              logoHeight={44}
              gap={64}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="hsl(var(--background))"
              ariaLabel="Technology partners"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechLogoStrip;