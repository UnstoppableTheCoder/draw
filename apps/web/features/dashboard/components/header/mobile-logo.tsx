import { Search } from "lucide-react";
import { Logo } from "../logo";

export default function MobileLogo() {
  return (
    <div className="md:hidden">
      <Logo href={undefined} />
    </div>
  );
}
