import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-[rgb(19,21,54)] border-none rounded-[20px] text-white text-sm h-[46px] w-full max-w-full focus:border-none focus:ring-0",
        className
      )}
      {...props}
    />
  );
}

export { Input };
