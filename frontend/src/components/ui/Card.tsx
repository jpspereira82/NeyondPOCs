import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({ children, className, padding = "md" }: Props) {
  const pads = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6"
  };
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-slate-200 shadow-sm",
        pads[padding],
        className
      )}
    >
      {children}
    </div>
  );
}