import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAppNavigation } from "@/utils/navigation";

export const BackButton = () => {
  const { goBack, currentPath } = useAppNavigation();

  // Don't show back button on main pages
  if (currentPath === "/" || currentPath === "/auth") {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-gray-300 hover:text-white"
      onClick={goBack}
    >
      <ChevronLeft className="h-4 w-4" />
      Retour
    </Button>
  );
};