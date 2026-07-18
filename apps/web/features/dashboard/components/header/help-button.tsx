import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function HelpButton() {
  return (
    <Button variant="ghost" size="icon" aria-label="Help">
      <HelpCircle />
    </Button>
  );
}
