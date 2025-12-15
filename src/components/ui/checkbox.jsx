import * as React from "react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef(({ className, onCheckedChange, ...props }, ref) => {
  const handleChange = (event) => {
    if (onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
    // Call the original onChange if it exists
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400",
        className
      )}
      {...props}
      onChange={handleChange}
    />
  );
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
