export default function Card({ title, children }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
      {title && <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">{title}</h2>}
      {children}
    </div>
  );
}
