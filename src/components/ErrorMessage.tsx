import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="glass border-red-500/30 rounded-xl p-6 animate-fadeInUp">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-semibold text-red-400">Error Occurred</h3>
          <p className="text-sm text-slate-300 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}
