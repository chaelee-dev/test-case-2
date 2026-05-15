interface Props {
  tags: string[];
  onSelect: (tag: string) => void;
}

export function TagList({ tags, onSelect }: Props) {
  if (tags.length === 0) return <p>Loading tags...</p>;
  return (
    <div className="tag-list">
      {tags.map((t) => (
        <button
          key={t}
          type="button"
          className="tag-pill tag-default"
          onClick={() => onSelect(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
