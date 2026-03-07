import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

type AlertVariant = "default" | "destructive" | "success" | "warning" | "info";

const variants: Record<
  AlertVariant,
  {
    icon: React.ElementType;
    color: string;
  }
> = {
  default: {
    icon: AlertCircle,
    color: "text-foreground",
  },
  destructive: {
    icon: AlertCircle,
    color: "text-destructive dark:text-destructive",
  },
  success: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-600",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-600 dark:text-yellow-600",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-600",
  },
};

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "border-black bg-background text-foreground",
        destructive:
          "border-destructive bg-destructive/10 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-700 bg-green-50 text-green-700 [&>svg]:text-green-700",
        warning:
          "border-yellow-700 bg-yellow-50 text-yellow-700 [&>svg]:text-yellow-700",
        info: "border-blue-700 bg-blue-50 text-blue-700 [&>svg]:text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant = "default", children, ...props }, ref) => {
  const { icon: IconComponent, color } = variants[variant as AlertVariant];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}>
      <IconComponent className={cn("h-4 w-4 -mt-1", color)} />
      {children}
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("text-sm mb-1 font-medium leading-none", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
