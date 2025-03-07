import * as React from "react";
import { VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { badgeVariants } from "./badgeVariants"; // Import from the new file

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
