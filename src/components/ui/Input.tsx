type InputProps = {
  label?: string;
  type?: string;
};

export default function Input({ label, type = "text" }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm">{label}</label>}
      <input type={type} />
    </div>
  );
}
