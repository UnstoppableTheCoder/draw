import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateBoardButtonProps {
  onClick: () => void;
}

export default function CreateBoardButton({ onClick }: CreateBoardButtonProps) {
  return (
    <Button onClick={onClick}>
      <Plus data-icon="inline-start" />
      New board
    </Button>
  );
}
