#!/usr/bin/env python3
"""
Script de test d'intégration pour BantuDelice
Teste le frontend, backend et la nouvelle Navbar
"""

import requests
import time
import sys

def test_backend():
    """Test du backend NestJS"""
    print("🔧 Test du Backend...")
    try:
        # Test de base
        response = requests.get("http://localhost:5350", timeout=5)
        if response.status_code == 200:
            print("✅ Backend accessible sur le port 5350")
        else:
            print(f"❌ Backend erreur: {response.status_code}")
            return False
            
        # Test des endpoints
        endpoints = [
            "/restaurants",
            "/users", 
            "/notifications",
            "/taxi",
            "/colis",
            "/services"
        ]
        
        for endpoint in endpoints:
            try:
                response = requests.get(f"http://localhost:5350{endpoint}", timeout=3)
                print(f"✅ {endpoint}: {response.status_code}")
            except Exception as e:
                print(f"⚠️ {endpoint}: {str(e)}")
                
        return True
    except Exception as e:
        print(f"❌ Erreur backend: {str(e)}")
        return False

def test_frontend():
    """Test du frontend React"""
    print("\n🎨 Test du Frontend...")
    try:
        response = requests.get("http://localhost:9595", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend accessible sur le port 9595")
            
            # Vérifier la présence de la nouvelle Navbar
            content = response.text.lower()
            
            # Vérifications pour la nouvelle Navbar
            checks = [
                ("backdrop-blur", "Effet glassmorphism"),
                ("blue-700", "Couleur dominante bleue"),
                ("dropdown", "Menu déroulant"),
                ("transition", "Animations CSS"),
                ("svg", "Icônes SVG"),
                ("services", "Menu Services")
            ]
            
            for check, description in checks:
                if check in content:
                    print(f"✅ {description} détecté")
                else:
                    print(f"⚠️ {description} non détecté")
                    
            return True
        else:
            print(f"❌ Frontend erreur: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erreur frontend: {str(e)}")
        return False

def test_navbar_features():
    """Test spécifique des fonctionnalités de la Navbar"""
    print("\n🧭 Test des fonctionnalités Navbar...")
    
    try:
        response = requests.get("http://localhost:9595")
        content = response.text
        
        # Tests spécifiques
        tests = [
            ("backdrop-blur-md", "Glassmorphism effect"),
            ("bg-white/70", "Fond translucide"),
            ("hover:text-blue-700", "Hover effects"),
            ("transition-all duration-300", "Animations"),
            ("group-hover:opacity-100", "Dropdown animations"),
            ("rounded-xl shadow-xl", "Dropdown styling"),
            ("animate-fadeIn", "CSS animations"),
            ("animate-slideInRight", "Mobile menu animations")
        ]
        
        passed = 0
        for test, description in tests:
            if test in content:
                print(f"✅ {description}")
                passed += 1
            else:
                print(f"❌ {description}")
                
        print(f"\n📊 Résultat: {passed}/{len(tests)} fonctionnalités détectées")
        return passed >= len(tests) * 0.8  # 80% de réussite minimum
        
    except Exception as e:
        print(f"❌ Erreur test Navbar: {str(e)}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Test d'intégration BantuDelice")
    print("=" * 50)
    
    # Tests
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    navbar_ok = test_navbar_features()
    
    # Résumé
    print("\n" + "=" * 50)
    print("📋 RÉSUMÉ DES TESTS")
    print("=" * 50)
    
    print(f"Backend NestJS: {'✅ OK' if backend_ok else '❌ ÉCHEC'}")
    print(f"Frontend React: {'✅ OK' if frontend_ok else '❌ ÉCHEC'}")
    print(f"Navbar Apple: {'✅ OK' if navbar_ok else '❌ ÉCHEC'}")
    
    if backend_ok and frontend_ok and navbar_ok:
        print("\n🎉 TOUS LES TESTS SONT PASSÉS !")
        print("✅ Backend fonctionnel sur le port 5350")
        print("✅ Frontend fonctionnel sur le port 9595")
        print("✅ Nouvelle Navbar avec design Apple implémentée")
        print("\n🌐 Accès:")
        print("   Frontend: http://localhost:9595")
        print("   Backend:  http://localhost:5350")
        return True
    else:
        print("\n❌ CERTAINS TESTS ONT ÉCHOUÉ")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 