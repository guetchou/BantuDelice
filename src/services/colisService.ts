// Service mock pour la gestion des colis
export type TrackingInfo = {
  status: string;
  steps: { label: string; date: string }[];
};

export async function trackColis(trackingNumber: string): Promise<TrackingInfo> {
  // Simule un appel API
  await new Promise(r => setTimeout(r, 700));
  if (trackingNumber === "123456") {
    return {
      status: "Livré",
      steps: [
        { label: "Pris en charge", date: "2024-07-16 09:00" },
        { label: "En transit", date: "2024-07-16 12:00" },
        { label: "En cours de livraison", date: "2024-07-16 15:00" },
        { label: "Livré", date: "2024-07-16 17:30" },
      ],
    };
  }
  return {
    status: "En cours de livraison",
    steps: [
      { label: "Pris en charge", date: "2024-07-17 08:00" },
      { label: "En transit", date: "2024-07-17 10:30" },
      { label: "En cours de livraison", date: "2024-07-17 13:00" },
    ],
  };
}

export async function calculerTarifColis(params: { from: string; to: string; weight: number; dimensions: string }): Promise<number> {
  // Simule un calcul de tarif
  await new Promise(r => setTimeout(r, 500));
  // Logique simple : base + poids
  const base = 2000;
  const poids = params.weight || 1;
  return base + poids * 300;
}

export type ColisHistoriqueItem = {
  id: string;
  date: string;
  from: string;
  to: string;
  status: string;
};

export async function getColisHistorique(): Promise<ColisHistoriqueItem[]> {
  await new Promise(r => setTimeout(r, 400));
  return [
    { id: "123456", date: "2024-07-16", from: "Plateau", to: "Poto-Poto", status: "Livré" },
    { id: "654321", date: "2024-07-15", from: "Bacongo", to: "Moungali", status: "En cours" },
  ];
}

export function genererNumeroColis(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function envoyerNotificationColis(type: 'email' | 'sms', destinataire: string, message: string): Promise<void> {
  // Simule l'envoi d'une notification
  await new Promise(r => setTimeout(r, 300));
  console.log(`[Notification ${type}] à ${destinataire}: ${message}`);
}

export type Colis = {
  id: string;
  sender: string;
  recipient: string;
  date: string;
  status: string;
};

let colisList: Colis[] = [
  { id: "123456", sender: "Plateau", recipient: "Poto-Poto", date: "2024-07-16", status: "Livré" },
  { id: "654321", sender: "Bacongo", recipient: "Moungali", date: "2024-07-15", status: "En cours" },
];

export function listerColis(): Colis[] {
  return [...colisList];
}

export function ajouterColis(colis: Omit<Colis, "id">): Colis {
  const newColis: Colis = { ...colis, id: genererNumeroColis() };
  colisList.push(newColis);
  return newColis;
}

export function supprimerColis(id: string): void {
  colisList = colisList.filter(c => c.id !== id);
}

export function changerStatutColis(id: string, status: string): void {
  colisList = colisList.map(c => c.id === id ? { ...c, status } : c);
}

export function filtrerColisParStatut(status: string): Colis[] {
  return colisList.filter(c => c.status === status);
}

export function exporterColisCSV(): string {
  const header = "id,sender,recipient,date,status";
  const rows = colisList.map(c => `${c.id},${c.sender},${c.recipient},${c.date},${c.status}`);
  return [header, ...rows].join("\n");
}

export async function exporterColisPDF(): Promise<Blob> {
  // Utilise jsPDF pour générer un PDF simple (mock)
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.text('Liste des Colis', 10, 10);
  let y = 20;
  doc.text('ID | Expéditeur | Destinataire | Date | Statut', 10, y);
  y += 10;
  colisList.forEach(c => {
    doc.text(`${c.id} | ${c.sender} | ${c.recipient} | ${c.date} | ${c.status}`, 10, y);
    y += 8;
  });
  return doc.output('blob');
} 