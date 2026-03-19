interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
    >
      {children}
    </button>
  );
}
