import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";

export const BackButton = () => {
  const { canGoBack, navigateBack } = useNavigation();

  if (!canGoBack) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={navigateBack}
    >
      <ChevronLeft className="h-4 w-4" />
      Retour
    </Button>
  );
};