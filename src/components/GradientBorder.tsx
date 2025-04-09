import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  borderRadius?: string;
  variant?: string;
}

export default function GradientBorder({
  children,
  className,
  borderRadius = "20px",
  variant,
}: GradientBorderProps) {
  return (
    <div
      className={cn("p-[2px] flex justify-center items-center", className)}
      style={{
        borderRadius,
        background: `
          radial-gradient(69.43% 69.43% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%),
          radial-gradient(60% 51.57% at 50% 50%, #582CFF 0%, rgba(88, 44, 255, 0) 100%),
          radial-gradient(54.8% 53% at 50% 50%, #151515 0%, rgba(21, 21, 21, 0) 100%)
        `,
      }}
    >
      {children}
    </div>
  );
}
