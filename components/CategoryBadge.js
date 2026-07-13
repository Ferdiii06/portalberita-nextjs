export default function CategoryBadge({ category }) {
  const getBadgeColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'teknologi':
        return 'bg-blue-100 text-blue-700';
      case 'olahraga':
        return 'bg-emerald-100 text-emerald-700';
      case 'nasional':
        return 'bg-red-100 text-red-700';
      case 'hiburan':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getBadgeColor(category)}`}>
      {category}
    </span>
  );
}
