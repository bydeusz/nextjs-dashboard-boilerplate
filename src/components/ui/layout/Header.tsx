interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  border?: boolean;
}

export const Header = ({
  title,
  description,
  children,
  border,
}: HeaderProps) => (
  <header
    className={`flex items-center ${border ? "border-b border-gray-200 pb-4" : ""}`}>
    <div className="space-y-2">
      <h1>{title}</h1>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <div className="ml-auto space-x-2">{children}</div>
  </header>
);
