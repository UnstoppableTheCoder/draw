import Link from "next/link";
import TemplateIcon from "./icon";
import { TEMPLATES } from "../../data";

interface TemplateCardProps {
  template: (typeof TEMPLATES)[number];
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link
      href={template.href}
      onClick={(event) => {
        if (!template.enabled) {
          event.preventDefault();
        }
      }}
      className="group flex min-h-28 flex-col justify-between rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary"
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
        <TemplateIcon type={template.icon} />
      </div>

      <div>
        <p className="text-sm font-medium">{template.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {template.description}
        </p>
      </div>
    </Link>
  );
}
