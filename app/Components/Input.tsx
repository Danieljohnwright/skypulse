interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <input // ← note: lowercase <input>, not <Input>
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      className="p-2 border rounded w-full"
    />
  );
}
