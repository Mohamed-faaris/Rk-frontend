type GoogleDrivePreviewProps = {
  src: string;
  title: string;
  className?: string;
};

const GoogleDrivePreview = ({ src, title, className = '' }: GoogleDrivePreviewProps) => {
  return (
    <div className={`relative isolate overflow-hidden bg-black/40 ${className}`}>
      <iframe
        src={src}
        title={`${title} background preview`}
        className="absolute inset-0 h-full w-full scale-110 blur-2xl opacity-50 pointer-events-none"
        loading="lazy"
        aria-hidden="true"
        tabIndex={-1}
        allow="autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/25 pointer-events-none" />
      <iframe
        src={src}
        title={title}
        className="relative z-10 h-full w-full border-0"
        loading="lazy"
        allow="autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default GoogleDrivePreview;