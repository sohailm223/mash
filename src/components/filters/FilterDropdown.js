import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

// standalone dropdown used by various filter panels
export default function FilterDropdown({
  title,
  icon: Icon,
  options,
  selectedValue,
  onValueChange,
  filterKey,
  getOptionCount,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value, e) => {
    e.stopPropagation();

    const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onValueChange({ target: { name: filterKey, value: newValues } });
  };

  const containerRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  // compute menu position relative to button when open
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMenuStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 100,
      });
    }
  }, [isOpen]);

  const dropdown = (
    <div
      style={menuStyle}
      className="origin-top-left rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-visible"
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        {options.map((option) => {
          const isSelected = Array.isArray(selectedValue) && selectedValue.includes(option);
          const count = getOptionCount ? getOptionCount(option) : 0;
          return (
            <div
              key={option}
              className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer`}
              onClick={(e) => handleSelect(option, e)}
              role="menuitem"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-3"
                />
                {option}
              </div>
              {count > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        className={`inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          selectedValue && selectedValue.length > 0 ? "border-indigo-500 text-indigo-600" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {title} {selectedValue && selectedValue.length > 0 && `(${selectedValue.length})`}
        <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
      </button>

      {isOpen && createPortal(dropdown, document.body)}
    </div>
  );
}
