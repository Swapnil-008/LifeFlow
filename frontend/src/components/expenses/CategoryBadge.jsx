import { categoryColor } from '../../utils/expenseCategories';

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: categoryColor(category) }} />
      {category}
    </span>
  );
}

export default CategoryBadge;
