
import { Card } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Résultats de recherche pour: {query}</h1>
        <p className="text-muted-foreground">Cette page est en cours de développement.</p>
      </Card>
    </div>
  );
}
