
const API_BASE = "https://api.topcenter.cg";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/collections/users/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: email, password }),
  });

  if (!res.ok) throw new Error("Échec de l'authentification");

  const data = await res.json();
  localStorage.setItem("pb_token", data.token);
  return data;
}

export function getToken() {
  return localStorage.getItem("pb_token");
}

export async function fetchClients() {
  const res = await fetch(`${API_BASE}/api/collections/clients/records`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Échec du chargement des clients");
  return await res.json();
}

export async function addClient(nom: string, email: string, telephone: string) {
  const res = await fetch(`${API_BASE}/api/collections/clients/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ nom, email, telephone }),
  });

  if (!res.ok) throw new Error("Erreur à la création du client");
  return await res.json();
}
