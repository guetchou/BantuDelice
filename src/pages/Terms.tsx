import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Shield, 
  Users,
  AlertTriangle
} from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Conditions générales d'utilisation</h1>
            <p className="text-lg text-gray-600">
              Dernière mise à jour : <span className="font-medium">15 janvier 2024</span>
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation du service 
                  BantuDelice, plateforme de livraison de colis et services associés. En utilisant nos services, 
                  vous acceptez d'être lié par ces conditions.
                </p>
                <p>
                  BantuDelice est un service de livraison de colis opérant au Congo et dans la région d'Afrique centrale, 
                  offrant des solutions de transport national et international.
                </p>
              </CardContent>
            </Card>

            {/* Définitions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Définitions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Service</h4>
                    <p className="text-gray-600">Désigne la plateforme BantuDelice et tous les services associés.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Utilisateur</h4>
                    <p className="text-gray-600">Toute personne utilisant le service BantuDelice.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Client</h4>
                    <p className="text-gray-600">Utilisateur inscrit utilisant nos services de livraison.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Colis</h4>
                    <p className="text-gray-600">Tout objet ou document confié à BantuDelice pour livraison.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Services proposés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Livraison de colis</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Livraison nationale au Congo</li>
                      <li>Livraison internationale</li>
                      <li>Suivi en temps réel</li>
                      <li>Assurance des colis</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Services additionnels</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Emballage sécurisé</li>
                      <li>Livraison express</li>
                      <li>Point relais</li>
                      <li>Service client 24h/24</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Obligations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Obligations des parties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Obligations de BantuDelice</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Assurer la livraison des colis dans les délais convenus</li>
                      <li>Maintenir la confidentialité des informations clients</li>
                      <li>Fournir un service client de qualité</li>
                      <li>Assurer la sécurité des colis pendant le transport</li>
                      <li>Respecter les réglementations en vigueur</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Obligations du client</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Fournir des informations exactes et complètes</li>
                      <li>Respecter les conditions d'emballage</li>
                      <li>Ne pas expédier d'objets interdits</li>
                      <li>Payer les frais de livraison convenus</li>
                      <li>Signaler tout problème dans les délais</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tarifs et paiement */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tarifs et modalités de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Les tarifs sont calculés selon le poids, la destination et le type de service choisi. 
                    Ils sont communiqués avant la validation de la commande.
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Moyens de paiement acceptés</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Cartes bancaires</Badge>
                      <Badge variant="outline">Mobile Money</Badge>
                      <Badge variant="outline">Airtel Money</Badge>
                      <Badge variant="outline">Virements bancaires</Badge>
                      <Badge variant="outline">Espèces à la livraison</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsabilité */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Responsabilité et garanties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    BantuDelice s'engage à livrer les colis dans les meilleures conditions. 
                    En cas de perte ou dommage, une indemnisation sera versée selon les conditions d'assurance.
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Limitations de responsabilité</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Force majeure (grèves, intempéries, etc.)</li>
                      <li>Erreurs dans les informations fournies par le client</li>
                      <li>Objets interdits ou mal emballés</li>
                      <li>Absence du destinataire</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Protection des données */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Protection des données personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  BantuDelice s'engage à protéger la confidentialité des données personnelles de ses clients 
                  conformément à la réglementation en vigueur. Pour plus d'informations, consultez notre 
                  politique de confidentialité.
                </p>
              </CardContent>
            </Card>

            {/* Résiliation */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Résiliation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    BantuDelice se réserve le droit de suspendre ou résilier l'accès aux services en cas de 
                    non-respect des présentes conditions.
                  </p>
                  <p className="text-gray-600">
                    Le client peut résilier son compte à tout moment en contactant notre service client.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Droit applicable */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Droit applicable et juridiction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Les présentes conditions sont régies par le droit congolais. En cas de litige, 
                  les tribunaux de Brazzaville sont seuls compétents.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 shadow-lg bg-orange-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Questions sur nos conditions ?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Notre équipe juridique est disponible pour répondre à vos questions.
                  </p>
                  <div className="flex justify-center gap-4">
                    <a 
                      href="/contact" 
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Nous contacter
                    </a>
                    <a 
                      href="/privacy" 
                      className="inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      Politique de confidentialité
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 