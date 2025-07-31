
import { useEffect } from "react";
import { Award, Share2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLoyalty } from "@/contexts/LoyaltyContext";
import UserStats from "@/components/stats/UserStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoyaltyStatus from "@/components/loyalty/LoyaltyStatus";
import { ShareSocial } from "@/components/sharing/ShareSocial";

export default function Loyalty() {
  usePageTitle({ title: "Programme de Fidélité" });
  const { loyaltyPoints, isLoading } = useLoyalty();

  const handleShareLoyalty = () => {
    // Open social sharing popup
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Award className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Programme de Fidélité</h1>
        </div>
        <ShareSocial 
          title="Mon niveau de fidélité" 
          text={`Je suis ${loyaltyPoints?.tier_name} avec ${loyaltyPoints?.points} points sur Buntudelice!`}
          url={window.location.href}
        />
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3">
          <TabsTrigger value="status">Mon Statut</TabsTrigger>
          <TabsTrigger value="rewards">Mes Récompenses</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LoyaltyStatus />
            </div>
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Avantages VIP</h2>
                <p className="text-muted-foreground mb-4">
                  En tant que membre {loyaltyPoints?.tier_name}, vous bénéficiez des avantages suivants :
                </p>
                <ul className="space-y-2">
                  {loyaltyPoints?.tier_name === "Gold" || loyaltyPoints?.tier_name === "Diamond" ? (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        Accès anticipé aux nouvelles offres
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        Livraison prioritaire
                      </li>
                    </>
                  ) : null}
                  
                  {loyaltyPoints?.tier_name === "Diamond" ? (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        Support client dédié
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        Menu spécial exclusif
                      </li>
                    </>
                  ) : null}
                </ul>
              </Card>
            </div>
          </div>
          
          <UserStats />
        </TabsContent>

        <TabsContent value="rewards">
          <iframe src="/loyalty/rewards" className="w-full min-h-[700px] border-none"></iframe>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Historique des Points</h2>
            <p className="text-muted-foreground mb-8">
              Suivez l'évolution de vos points de fidélité et découvrez comment vous les avez gagnés.
            </p>
            
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                    <th scope="col" className="px-6 py-3">Points</th>
                    <th scope="col" className="px-6 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-4">12/06/2023</td>
                    <td className="px-6 py-4">Commande #12456</td>
                    <td className="px-6 py-4 text-green-500">+50</td>
                    <td className="px-6 py-4">350</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4">05/06/2023</td>
                    <td className="px-6 py-4">Commande #12344</td>
                    <td className="px-6 py-4 text-green-500">+25</td>
                    <td className="px-6 py-4">300</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4">01/06/2023</td>
                    <td className="px-6 py-4">Échange de points - Réduction 10%</td>
                    <td className="px-6 py-4 text-red-500">-100</td>
                    <td className="px-6 py-4">275</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4">25/05/2023</td>
                    <td className="px-6 py-4">Commande #12288</td>
                    <td className="px-6 py-4 text-green-500">+75</td>
                    <td className="px-6 py-4">375</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
