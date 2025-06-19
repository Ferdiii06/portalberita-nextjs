import Link from 'next/link';
export default function Pagination({ page, total, onChange }) {
  return (
    <div className="flex justify-center my-6">
      <nav aria-label="Page navigation">
        <ul className="inline-flex -space-x-px">
          {Array.from({ length: total }, (_, i) => i + 1).map(n => (
            <li key={n}>
              <button
                onClick={() => onChange(n)}
                className={`px-4 py-2 border border-gray-300 ${
                  n === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {n}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
