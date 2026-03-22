interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  id?: string;
}
export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  id,
}: InputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      className={`p-2 border rounded w-full ${className}`}
    />
  );
}
