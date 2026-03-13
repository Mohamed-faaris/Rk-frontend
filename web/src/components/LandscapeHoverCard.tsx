import { Link } from "react-router-dom";

type LandscapeHoverCardProps = {
  image: string;
  title: string;
  description: string;
  ctaLabel: string;
  href?: string;
  className?: string;
};

const LandscapeHoverCard = ({
  image,
  title,
  description,
  ctaLabel,
  href,
  className = "",
}: LandscapeHoverCardProps) => {
  const cardBody = (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-gold ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-10 bg-gradient-to-t from-black/85 via-black/70 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="mb-1 block text-xs font-medium tracking-wide text-amber-200 break-normal">{description}</span>
        <h3 className="text-2xl font-bold text-white break-normal">{title}</h3>
        <span className="mt-2 inline-block text-sm font-semibold text-amber-300">{ctaLabel}</span>
      </div>
    </article>
  );

  if (!href) return cardBody;

  const isInternal = href.startsWith("/");

  if (isInternal) {
    return <Link to={href}>{cardBody}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {cardBody}
    </a>
  );
};

export default LandscapeHoverCard;
