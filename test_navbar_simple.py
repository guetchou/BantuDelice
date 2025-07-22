#!/usr/bin/env python3
import requests

def test_navbar_simple():
    print("🧭 Test simple de la nouvelle Navbar...")
    
    try:
        response = requests.get("http://localhost:9595")
        content = response.text
        
        # Tests spécifiques pour la nouvelle Navbar
        tests = [
            ("orange-500", "Couleur orange"),
            ("pink-500", "Couleur pink"),
            ("gradient-to-r", "Gradient"),
            ("backdrop-blur", "Glassmorphism"),
            ("border-orange-200", "Bordure orange"),
            ("hover:text-orange-600", "Hover orange"),
            ("from-orange-500 to-pink-500", "Gradient orange-pink"),
            ("Services", "Menu Services"),
            ("dropdown", "Menu déroulant"),
            ("🍽️", "Icône repas"),
            ("🚗", "Icône taxi"),
            ("📦", "Icône colis"),
            ("👥", "Icône covoiturage"),
            ("🔧", "Icône services")
        ]
        
        print("🔍 Recherche des fonctionnalités...")
        found = 0
        
        for test, description in tests:
            if test in content:
                print(f"✅ {description}")
                found += 1
            else:
                print(f"❌ {description}")
        
        print(f"\n📊 Résultat: {found}/{len(tests)} fonctionnalités trouvées")
        
        if found >= len(tests) * 0.7:  # 70% minimum
            print("🎉 SUCCÈS - Nouvelle Navbar détectée !")
            return True
        else:
            print("❌ ÉCHEC - Ancienne Navbar encore active")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

if __name__ == "__main__":
    test_navbar_simple() 