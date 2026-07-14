import { FileText, Grid2X2, Plus, Users } from "lucide-react";

interface TemplateIconProps {
  type: "plus" | "grid" | "map" | "notes";
}

export default function TemplateIcon({ type }: TemplateIconProps) {
  switch (type) {
    case "plus":
      return <Plus />;
    case "grid":
      return <Grid2X2 />;
    case "map":
      return <Users />;
    case "notes":
      return <FileText />;
    default:
      return null;
  }
}
