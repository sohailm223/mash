export function CheckboxGroup({ label, options, value = [], onChange, className = "" }) {
  const handleChange = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all select-none ${
              value.includes(option)
                ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500"
                : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={value.includes(option)}
              onChange={() => handleChange(option)}
            />
            <span className={`ml-2.5 text-sm ${value.includes(option) ? "text-indigo-700 font-medium" : "text-gray-700"}`}>
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}