import { InputHTMLAttributes, forwardRef } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ icon = true, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
        <input
          ref={ref}
          type="text"
          className={`w-full ${
            icon ? "pl-14 pr-5" : "px-5"
          } py-4 text-lg text-gray-900 placeholder-gray-500 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
