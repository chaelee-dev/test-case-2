interface Props {
  total: number;
  limit: number;
  offset: number;
  onSelect: (offset: number) => void;
}

export function Pagination({ total, limit, offset, onSelect }: Props) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages <= 1) return null;
  const current = Math.floor(offset / limit);
  const items: number[] = [];
  for (let i = 0; i < pages; i++) items.push(i);
  return (
    <ul className="pagination">
      {items.map((i) => (
        <li key={i} className={`page-item ${i === current ? 'active' : ''}`}>
          <button type="button" className="page-link" onClick={() => onSelect(i * limit)}>
            {i + 1}
          </button>
        </li>
      ))}
    </ul>
  );
}
