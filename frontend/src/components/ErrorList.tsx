interface Props {
  errors: string[];
}

export function ErrorList({ errors }: Props) {
  if (errors.length === 0) return null;
  return (
    <ul className="error-messages">
      {errors.map((err, i) => (
        <li key={i}>{err}</li>
      ))}
    </ul>
  );
}
