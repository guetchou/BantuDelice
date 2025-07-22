#!/usr/bin/env python3
import requests
import re

def test_navbar():
    print("🧭 Test de la nouvelle Navbar Apple...")
    
    try:
        response = requests.get("http://localhost:9595")
        content = response.text
        
        # Tests spécifiques pour la nouvelle Navbar
        tests = [
            ("backdrop-blur-md", "Glassmorphism effect"),
            ("bg-white/70", "Fond translucide"),
            ("hover:text-blue-700", "Hover effects bleus"),
            ("transition-all duration-300", "Animations CSS"),
            ("group-hover:opacity-100", "Dropdown animations"),
            ("rounded-xl shadow-xl", "Dropdown styling"),
            ("animate-fadeIn", "CSS animations"),
            ("animate-slideInRight", "Mobile menu animations"),
            ("Services", "Menu Services"),
            ("dropdown", "Menu déroulant"),
            ("svg", "Icônes SVG")
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
        
        # Test spécifique du contenu
        if "Services" in content and "dropdown" in content:
            print("✅ Menu Services avec dropdown détecté")
        else:
            print("❌ Menu Services avec dropdown non trouvé")
            
        return found >= len(tests) * 0.6  # 60% minimum
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_navbar()
    print(f"\n{'🎉 SUCCÈS' if success else '❌ ÉCHEC'}") 