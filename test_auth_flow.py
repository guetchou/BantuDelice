import requests

BASE_URL = 'http://localhost:4000/auth'

# 1. Inscription
def register():
    data = {
        'email': 'testuser@example.com',
        'password': 'TestPassword123!',
        'firstName': 'Test',
        'lastName': 'User'
    }
    r = requests.post(f'{BASE_URL}/register', json=data)
    print('Inscription:', r.status_code, r.json())
    return r

# 2. Connexion
def login():
    data = {
        'email': 'testuser@example.com',
        'password': 'TestPassword123!'
    }
    r = requests.post(f'{BASE_URL}/login', json=data)
    print('Connexion:', r.status_code, r.json())
    if r.status_code == 200 and 'token' in r.json():
        return r.json()['token']
    return None

# 3. Profil utilisateur
def me(token):
    headers = {'Authorization': f'Bearer {token}'}
    r = requests.get(f'{BASE_URL}/me', headers=headers)
    print('Profil utilisateur:', r.status_code, r.json())
    return r

if __name__ == '__main__':
    register()
    token = login()
    if token:
        me(token)
    else:
        print('Impossible de récupérer le token, test interrompu.') 