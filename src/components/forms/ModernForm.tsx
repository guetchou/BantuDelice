
import { useState } from 'react';
import { 
  Check, 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Clock, 
  Info,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'date' | 'time' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  icon?: any;
  help?: string;
}

interface ModernFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function ModernForm({
  title,
  description,
  fields,
  submitLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
  onSubmit,
  onCancel
}: ModernFormProps) {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState<Record<string, boolean>>({});

  const handleChange = (id: string, value: any) => {
    setFormState((prev) => ({ ...prev, [id]: value }));
    
    // Validation en temps réel
    if (errors[id]) {
      validate(id, value);
    }
  };

  const validate = (id: string, value: any) => {
    const field = fields.find(f => f.id === id);
    
    if (!field) return;
    
    if (field.required && !value) {
      setErrors(prev => ({ ...prev, [id]: 'Ce champ est requis' }));
      return false;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, [id]: 'Adresse email invalide' }));
        return false;
      }
    }
    
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        setErrors(prev => ({ ...prev, [id]: 'Numéro de téléphone invalide' }));
        return false;
      }
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
    
    return true;
  };

  const validateAll = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formState[field.id];
      
      if (field.required && !value) {
        newErrors[field.id] = 'Ce champ est requis';
        isValid = false;
      } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = 'Adresse email invalide';
          isValid = false;
        }
      } else if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          newErrors[field.id] = 'Numéro de téléphone invalide';
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formState);
      }
      toast.success("Formulaire soumis avec succès");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la soumission");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHelp = (id: string) => {
    setShowHelp(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (field: FormField) => {
    if (field.icon) return field.icon;
    
    switch (field.type) {
      case 'email': return Mail;
      case 'tel': return Phone;
      case 'date': return Calendar;
      case 'time': return Clock;
      default: return field.id.includes('name') ? User : field.id.includes('company') ? Building : null;
    }
  };

  const renderField = (field: FormField) => {
    const Icon = getIcon(field);
    const error = errors[field.id];
    const value = formState[field.id] || '';
    
    const inputClasses = `
      modern-input pl-10
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
      ${!error && value ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
    `;
    
    const iconClasses = `
      absolute left-3 top-1/2 transform -translate-y-1/2 
      ${error ? 'text-red-500' : value ? 'text-green-500' : 'text-muted-foreground'}
    `;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div className="relative animate-fade-in">
            {Icon && <Icon className={iconClasses} size={18} />}
            <input
              id={field.id}
              type={field.type}
              className={inputClasses}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={(e) => validate(field.id, e.target.value)}
            />
            {error ? (
              <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
            ) : value ? (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
            ) : null}
          </div>
        );
        
      case 'select':
        return (
          <div className="relative animate-fade-in">
            {Icon && <Icon className={iconClasses} size={18} />}
            <select
              id={field.id}
              className={inputClasses}
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={(e) => validate(field.id, e.target.value)}
            >
              <option value="">{field.placeholder || 'Sélectionner...'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
        
      case 'textarea':
        return (
          <div className="relative animate-fade-in">
            <textarea
              id={field.id}
              className={`${inputClasses} pl-3 pt-3 min-h-[120px]`}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={(e) => validate(field.id, e.target.value)}
            />
          </div>
        );
        
      case 'date':
      case 'time':
        return (
          <div className="relative animate-fade-in">
            {Icon && <Icon className={iconClasses} size={18} />}
            <input
              id={field.id}
              type={field.type}
              className={inputClasses}
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={(e) => validate(field.id, e.target.value)}
            />
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center space-x-3 animate-fade-in">
            <input
              id={field.id}
              type="checkbox"
              className="w-5 h-5 rounded border-input checked:bg-primary focus:ring-primary"
              checked={!!value}
              onChange={(e) => handleChange(field.id, e.target.checked)}
            />
            <label htmlFor={field.id} className="text-sm">
              {field.label}
            </label>
          </div>
        );
        
      case 'radio':
        return (
          <div className="space-y-2 animate-fade-in">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleChange(field.id, option.value)}
                  className="w-4 h-4 text-primary border-input focus:ring-primary"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="card-gradient p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient">{title}</h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="space-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex justify-between items-center">
              <label htmlFor={field.id} className="text-sm font-medium flex items-center">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.help && (
                <button
                  type="button"
                  onClick={() => toggleHelp(field.id)}
                  className="text-muted-foreground hover:text-primary transition-colors p-1"
                >
                  <Info size={14} />
                </button>
              )}
            </div>
            
            {showHelp[field.id] && field.help && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md mb-2 animate-fade-in">
                {field.help}
              </div>
            )}
            
            {renderField(field)}
            
            {errors[field.id] && (
              <p className="text-red-500 text-xs flex items-center animate-fade-in">
                <X size={12} className="mr-1" />
                {errors[field.id]}
              </p>
            )}
          </div>
        ))}
        
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
              disabled={isSubmitting}
            >
              {cancelLabel}
            </button>
          )}
          
          <button
            type="submit"
            className="fancy-button flex items-center justify-center min-w-[120px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
