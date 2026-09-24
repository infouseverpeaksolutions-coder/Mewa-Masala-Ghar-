import React from 'react';
import { LucideIcon, Clock, Sparkles } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  phase?: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  description,
  icon: Icon,
  phase = 'Phase 3 / 4',
}) => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <div className="bg-white border border-[#E6DEC8] rounded-3xl p-10 max-w-lg w-full text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#2F5D3A]/10 text-[#2F5D3A] flex items-center justify-center mx-auto mb-6 border border-[#2F5D3A]/20">
          <Icon className="w-8 h-8 text-[#2F5D3A]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EC] border border-[#D9A441] text-[#8C7B65] text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
          <span>Scheduled for {phase}</span>
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#2B2B2B] mb-2">{title}</h2>
        <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">{description}</p>

        <div className="bg-[#FAF6EC] rounded-xl p-4 text-xs text-[#8C7B65] border border-[#E6DEC8] flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-[#D9A441]" />
          <span>Foundation and database schemas are already provisioned.</span>
        </div>
      </div>
    </div>
  );
};
