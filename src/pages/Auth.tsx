import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";
import { logger } from "@/services/logger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const registrationSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string(),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Numéro de téléphone invalide"),
  address: z.string().min(10, "L'adresse doit être complète"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().regex(/^\d{5}$/, "Code postal invalide"),
  birthDate: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, "Vous devez avoir au moins 18 ans"),
  gender: z.enum(["male", "female", "other"]),
  preferredLanguage: z.string(),
  newsletter: z.boolean(),
  bio: z.string().max(500, "La biographie ne doit pas dépasser 500 caractères"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      newsletter: false,
      preferredLanguage: "fr",
    },
  });

  useEffect(() => {
    logger.info("Page d'authentification chargée");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info("État d'authentification changé:", { event, sessionExists: !!session });
      
      if (event === "SIGNED_IN" && session) {
        logger.info("Utilisateur connecté, redirection vers l'accueil");
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        logger.info("Utilisateur déconnecté");
        setError(null);
      }
      if (event === "PASSWORD_RECOVERY") {
        setError("Un email de récupération a été envoyé.");
      }

      const authError = (session as any)?.error;
      if (authError) {
        logger.error("Erreur d'authentification:", { error: authError });
        handleError(authError as AuthError);
      }
    });

    checkSession();

    return () => {
      logger.info("Nettoyage des écouteurs d'authentification");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      logger.error("Erreur lors de la vérification de la session:", { error });
      handleError(error);
      return;
    }
    if (session) {
      logger.info("Session existante trouvée, redirection vers l'accueil");
      navigate("/");
    }
  };

  const handleError = (error: AuthError) => {
    logger.error("Erreur d'authentification détaillée:", { 
      code: error.code,
      message: error.message,
      status: error.status
    });

    switch (error.message) {
      case "Invalid login credentials":
        setError("Identifiants invalides. Veuillez vérifier votre email et mot de passe.");
        break;
      case "Email not confirmed":
        setError("Veuillez confirmer votre email avant de vous connecter.");
        break;
      case "User not found":
        setError("Aucun utilisateur trouvé avec ces identifiants.");
        break;
      case "Invalid email":
        setError("L'adresse email n'est pas valide.");
        break;
      default:
        setError(error.message || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const onSubmit = async (data: RegistrationForm) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            address: data.address,
            city: data.city,
            postal_code: data.postalCode,
            birth_date: data.birthDate,
            gender: data.gender,
            preferred_language: data.preferredLanguage,
            newsletter: data.newsletter,
            bio: data.bio,
          }
        }
      });

      if (error) throw error;

      toast.success("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.");
      setIsRegistering(false);
    } catch (error) {
      if (error instanceof AuthError) {
        handleError(error);
      } else {
        logger.error("Erreur lors de l'inscription:", error);
        setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 glass-effect">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Buntudelice
          </h1>
          <p className="text-gray-300 mt-2">
            {isRegistering ? "Créez votre compte" : "Connectez-vous pour continuer"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isRegistering ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Homme</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Femme</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Autre</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Langue préférée</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une langue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Newsletter</FormLabel>
                      <FormDescription>
                        Recevoir les dernières nouvelles et promotions
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biographie</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Parlez-nous un peu de vous..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button type="submit" className="w-full">
                  S'inscrire
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsRegistering(false)}
                >
                  Déjà inscrit ? Se connecter
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <div className="text-sm text-gray-300 mb-4">
              <p>Exigences du mot de passe :</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Minimum 8 caractères</li>
                <li>Au moins une majuscule</li>
                <li>Au moins un chiffre</li>
                <li>Au moins un caractère spécial</li>
              </ul>
            </div>

            <SupabaseAuth 
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#10b981',
                      brandAccent: '#059669',
                    }
                  }
                }
              }}
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    button_label: 'Se connecter',
                    loading_button_label: 'Connexion en cours...',
                    email_input_placeholder: 'Votre adresse email',
                    password_input_placeholder: 'Votre mot de passe',
                  },
                  sign_up: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    button_label: "S'inscrire",
                    loading_button_label: 'Inscription en cours...',
                    email_input_placeholder: 'Votre adresse email',
                    password_input_placeholder: 'Choisissez un mot de passe',
                  }
                }
              }}
            />

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={() => setIsRegistering(true)}
            >
              Créer un compte
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default Auth;