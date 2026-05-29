import clsx from "clsx";

interface AvatarProps {
  name: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export default function Avatar({ name, color = "bg-brand-600", size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg"
  };

  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0",
        color,
        sizes[size]
      )}
    >
      {initials}
    </div>
  );
}