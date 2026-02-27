export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`group border rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-xl transition-all duration-300 mb-6 flex flex-col h-full transform hover:-translate-y-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
