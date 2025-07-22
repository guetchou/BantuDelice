import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Key, Globe, Package, Terminal, BookOpen, Download, Eye, EyeOff } from 'lucide-react';

const ColisApiPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('bd_api_1234567890abcdef');
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const codeExamples = {
    tracking: `curl -X GET "https://api.bantudelice.com/colis/tracking/BD12345678" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,

    national: `curl -X GET "https://api.bantudelice.com/colis/national/BD12345678" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,

    international: `curl -X GET "https://api.bantudelice.com/colis/international/1Z999AA1234567890" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,

    widget: `<script src="https://widget.bantudelice.com/colis.js"></script>
<div id="bantudelice-tracking-widget" 
     data-tracking-number="BD12345678"
     data-api-key="YOUR_API_KEY">
</div>`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200">
      {/* Header avec navigation */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="BantuDelice" className="h-10 w-10 rounded-full border-2 border-yellow-400 shadow" />
              <span className="font-bold text-orange-700 text-xl">BantuDelice Colis</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/colis" className="text-orange-700 hover:text-orange-900 font-medium">Accueil</Link>
              <Link to="/colis/tracking" className="text-orange-700 hover:text-orange-900 font-medium">Suivi</Link>
              <Link to="/colis/tarifs" className="text-orange-700 hover:text-orange-900 font-medium">Tarifs</Link>
              <Link to="/colis/expedier" className="text-orange-700 hover:text-orange-900 font-medium">Expédier</Link>
              <Link to="/colis/historique" className="text-orange-700 hover:text-orange-900 font-medium">Historique</Link>
            </nav>
            <Button asChild className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
              <Link to="/colis/tracking">Suivre un colis</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-700 mb-2">Documentation API</h1>
          <p className="text-gray-600">Intégrez le suivi de colis dans vos applications</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'overview' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    Vue d'ensemble
                  </button>
                  <button
                    onClick={() => setActiveTab('authentication')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'authentication' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    Authentification
                  </button>
                  <button
                    onClick={() => setActiveTab('endpoints')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'endpoints' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    Endpoints
                  </button>
                  <button
                    onClick={() => setActiveTab('widget')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'widget' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    Widget
                  </button>
                  <button
                    onClick={() => setActiveTab('examples')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'examples' 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:text-orange-700'
                    }`}
                  >
                    Exemples
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* Vue d'ensemble */}
            {activeTab === 'overview' && (
              <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <BookOpen className="h-6 w-6" />
                    Vue d'ensemble
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">API BantuDelice Colis</h3>
                    <p className="text-gray-600 mb-4">
                      L'API BantuDelice Colis vous permet d'intégrer le suivi de colis dans vos applications web et mobiles. 
                      Supportez le suivi national (Congo) et international avec plus de 2500 transporteurs.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Package className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <h4 className="font-semibold text-gray-800">Suivi National</h4>
                      <p className="text-sm text-gray-600">Colis au Congo</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold text-gray-800">Suivi International</h4>
                      <p className="text-sm text-gray-600">Colis mondiaux</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Terminal className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold text-gray-800">Widget Intégré</h4>
                      <p className="text-sm text-gray-600">Interface clé en main</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">URLs de base</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Production</Badge>
                        <code className="bg-white px-2 py-1 rounded">https://api.bantudelice.com</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Sandbox</Badge>
                        <code className="bg-white px-2 py-1 rounded">https://api-sandbox.bantudelice.com</code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Authentification */}
            {activeTab === 'authentication' && (
              <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Key className="h-6 w-6" />
                    Authentification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Clé API</h3>
                    <p className="text-gray-600 mb-4">
                      Toutes les requêtes API nécessitent une clé API valide dans l'en-tête Authorization.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Votre clé API</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setShowApiKey(!showApiKey)}
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-700"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          onClick={() => copyToClipboard(apiKey)}
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-700"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <code className="text-sm">
                        {showApiKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Utilisation</h4>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X GET "https://api.bantudelice.com/colis/tracking/BD12345678" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Sécurité</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Ne partagez jamais votre clé API publiquement</li>
                      <li>• Utilisez HTTPS pour toutes les requêtes</li>
                      <li>• Régénérez votre clé si elle est compromise</li>
                      <li>• Limitez l'accès à votre clé API</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Endpoints */}
            {activeTab === 'endpoints' && (
              <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Terminal className="h-6 w-6" />
                    Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Suivi universel */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-lg font-mono">/colis/tracking/{'{tracking_number}'}</code>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Suivi automatique détectant le type de colis (national ou international).
                    </p>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">{codeExamples.tracking}</pre>
                    </div>
                  </div>

                  {/* Suivi national */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-lg font-mono">/colis/national/{'{tracking_number}'}</code>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Suivi spécifique pour les colis nationaux au Congo.
                    </p>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">{codeExamples.national}</pre>
                    </div>
                  </div>

                  {/* Suivi international */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-lg font-mono">/colis/international/{'{tracking_number}'}</code>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Suivi spécifique pour les colis internationaux (DHL, FedEx, etc.).
                    </p>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">{codeExamples.international}</pre>
                    </div>
                  </div>

                  {/* Réponses */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Format de réponse</h4>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">{`{
  "success": true,
  "tracking_number": "BD12345678",
  "type": "national",
  "status": "En cours de livraison",
  "carrier": "BantuDelice",
  "origin": "Brazzaville",
  "destination": "Pointe-Noire",
  "estimated_delivery": "2024-07-20",
  "steps": [
    {
      "date": "2024-07-18T10:30:00Z",
      "status": "Pris en charge",
      "location": "Brazzaville",
      "description": "Colis récupéré au point de collecte"
    }
  ]
}`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Widget */}
            {activeTab === 'widget' && (
              <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Code className="h-6 w-6" />
                    Widget d'intégration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Widget JavaScript</h3>
                    <p className="text-gray-600 mb-4">
                      Intégrez facilement le suivi de colis dans votre site web avec notre widget JavaScript.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Installation</h4>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">{codeExamples.widget}</pre>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Attributs disponibles</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <code>data-tracking-number</code>
                          <span className="text-gray-600">Numéro de tracking</span>
                        </div>
                        <div className="flex justify-between">
                          <code>data-api-key</code>
                          <span className="text-gray-600">Clé API</span>
                        </div>
                        <div className="flex justify-between">
                          <code>data-theme</code>
                          <span className="text-gray-600">light/dark</span>
                        </div>
                        <div className="flex justify-between">
                          <code>data-lang</code>
                          <span className="text-gray-600">fr/en</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Exemple complet</h4>
                      <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm">{`<!DOCTYPE html>
<html>
<head>
  <script src="https://widget.bantudelice.com/colis.js"></script>
</head>
<body>
  <div id="tracking-widget" 
       data-tracking-number="BD12345678"
       data-api-key="YOUR_API_KEY"
       data-theme="light"
       data-lang="fr">
  </div>
</body>
</html>`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exemples */}
            {activeTab === 'examples' && (
              <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Code className="h-6 w-6" />
                    Exemples d'intégration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">JavaScript (Fetch)</h4>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">{`async function trackPackage(trackingNumber) {
  try {
    const response = await fetch(
      \`https://api.bantudelice.com/colis/tracking/\${trackingNumber}\`,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    console.log('Tracking info:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Utilisation
trackPackage('BD12345678');`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Python (Requests)</h4>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">{`import requests

def track_package(tracking_number, api_key):
    url = f"https://api.bantudelice.com/colis/tracking/{tracking_number}"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Utilisation
result = track_package("BD12345678", "YOUR_API_KEY")
print(result)`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">PHP (cURL)</h4>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">{`<?php
function trackPackage($trackingNumber, $apiKey) {
    $url = "https://api.bantudelice.com/colis/tracking/" . $trackingNumber;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . $apiKey,
        "Content-Type: application/json"
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Utilisation
$result = trackPackage("BD12345678", "YOUR_API_KEY");
var_dump($result);
?>`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisApiPage; 