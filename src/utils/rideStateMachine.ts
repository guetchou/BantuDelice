
/**
 * Machine à états pour la gestion des statuts de course de taxi
 */

// Définition des types
export type RideStatus = 
  | 'pending' // Course créée, en attente d'attribution
  | 'driver_assigned' // Chauffeur attribué
  | 'driver_en_route' // Chauffeur en route vers le point de prise en charge
  | 'driver_arrived' // Chauffeur arrivé au point de prise en charge
  | 'ride_in_progress' // Course en cours (passager à bord)
  | 'arrived_at_destination' // Arrivé à destination
  | 'completed' // Course terminée et payée
  | 'cancelled' // Course annulée
  | 'rejected'; // Course rejetée par tous les chauffeurs

export type RideEvent =
  | 'ASSIGN_DRIVER'
  | 'DRIVER_ON_WAY'
  | 'DRIVER_ARRIVED'
  | 'START_RIDE'
  | 'ARRIVE_AT_DESTINATION'
  | 'COMPLETE_RIDE'
  | 'CANCEL_RIDE'
  | 'REJECT_RIDE';

export interface RideState {
  status: RideStatus;
  allowedEvents: RideEvent[];
  canCancel: boolean;
  label: string;
  description: string;
  icon?: string;
  progressPercentage: number;
}

// Définition de la machine à états
export const rideStateMachine: Record<RideStatus, RideState> = {
  pending: {
    status: 'pending',
    allowedEvents: ['ASSIGN_DRIVER', 'CANCEL_RIDE', 'REJECT_RIDE'],
    canCancel: true,
    label: 'En attente',
    description: 'Recherche d\'un chauffeur disponible...',
    icon: 'search',
    progressPercentage: 10
  },
  driver_assigned: {
    status: 'driver_assigned',
    allowedEvents: ['DRIVER_ON_WAY', 'CANCEL_RIDE'],
    canCancel: true,
    label: 'Chauffeur attribué',
    description: 'Un chauffeur a accepté votre course',
    icon: 'check-circle',
    progressPercentage: 20
  },
  driver_en_route: {
    status: 'driver_en_route',
    allowedEvents: ['DRIVER_ARRIVED', 'CANCEL_RIDE'],
    canCancel: true,
    label: 'En approche',
    description: 'Votre chauffeur est en route vers vous',
    icon: 'navigation',
    progressPercentage: 30
  },
  driver_arrived: {
    status: 'driver_arrived',
    allowedEvents: ['START_RIDE', 'CANCEL_RIDE'],
    canCancel: true,
    label: 'Chauffeur arrivé',
    description: 'Votre chauffeur est arrivé au point de prise en charge',
    icon: 'map-pin',
    progressPercentage: 50
  },
  ride_in_progress: {
    status: 'ride_in_progress',
    allowedEvents: ['ARRIVE_AT_DESTINATION'],
    canCancel: false,
    label: 'En cours',
    description: 'Votre course est en cours',
    icon: 'clock',
    progressPercentage: 75
  },
  arrived_at_destination: {
    status: 'arrived_at_destination',
    allowedEvents: ['COMPLETE_RIDE'],
    canCancel: false,
    label: 'Arrivé à destination',
    description: 'Vous êtes arrivé à destination',
    icon: 'flag',
    progressPercentage: 90
  },
  completed: {
    status: 'completed',
    allowedEvents: [],
    canCancel: false,
    label: 'Terminée',
    description: 'Course terminée avec succès',
    icon: 'check',
    progressPercentage: 100
  },
  cancelled: {
    status: 'cancelled',
    allowedEvents: [],
    canCancel: false,
    label: 'Annulée',
    description: 'Course annulée',
    icon: 'x',
    progressPercentage: 100
  },
  rejected: {
    status: 'rejected',
    allowedEvents: [],
    canCancel: false,
    label: 'Rejetée',
    description: 'Aucun chauffeur disponible pour le moment',
    icon: 'alert-triangle',
    progressPercentage: 100
  }
};

// Transitions d'état
export const transitions: Record<RideStatus, Partial<Record<RideEvent, RideStatus>>> = {
  pending: {
    ASSIGN_DRIVER: 'driver_assigned',
    CANCEL_RIDE: 'cancelled',
    REJECT_RIDE: 'rejected'
  },
  driver_assigned: {
    DRIVER_ON_WAY: 'driver_en_route',
    CANCEL_RIDE: 'cancelled'
  },
  driver_en_route: {
    DRIVER_ARRIVED: 'driver_arrived',
    CANCEL_RIDE: 'cancelled'
  },
  driver_arrived: {
    START_RIDE: 'ride_in_progress',
    CANCEL_RIDE: 'cancelled'
  },
  ride_in_progress: {
    ARRIVE_AT_DESTINATION: 'arrived_at_destination'
  },
  arrived_at_destination: {
    COMPLETE_RIDE: 'completed'
  },
  completed: {},
  cancelled: {},
  rejected: {}
};

/**
 * Détermine le prochain état en fonction de l'état actuel et de l'événement
 * @param currentStatus État actuel
 * @param event Événement
 * @returns Prochain état ou null si la transition n'est pas valide
 */
export function getNextStatus(currentStatus: RideStatus, event: RideEvent): RideStatus | null {
  const nextStatus = transitions[currentStatus][event];
  return nextStatus || null;
}

/**
 * Vérifie si un événement est autorisé pour l'état actuel
 * @param currentStatus État actuel
 * @param event Événement
 * @returns Vrai si l'événement est autorisé
 */
export function isEventAllowed(currentStatus: RideStatus, event: RideEvent): boolean {
  return rideStateMachine[currentStatus].allowedEvents.includes(event);
}

/**
 * Obtient l'état actuel complet
 * @param status État actuel
 * @returns Objet d'état complet
 */
export function getRideState(status: RideStatus): RideState {
  return rideStateMachine[status];
}

/**
 * Obtient un message d'erreur pour une transition invalide
 * @param currentStatus État actuel
 * @param event Événement
 * @returns Message d'erreur
 */
export function getInvalidTransitionMessage(currentStatus: RideStatus, event: RideEvent): string {
  return `Transition invalide: impossible de passer de "${rideStateMachine[currentStatus].label}" à l'événement "${event}"`;
}
