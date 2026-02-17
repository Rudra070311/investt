type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  variant = "primary",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-500 text-white"
      : "bg-gray-800 hover:bg-gray-700 text-gray-100";

  return (
    <button className={`px-4 py-2 rounded text-sm ${styles}`}>
      {children}
    </button>
  );
}
