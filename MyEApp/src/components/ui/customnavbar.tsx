import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NavProps } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function CustomNavbar({ onPreviousClick, onNextClick, className }: NavProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <button
        onClick={onPreviousClick}
        className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={onNextClick}
        className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default CustomNavbar; 