import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, Check } from 'lucide-react';

export function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  leftIcon,
  disabled = false,
  error,
  className,
  dropdownWidth = "w-full"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full h-9 px-3 bg-surface border rounded-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20",
          isOpen ? "border-primary ring-2 ring-primary/20" : "border-border",
          error ? "border-error focus:ring-error/20" : "",
          disabled ? "opacity-50 cursor-not-allowed bg-surface-muted" : "hover:border-border-strong cursor-pointer"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {leftIcon && <span className="text-text-secondary flex-shrink-0 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">{leftIcon}</span>}
          <span className={cn("text-[13px] truncate font-medium", selectedOption ? "text-text-primary" : "text-text-placeholder")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-text-secondary flex-shrink-0 transition-transform duration-150 ml-2", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute z-50 mt-1 bg-surface border border-border rounded-sm shadow-level-2 py-1 max-h-[300px] overflow-y-auto scrollbar-hide",
            dropdownWidth
          )}
          style={{
            animation: 'dropdownOpen 150ms ease-out forwards'
          }}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-[13px] transition-colors cursor-pointer text-left",
                  isSelected ? "bg-[#EAF2FF] text-primary" : "text-text-primary hover:bg-[#F1F6FD]"
                )}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
              >
                <span className="truncate pr-4 font-medium">{option.label}</span>
                {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
