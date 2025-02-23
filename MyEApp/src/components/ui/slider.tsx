import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn(
        "relative flex touch-none select-none cursor-pointer",
        orientation === "horizontal"
          ? "h-full w-full flex-row"
          : "h-full w-full flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative grow overflow-hidden rounded-full bg-gray-200",
          orientation === "horizontal" ? "h-2 w-full" : "h-full w-2"
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            "absolute bg-black",
            orientation === "horizontal" ? "h-full" : "w-full bottom-0"
          )}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-5 w-5 rounded-full border-2 border-black bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:cursor-grab active:cursor-grabbing"
      />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = "Slider";

export { Slider };

