import { 
  type CreateColisRequest, 
  type UpdateColisRequest, 
  type PricingRequest,
  type NotificationApiData 
} from './colisApi';

// Types pour la validation
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface SecurityConfig {
  enableSanitization: boolean;
  enableRateLimiting: boolean;
  maxRequestsPerMinute: number;
  allowedOrigins: string[];
  requireAuthentication: boolean;
}

// Règles de validation
const VALIDATION_RULES = {
  phone: /^(\+242|0)[0-9]{8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  trackingNumber: /^BD[0-9]{8}$/,
  weight: { min: 0.1, max: 100 },
  price: { min: 100, max: 1000000 },
  name: { minLength: 2, maxLength: 100 },
  address: { minLength: 10, maxLength: 200 },
  description: { minLength: 5, maxLength: 500 }
};

class ColisValidationService {
  private config: SecurityConfig;
  private requestCounts = new Map<string, number>();
  private lastReset = Date.now();

  constructor(config?: Partial<SecurityConfig>) {
    this.config = {
      enableSanitization: true,
      enableRateLimiting: true,
      maxRequestsPerMinute: 60,
      allowedOrigins: ['http://localhost:3000', 'https://bantudelice.cg'],
      requireAuthentication: false,
      ...config
    };
  }

  // Validation des données de création de colis
  validateCreateColis(data: CreateColisRequest): ValidationResult {
    const errors: ValidationError[] = [];

    // Validation de l'expéditeur
    errors.push(...this.validatePerson(data.sender, 'sender'));

    // Validation du destinataire
    errors.push(...this.validatePerson(data.recipient, 'recipient'));

    // Validation du package
    errors.push(...this.validatePackage(data.package));

    // Validation du service
    errors.push(...this.validateService(data.service));

    // Validation des adresses
    if (data.sender.city === data.recipient.city) {
      errors.push({
        field: 'recipient.city',
        message: 'L\'expéditeur et le destinataire ne peuvent pas être dans la même ville',
        code: 'SAME_CITY'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validation des données de mise à jour
  validateUpdateColis(data: UpdateColisRequest): ValidationResult {
    const errors: ValidationError[] = [];

    if (data.status && !this.isValidStatus(data.status)) {
      errors.push({
        field: 'status',
        message: 'Statut invalide',
        code: 'INVALID_STATUS'
      });
    }

    if (data.currentLocation && data.currentLocation.length < 2) {
      errors.push({
        field: 'currentLocation',
        message: 'Localisation trop courte',
        code: 'LOCATION_TOO_SHORT'
      });
    }

    if (data.events) {
      data.events.forEach((event, index) => {
        errors.push(...this.validateTrackingEvent(event, `events[${index}]`));
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validation des données de tarification
  validatePricing(data: PricingRequest): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data.from || data.from.length < 2) {
      errors.push({
        field: 'from',
        message: 'Ville de départ requise',
        code: 'FROM_REQUIRED'
      });
    }

    if (!data.to || data.to.length < 2) {
      errors.push({
        field: 'to',
        message: 'Ville de destination requise',
        code: 'TO_REQUIRED'
      });
    }

    if (data.weight < VALIDATION_RULES.weight.min || data.weight > VALIDATION_RULES.weight.max) {
      errors.push({
        field: 'weight',
        message: `Le poids doit être entre ${VALIDATION_RULES.weight.min} et ${VALIDATION_RULES.weight.max} kg`,
        code: 'INVALID_WEIGHT'
      });
    }

    if (!data.type || !this.isValidPackageType(data.type)) {
      errors.push({
        field: 'type',
        message: 'Type de package invalide',
        code: 'INVALID_PACKAGE_TYPE'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validation d'une personne (expéditeur/destinataire)
  private validatePerson(person: any, prefix: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!person.name || person.name.length < VALIDATION_RULES.name.minLength) {
      errors.push({
        field: `${prefix}.name`,
        message: `Le nom doit contenir au moins ${VALIDATION_RULES.name.minLength} caractères`,
        code: 'NAME_TOO_SHORT'
      });
    }

    if (person.name && person.name.length > VALIDATION_RULES.name.maxLength) {
      errors.push({
        field: `${prefix}.name`,
        message: `Le nom ne peut pas dépasser ${VALIDATION_RULES.name.maxLength} caractères`,
        code: 'NAME_TOO_LONG'
      });
    }

    if (!person.phone || !VALIDATION_RULES.phone.test(person.phone)) {
      errors.push({
        field: `${prefix}.phone`,
        message: 'Numéro de téléphone invalide (format: +242XXXXXXXX ou 0XXXXXXXX)',
        code: 'INVALID_PHONE'
      });
    }

    if (person.email && !VALIDATION_RULES.email.test(person.email)) {
      errors.push({
        field: `${prefix}.email`,
        message: 'Adresse email invalide',
        code: 'INVALID_EMAIL'
      });
    }

    if (!person.address || person.address.length < VALIDATION_RULES.address.minLength) {
      errors.push({
        field: `${prefix}.address`,
        message: `L'adresse doit contenir au moins ${VALIDATION_RULES.address.minLength} caractères`,
        code: 'ADDRESS_TOO_SHORT'
      });
    }

    if (!person.city || person.city.length < 2) {
      errors.push({
        field: `${prefix}.city`,
        message: 'Ville requise',
        code: 'CITY_REQUIRED'
      });
    }

    return errors;
  }

  // Validation du package
  private validatePackage(package_: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!package_.type || !this.isValidPackageType(package_.type)) {
      errors.push({
        field: 'package.type',
        message: 'Type de package invalide',
        code: 'INVALID_PACKAGE_TYPE'
      });
    }

    if (package_.weight < VALIDATION_RULES.weight.min || package_.weight > VALIDATION_RULES.weight.max) {
      errors.push({
        field: 'package.weight',
        message: `Le poids doit être entre ${VALIDATION_RULES.weight.min} et ${VALIDATION_RULES.weight.max} kg`,
        code: 'INVALID_WEIGHT'
      });
    }

    if (!package_.description || package_.description.length < VALIDATION_RULES.description.minLength) {
      errors.push({
        field: 'package.description',
        message: `La description doit contenir au moins ${VALIDATION_RULES.description.minLength} caractères`,
        code: 'DESCRIPTION_TOO_SHORT'
      });
    }

    if (package_.value && (package_.value < 0 || package_.value > 10000000)) {
      errors.push({
        field: 'package.value',
        message: 'La valeur doit être entre 0 et 10 000 000 FCFA',
        code: 'INVALID_VALUE'
      });
    }

    return errors;
  }

  // Validation du service
  private validateService(service: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!service.type || !this.isValidServiceType(service.type)) {
      errors.push({
        field: 'service.type',
        message: 'Type de service invalide',
        code: 'INVALID_SERVICE_TYPE'
      });
    }

    if (typeof service.insurance !== 'boolean') {
      errors.push({
        field: 'service.insurance',
        message: 'L\'assurance doit être un booléen',
        code: 'INVALID_INSURANCE'
      });
    }

    if (typeof service.fragile !== 'boolean') {
      errors.push({
        field: 'service.fragile',
        message: 'Le statut fragile doit être un booléen',
        code: 'INVALID_FRAGILE'
      });
    }

    if (typeof service.express !== 'boolean') {
      errors.push({
        field: 'service.express',
        message: 'Le statut express doit être un booléen',
        code: 'INVALID_EXPRESS'
      });
    }

    return errors;
  }

  // Validation d'un événement de suivi
  private validateTrackingEvent(event: any, fieldPrefix: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!event.status || event.status.length < 2) {
      errors.push({
        field: `${fieldPrefix}.status`,
        message: 'Statut requis',
        code: 'STATUS_REQUIRED'
      });
    }

    if (!event.location || event.location.length < 2) {
      errors.push({
        field: `${fieldPrefix}.location`,
        message: 'Localisation requise',
        code: 'LOCATION_REQUIRED'
      });
    }

    if (!event.description || event.description.length < 5) {
      errors.push({
        field: `${fieldPrefix}.description`,
        message: 'Description trop courte',
        code: 'DESCRIPTION_TOO_SHORT'
      });
    }

    if (!event.icon || !this.isValidEventIcon(event.icon)) {
      errors.push({
        field: `${fieldPrefix}.icon`,
        message: 'Icône d\'événement invalide',
        code: 'INVALID_ICON'
      });
    }

    return errors;
  }

  // Validation d'un numéro de suivi
  validateTrackingNumber(trackingNumber: string): ValidationResult {
    const errors: ValidationError[] = [];

    if (!trackingNumber) {
      errors.push({
        field: 'trackingNumber',
        message: 'Numéro de suivi requis',
        code: 'TRACKING_NUMBER_REQUIRED'
      });
    } else if (!VALIDATION_RULES.trackingNumber.test(trackingNumber)) {
      errors.push({
        field: 'trackingNumber',
        message: 'Format de numéro de suivi invalide (format: BD12345678)',
        code: 'INVALID_TRACKING_FORMAT'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validation d'une notification
  validateNotification(notification: NotificationApiData): ValidationResult {
    const errors: ValidationError[] = [];

    if (!notification.title || notification.title.length < 2) {
      errors.push({
        field: 'title',
        message: 'Titre requis',
        code: 'TITLE_REQUIRED'
      });
    }

    if (!notification.message || notification.message.length < 5) {
      errors.push({
        field: 'message',
        message: 'Message requis',
        code: 'MESSAGE_REQUIRED'
      });
    }

    if (!this.isValidNotificationType(notification.type)) {
      errors.push({
        field: 'type',
        message: 'Type de notification invalide',
        code: 'INVALID_NOTIFICATION_TYPE'
      });
    }

    if (!this.isValidPriority(notification.priority)) {
      errors.push({
        field: 'priority',
        message: 'Priorité invalide',
        code: 'INVALID_PRIORITY'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Méthodes de validation des valeurs
  private isValidStatus(status: string): boolean {
    const validStatuses = [
      'En attente',
      'Pris en charge',
      'En transit',
      'En cours de livraison',
      'Livré',
      'Retardé',
      'Annulé'
    ];
    return validStatuses.includes(status);
  }

  private isValidPackageType(type: string): boolean {
    const validTypes = ['document', 'vêtement', 'électronique', 'alimentaire', 'autre'];
    return validTypes.includes(type);
  }

  private isValidServiceType(type: string): boolean {
    const validTypes = ['standard', 'express', 'premium'];
    return validTypes.includes(type);
  }

  private isValidEventIcon(icon: string): boolean {
    const validIcons = ['package', 'truck', 'check', 'alert'];
    return validIcons.includes(icon);
  }

  private isValidNotificationType(type: string): boolean {
    const validTypes = ['delivery', 'update', 'reminder', 'alert', 'info'];
    return validTypes.includes(type);
  }

  private isValidPriority(priority: string): boolean {
    const validPriorities = ['low', 'medium', 'high'];
    return validPriorities.includes(priority);
  }

  // Méthodes de sécurité
  sanitizeInput(input: string): string {
    if (!this.config.enableSanitization) return input;

    return input
      .replace(/[<>]/g, '') // Supprimer les balises HTML
      .replace(/javascript:/gi, '') // Supprimer les protocoles dangereux
      .trim();
  }

  sanitizeObject(obj: any): any {
    if (!this.config.enableSanitization) return obj;

    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  // Rate limiting
  checkRateLimit(clientId: string): boolean {
    if (!this.config.enableRateLimiting) return true;

    const now = Date.now();
    
    // Réinitialiser le compteur toutes les minutes
    if (now - this.lastReset > 60000) {
      this.requestCounts.clear();
      this.lastReset = now;
    }

    const currentCount = this.requestCounts.get(clientId) || 0;
    
    if (currentCount >= this.config.maxRequestsPerMinute) {
      return false;
    }

    this.requestCounts.set(clientId, currentCount + 1);
    return true;
  }

  // Validation d'origine
  validateOrigin(origin: string): boolean {
    return this.config.allowedOrigins.includes(origin);
  }

  // Validation d'authentification
  validateAuthentication(token?: string): boolean {
    if (!this.config.requireAuthentication) return true;
    return !!token && token.length > 0;
  }

  // Méthodes utilitaires
  formatValidationErrors(errors: ValidationError[]): string {
    return errors.map(error => `${error.field}: ${error.message}`).join(', ');
  }

  getValidationSummary(errors: ValidationError[]): { [key: string]: string[] } {
    const summary: { [key: string]: string[] } = {};
    
    errors.forEach(error => {
      if (!summary[error.field]) {
        summary[error.field] = [];
      }
      summary[error.field].push(error.message);
    });

    return summary;
  }
}

// Instance singleton
export const colisValidation = new ColisValidationService();

// Hook React pour la validation
export const useValidation = () => {
  const [errors, setErrors] = React.useState<ValidationError[]>([]);

  const validateCreateColis = React.useCallback((data: CreateColisRequest) => {
    const result = colisValidation.validateCreateColis(data);
    setErrors(result.errors);
    return result.isValid;
  }, []);

  const validateUpdateColis = React.useCallback((data: UpdateColisRequest) => {
    const result = colisValidation.validateUpdateColis(data);
    setErrors(result.errors);
    return result.isValid;
  }, []);

  const validatePricing = React.useCallback((data: PricingRequest) => {
    const result = colisValidation.validatePricing(data);
    setErrors(result.errors);
    return result.isValid;
  }, []);

  const validateTrackingNumber = React.useCallback((trackingNumber: string) => {
    const result = colisValidation.validateTrackingNumber(trackingNumber);
    setErrors(result.errors);
    return result.isValid;
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  const getFieldError = React.useCallback((field: string) => {
    return errors.find(error => error.field === field)?.message;
  }, [errors]);

  const hasErrors = React.useCallback(() => {
    return errors.length > 0;
  }, [errors]);

  return {
    errors,
    validateCreateColis,
    validateUpdateColis,
    validatePricing,
    validateTrackingNumber,
    clearErrors,
    getFieldError,
    hasErrors,
    formatErrors: colisValidation.formatValidationErrors.bind(colisValidation),
    getSummary: colisValidation.getValidationSummary.bind(colisValidation)
  };
};

// Hook pour la sécurité
export const useSecurity = () => {
  const [isRateLimited, setIsRateLimited] = React.useState(false);

  const checkRateLimit = React.useCallback((clientId: string) => {
    const allowed = colisValidation.checkRateLimit(clientId);
    setIsRateLimited(!allowed);
    return allowed;
  }, []);

  const sanitizeInput = React.useCallback((input: string) => {
    return colisValidation.sanitizeInput(input);
  }, []);

  const sanitizeObject = React.useCallback((obj: any) => {
    return colisValidation.sanitizeObject(obj);
  }, []);

  return {
    isRateLimited,
    checkRateLimit,
    sanitizeInput,
    sanitizeObject,
    validateOrigin: colisValidation.validateOrigin.bind(colisValidation),
    validateAuthentication: colisValidation.validateAuthentication.bind(colisValidation)
  };
};

export default colisValidation; 