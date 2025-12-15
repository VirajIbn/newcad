import * as React from "react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ children, value, onValueChange, className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
})

const SelectItem = React.forwardRef(({ children, value, className, ...props }, ref) => {
  return (
    <option
      ref={ref}
      value={value}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-700 dark:focus:text-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </option>
  )
})

Select.displayName = "Select"
SelectItem.displayName = "SelectItem"

Select.Item = SelectItem

export { Select, SelectItem }
