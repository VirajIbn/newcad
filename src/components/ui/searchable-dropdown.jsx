import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';

const SearchableDropdown = ({
  options = [],
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  className = "",
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Add "Select" option at the beginning of options with proper placeholder text
  const optionsWithSelect = useMemo(() => {
    const selectOption = {
      value: '',
      label: placeholder || 'Select'
    };
    return [selectOption, ...options];
  }, [options, placeholder]);

  // Filter options based on search value
  const filteredOptions = useMemo(() => {
    if (!searchValue) return optionsWithSelect;
    
    const selectOption = {
      value: '',
      label: placeholder || 'Select'
    };
    
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    return [selectOption, ...filtered];
  }, [options, searchValue, placeholder]);

  // Find selected option (including the "Select" option)
  const selectedOption = optionsWithSelect.find((option) => option.value === value);

  const handleSelect = (selectedValue) => {
    if (selectedValue === value) {
      onValueChange?.(undefined);
    } else if (selectedValue === '') {
      // Handle "Select" option - clear the selection
      onValueChange?.('');
    } else {
      onValueChange?.(selectedValue);
    }
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-10 px-3 py-2 text-sm border border-gray-300 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:border-blue-500",
            !selectedOption && "text-gray-500 dark:text-gray-400",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled || loading}
          {...props}
        >
          <span className="truncate">
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
                {loadingText}
              </span>
            ) : selectedOption ? (
              selectedOption.label
            ) : (
              placeholder
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0" 
        align="start"
        sideOffset={4}
      >
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      "cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700",
                      option.value === '' && "font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 mb-1"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100 text-blue-600" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { SearchableDropdown };
