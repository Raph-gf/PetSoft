export default function H1({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return <h1 className={className}>{children}</h1>;
}
