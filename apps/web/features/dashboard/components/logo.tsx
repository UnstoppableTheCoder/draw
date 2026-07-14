// features/dashboard/components/logo.tsx

import Link from "next/link";

interface LogoProps {
  href?: string;
}

export function Logo({ href = "/" }: LogoProps) {
  const content = (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
        O
      </div>

      <span className="text-sm font-semibold tracking-tight">Orbit</span>
    </div>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
