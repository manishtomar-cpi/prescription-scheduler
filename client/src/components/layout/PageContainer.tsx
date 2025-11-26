import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const PageContainer = ({ title, children, footer }: PageContainerProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-sky-400">{title}</h1>
          <span className="text-xs text-slate-400">Prescription Scheduler</span>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/60">
        <div className="max-w-4xl mx-auto px-4 py-3 text-xs text-slate-500 flex justify-between">
          <span>Demo app for developer test</span>
          {footer}
        </div>
      </footer>
    </div>
  );
};
