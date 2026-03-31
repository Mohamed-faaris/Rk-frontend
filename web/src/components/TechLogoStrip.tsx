import {
  SiAdobephotoshop,
  SiCanva,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import LogoLoop from "@/components/LogoLoop";

const techLogos = [
  {
    node: <SiReact className="h-[1em] w-[1em]" />,
    title: "React",
    href: "https://react.dev",
  },
  {
    node: <SiNextdotjs className="h-[1em] w-[1em]" />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiTypescript className="h-[1em] w-[1em]" />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss className="h-[1em] w-[1em]" />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  {
    node: <SiAdobephotoshop className="h-[1em] w-[1em]" />,
    title: "Adobe Photoshop",
    href: "https://www.adobe.com/products/photoshop.html",
  },
  {
    node: <SiCanva className="h-[1em] w-[1em]" />,
    title: "Canva",
    href: "https://www.canva.com",
  },
];

const TechLogoStrip = () => {
  return (
    <section className="relative py-8 md:py-10" aria-label="Technology strip">
      <div
        className="w-full h-[96px] md:h-[108px] relative overflow-hidden"
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
    </section>
  );
};

export default TechLogoStrip;