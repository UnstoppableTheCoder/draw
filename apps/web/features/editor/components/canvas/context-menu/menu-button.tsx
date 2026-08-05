export default function MenuButton({
  children,
  shortcut,
  disabled,
  destructive = false,
  onClick,
}: {
  children: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors cursor-pointer
        ${
          destructive
            ? "text-destructive hover:bg-destructive/10"
            : "hover:bg-accent hover:text-accent-foreground"
        } ${disabled && "opacity-20"}`}
    >
      <span>{children}</span>

      {shortcut && (
        <span className="ml-8 text-xs tracking-widest text-muted-foreground">
          {shortcut}
        </span>
      )}
    </button>
  );
}
