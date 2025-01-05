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
    <div className={`${toggle ? `bg-darkMode-200 text-white  ` : ` bg-white text-gray-700`} w-40 h-36 lg:w-44 lg:h-40  rounded-2xl xl:w-52 xl:h-48 lg:rounded-2xl flex flex-col gap-3 lg:gap-5 justify-between p-5`}>
      <h1 className="text-slate-400 text-sm md:text-md">{title}</h1>
      {children}
      <h1 className="text-sm bg bg-green-100">{status}</h1>
    </div>
  );
}

export default HighlightCard;
