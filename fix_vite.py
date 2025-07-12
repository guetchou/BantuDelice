import json

# Chemin vers le package.json
package_json_path = "package.json"

# Charger le fichier
with open(package_json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Modifier la version de vite, date-fns et react-leaflet dans dependencies et devDependencies
changed = False
for dep_type in ["dependencies", "devDependencies"]:
    if dep_type in data:
        if "vite" in data[dep_type]:
            data[dep_type]["vite"] = "^5.2.0"
            changed = True
        if "date-fns" in data[dep_type]:
            data[dep_type]["date-fns"] = "^3.0.0"
            changed = True
        if "react-leaflet" in data[dep_type]:
            data[dep_type]["react-leaflet"] = "^4.2.1"
            changed = True

if changed:
    # Sauvegarder le fichier modifié
    with open(package_json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print("Vite à ^5.2.0, date-fns à ^3.0.0, react-leaflet à ^4.2.1 dans package.json.")
else:
    print("Aucune modification nécessaire dans package.json.") 