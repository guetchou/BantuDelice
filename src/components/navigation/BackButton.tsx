
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAppNavigation } from "@/utils/navigation";

export const BackButton = () => {
  const { goBack, currentPath } = useAppNavigation();

  // Ne pas afficher le bouton retour sur les pages principales
  if (currentPath === "/" || currentPath === "/index" || currentPath === "/auth") {
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

export default BackButton;
