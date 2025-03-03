
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Utensils, Truck, CreditCard, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-16 pt-10">
        <h1 className="text-4xl font-bold mb-4">Votre plateforme de livraison de repas</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Découvrez les meilleurs restaurants de votre région et faites-vous livrer en quelques clics
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/restaurants">Explorer les restaurants</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/order-demo">Tester le processus de commande</Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <FeatureCard 
          icon={<Utensils className="h-10 w-10 text-primary" />}
          title="Grande variété"
          description="Des centaines de restaurants à découvrir avec des cuisines du monde entier"
        />
        <FeatureCard 
          icon={<Truck className="h-10 w-10 text-primary" />}
          title="Livraison rapide"
          description="Vos plats préférés livrés à votre porte en moins de 30 minutes"
        />
        <FeatureCard 
          icon={<CreditCard className="h-10 w-10 text-primary" />}
          title="Paiement sécurisé"
          description="Plusieurs options de paiement sécurisées et faciles à utiliser"
        />
        <FeatureCard 
          icon={<ShieldCheck className="h-10 w-10 text-primary" />}
          title="Qualité garantie"
          description="Des restaurants soigneusement sélectionnés pour la qualité de leurs plats"
        />
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Nos fonctionnalités avancées</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Recommandations personnalisées</h3>
              <p className="text-muted-foreground mb-4">
                Des suggestions basées sur vos préférences et habitudes alimentaires
              </p>
              <Button variant="link" asChild>
                <Link to="/order-demo">
                  Tester <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Programme de fidélité</h3>
              <p className="text-muted-foreground mb-4">
                Gagnez des points à chaque commande et bénéficiez d'avantages exclusifs
              </p>
              <Button variant="link" asChild>
                <Link to="/order-demo">
                  Voir les récompenses <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Suivi en temps réel</h3>
              <p className="text-muted-foreground mb-4">
                Suivez votre commande de la préparation jusqu'à la livraison
              </p>
              <Button variant="link" asChild>
                <Link to="/order-demo">
                  Essayer <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="flex justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
