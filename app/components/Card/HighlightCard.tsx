import React from "react";
import { useStore } from "store/useStore";
interface HighlightCardProps {
  children?: React.ReactNode;
  title: string;
  status?: string;
}

function HighlightCard({ children, title, status }: HighlightCardProps) {
  const { toggle } = useStore();

  return (
    <div className={toggle ? `w-52 h-48 rounded-2xl bg-darkMode-200 text-white flex flex-col gap-5 justify-between p-5 ` : `w-52 h-48 rounded-2xl bg-white flex flex-col gap-5 justify-between p-5 text-gray-700`}>
      <h1 className="text-slate-400">{title}</h1>
      {children}
      <h1>{status}</h1>
    </div>
  );
}

export default HighlightCard;
