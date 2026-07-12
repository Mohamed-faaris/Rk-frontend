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
    <div className={`relative isolate overflow-hidden bg-[#111111] ${getBackgroundClassName(className)}`}>
      <div
        className="absolute inset-0 scale-[1.9] bg-cover bg-center blur-[80px] opacity-100 saturate-150 brightness-95"
        style={{ backgroundImage: `url('${backgroundSrc}')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 md:p-5">
        <img
          src={foregroundSrc}
          alt={title}
          className="relative z-10 max-h-[88%] max-w-[88%] object-contain rounded-xl shadow-2xl ring-1 ring-white/10 bg-transparent"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default GoogleDrivePreview;