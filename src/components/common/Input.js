export function Input({ label, error, className = "", ...props }) {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 border rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
          error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function TextArea({ label, error, className = "", ...props }) {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 border rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
          error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}