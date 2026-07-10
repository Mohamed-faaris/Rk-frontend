import { extractGoogleDriveFileId, getGoogleDriveThumbnailUrl } from '@/lib/updatesNewsService';

type GoogleDrivePreviewProps = {
  src: string;
  title: string;
  className?: string;
};

const getBackgroundClassName = (className: string) => {
  return className.includes('aspect-') ? className : `${className} aspect-[16/10]`;
};

const GoogleDrivePreview = ({ src, title, className = '' }: GoogleDrivePreviewProps) => {
  const fileId = extractGoogleDriveFileId(src);
  const backgroundSrc = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600` : getGoogleDriveThumbnailUrl(src);
  const foregroundSrc = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600` : src;

  return (
    <div className={`relative isolate overflow-hidden bg-black/50 ${getBackgroundClassName(className)}`}>
      <div
        className="absolute inset-0 scale-125 bg-cover bg-center blur-3xl opacity-55"
        style={{ backgroundImage: `url('${backgroundSrc}')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-5 md:p-6">
        <img
          src={foregroundSrc}
          alt={title}
          className="relative z-10 max-h-full max-w-full object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default GoogleDrivePreview;