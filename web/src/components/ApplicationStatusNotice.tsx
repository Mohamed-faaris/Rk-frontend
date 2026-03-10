import { useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Award, Sparkles, HeartHandshake } from 'lucide-react';

type ApplicationStatus = 'accepted' | 'rejected' | null;

interface ApplicationStatusNoticeProps {
  status: ApplicationStatus;
}

const ApplicationStatusNotice = ({ status }: ApplicationStatusNoticeProps) => {
  const content = useMemo(() => {
    if (status === 'accepted') {
      return {
        title: 'Application Accepted',
        message:
          'Congratulations! Your talent and effort paid off. Keep this momentum and get ready for an amazing new chapter.',
        icon: Award,
        className: 'border-emerald-500/40 bg-emerald-900/20 text-emerald-100',
        titleClass: 'text-emerald-200'
      };
    }

    if (status === 'rejected') {
      return {
        title: 'Application Update',
        message:
          'This role was not a match right now, but your journey is still powerful. Keep building, keep learning, and apply again with confidence.',
        icon: HeartHandshake,
        className: 'border-amber-500/40 bg-amber-900/20 text-amber-100',
        titleClass: 'text-amber-200'
      };
    }

    return null;
  }, [status]);

  if (!content) {
    return null;
  }

  const Icon = content.icon;

  return (
    <Alert className={`mb-6 ${content.className}`}>
      <Icon className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`font-semibold ${content.titleClass}`}>{content.title}</p>
            <p className="mt-1 text-sm leading-relaxed">{content.message}</p>
          </div>
          <Sparkles className="mt-0.5 h-4 w-4 opacity-80" />
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ApplicationStatusNotice;
