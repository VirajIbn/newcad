import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  secondary: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  outline: "text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
  success: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
}

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      badgeVariants[variant],
      className
    )}
    {...props} />
))
Badge.displayName = "Badge"

export { Badge, badgeVariants }
