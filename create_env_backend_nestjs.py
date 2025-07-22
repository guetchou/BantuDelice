import os

# Chemin du dossier backend-nestjs
backend_nestjs_path = os.path.join(os.path.dirname(__file__), 'backend-nestjs')

# Contenu du fichier .env
env_content = '''DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=bantudelice
'''

# Création du fichier .env
env_path = os.path.join(backend_nestjs_path, '.env')
with open(env_path, 'w') as f:
    f.write(env_content)

print(f"Fichier .env créé à : {env_path}") 