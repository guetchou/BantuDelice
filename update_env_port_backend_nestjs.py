import os

backend_nestjs_path = os.path.join(os.path.dirname(__file__), 'backend-nestjs')
env_path = os.path.join(backend_nestjs_path, '.env')

if not os.path.exists(env_path):
    print(f"Le fichier {env_path} n'existe pas.")
    exit(1)

with open(env_path, 'r') as f:
    lines = f.readlines()

with open(env_path, 'w') as f:
    for line in lines:
        if line.startswith('DB_PORT='):
            f.write('DB_PORT=3254\n')
        else:
            f.write(line)

print(f"Port de la base de données mis à jour à 3254 dans {env_path}") 