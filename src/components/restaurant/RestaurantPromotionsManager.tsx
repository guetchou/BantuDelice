import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RestaurantPromotion, DiscountType } from '@/types/restaurantPromotion';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Percent, Trash2, Tag, Clock, DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isPast, isAfter, isBefore, addDays } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from "@/lib/utils";

interface RestaurantPromotionsManagerProps {
  restaurantId: string;
  isOwner?: boolean;
}

const promotionFormSchema = z.object({
  title: z.string().min(3, {
    message: "Le titre doit comporter au moins 3 caractères",
  }),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed_amount', 'free_delivery'] as const),
  discount_value: z.union([
    z.number().min(1, {
      message: "La valeur de la réduction doit être supérieure à 0",
    }),
    z.number().optional()
  ]).optional(),
  min_order_amount: z.union([
    z.number().min(0, {
      message: "Le montant minimum doit être supérieur ou égal à 0",
    }),
    z.number().optional()
  ]).optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  active: z.boolean().default(true),
  conditions: z.array(z.string()).optional(),
});

type PromotionFormValues = z.infer<typeof promotionFormSchema>;

export function RestaurantPromotionsManager({ 
  restaurantId,
  isOwner = true 
}: RestaurantPromotionsManagerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<RestaurantPromotion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: undefined,
      min_order_amount: undefined,
      start_date: new Date(),
      end_date: addDays(new Date(), 7),
      active: true,
      conditions: [],
    },
  });
  
  useEffect(() => {
    if (restaurantId) {
      fetchPromotions();
    }
  }, [restaurantId]);
  
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('restaurant_promotions')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de charger les promotions",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (values: PromotionFormValues) => {
    try {
      setLoading(true);
      
      if (values.discount_type !== 'free_delivery' && !values.discount_value) {
        toast({
          title: 'Erreur',
          description: "La valeur de la réduction est requise",
          variant: 'destructive'
        });
        return;
      }
      
      if (values.discount_type === 'percentage' && values.discount_value && values.discount_value > 100) {
        toast({
          title: 'Erreur',
          description: "Le pourcentage ne peut pas dépasser 100%",
          variant: 'destructive'
        });
        return;
      }
      
      if (values.start_date && values.end_date && isAfter(values.start_date, values.end_date)) {
        toast({
          title: 'Erreur',
          description: "La date de début doit être antérieure à la date de fin",
          variant: 'destructive'
        });
        return;
      }
      
      const promotionData: RestaurantPromotion = {
        restaurant_id: restaurantId,
        title: values.title,
        description: values.description || null,
        discount_type: values.discount_type,
        discount_value: values.discount_type === 'free_delivery' ? null : values.discount_value,
        min_order_amount: values.min_order_amount || null,
        start_date: values.start_date ? values.start_date.toISOString() : null,
        end_date: values.end_date ? values.end_date.toISOString() : null,
        active: values.active,
        conditions: values.conditions || null
      };
      
      if (editingId) {
        const { error } = await supabase
          .from('restaurant_promotions')
          .update(promotionData)
          .eq('id', editingId);
          
        if (error) throw error;
        
        toast({
          title: 'Promotion mise à jour',
          description: "La promotion a été mise à jour avec succès"
        });
      } else {
        const { error } = await supabase
          .from('restaurant_promotions')
          .insert(promotionData);
          
        if (error) throw error;
        
        toast({
          title: 'Promotion créée',
          description: "La promotion a été créée avec succès"
        });
      }
      
      form.reset();
      setShowForm(false);
      setEditingId(null);
      fetchPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'enregistrer la promotion",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const editPromotion = (promotion: RestaurantPromotion) => {
    setEditingId(promotion.id);
    
    form.reset({
      title: promotion.title,
      description: promotion.description || '',
      discount_type: promotion.discount_type,
      discount_value: promotion.discount_value || undefined,
      min_order_amount: promotion.min_order_amount || undefined,
      start_date: promotion.start_date ? new Date(promotion.start_date) : undefined,
      end_date: promotion.end_date ? new Date(promotion.end_date) : undefined,
      active: promotion.active,
      conditions: promotion.conditions || [],
    });
    
    setShowForm(true);
  };
  
  const deletePromotion = async (id: string) => {
    try {
      setDeletingId(id);
      
      const { error } = await supabase
        .from('restaurant_promotions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Promotion supprimée',
        description: "La promotion a été supprimée avec succès"
      });
      
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer la promotion",
        variant: 'destructive'
      });
    } finally {
      setDeletingId(null);
    }
  };
  
  const togglePromotionStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('restaurant_promotions')
        .update({ active: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: currentStatus ? 'Promotion désactivée' : 'Promotion activée',
        description: currentStatus 
          ? "La promotion a été désactivée" 
          : "La promotion a été activée"
      });
      
      setPromotions(prevPromotions =>
        prevPromotions.map(promo =>
          promo.id === id ? { ...promo, active: !currentStatus } : promo
        )
      );
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de modifier le statut de la promotion",
        variant: 'destructive'
      });
    }
  };
  
  const formatDiscountValue = (promotion: RestaurantPromotion) => {
    switch (promotion.discount_type) {
      case 'percentage':
        return `${promotion.discount_value}%`;
      case 'fixed_amount':
        return `${promotion.discount_value?.toLocaleString('fr-FR')} XAF`;
      case 'free_delivery':
        return 'Livraison gratuite';
      default:
        return '';
    }
  };
  
  const getPromotionIcon = (type: DiscountType) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'fixed_amount':
        return <DollarSign className="w-4 h-4" />;
      case 'free_delivery':
        return <Clock className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };
  
  const isPromotionExpired = (promotion: RestaurantPromotion) => {
    if (!promotion.end_date) return false;
    return isPast(new Date(promotion.end_date));
  };
  
  const isPromotionFuture = (promotion: RestaurantPromotion) => {
    if (!promotion.start_date) return false;
    return isAfter(new Date(promotion.start_date), new Date());
  };

  const getPromotionBadgeVariant = (promotion: RestaurantPromotion) => {
    if (!promotion.active) return "outline";
    if (isPromotionExpired(promotion)) return "destructive";
    if (isPromotionFuture(promotion)) return "secondary";
    return "success";
  };

  if (loading && promotions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="mr-2 h-6 w-6" />
            Gestion des promotions
          </CardTitle>
          <CardDescription>
            Créez et gérez des offres spéciales pour votre restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOwner && !showForm && (
            <Button 
              onClick={() => {
                form.reset({
                  title: '',
                  description: '',
                  discount_type: 'percentage',
                  discount_value: undefined,
                  min_order_amount: undefined,
                  start_date: new Date(),
                  end_date: addDays(new Date(), 7),
                  active: true,
                  conditions: [],
                });
                setEditingId(null);
                setShowForm(true);
              }}
              className="mb-6"
            >
              Ajouter une promotion
            </Button>
          )}
          
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingId ? 'Modifier la promotion' : 'Nouvelle promotion'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titre de la promotion</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Happy Hour" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="discount_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type de promotion</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                                <SelectItem value="fixed_amount">Montant fixe (XAF)</SelectItem>
                                <SelectItem value="free_delivery">Livraison gratuite</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {form.watch('discount_type') !== 'free_delivery' && (
                        <FormField
                          control={form.control}
                          name="discount_value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {form.watch('discount_type') === 'percentage' ? 'Pourcentage' : 'Montant'}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder={form.watch('discount_type') === 'percentage' ? "Ex: 15" : "Ex: 1000"} 
                                  {...field}
                                  value={field.value?.toString() || ''}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormDescription>
                                {form.watch('discount_type') === 'percentage' 
                                  ? 'Indiquez un pourcentage entre 1 et 100'
                                  : 'Indiquez le montant de la réduction en XAF'
                                }
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={form.control}
                        name="min_order_amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Montant minimum de commande</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Ex: 5000" 
                                {...field}
                                value={field.value?.toString() || ''}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormDescription>
                              Laissez vide s'il n'y a pas de minimum
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date de début</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Choisir une date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date de fin</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Choisir une date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  disabled={(date) => 
                                    form.watch('start_date') ? 
                                    isBefore(date, form.watch('start_date')) : 
                                    false
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Détails supplémentaires sur la promotion..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Promotion active
                            </FormLabel>
                            <FormDescription>
                              Activez ou désactivez cette promotion
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
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="default"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => setShowForm(false)}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {editingId ? 'Mettre à jour' : 'Créer la promotion'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          {promotions.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-md">
              <Tag className="h-10 w-10 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune promotion</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par créer votre première promotion.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {promotions.map((promotion) => (
                <Card key={promotion.id} className={cn(
                  "transition-opacity",
                  (!promotion.active || isPromotionExpired(promotion)) && "opacity-70"
                )}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{promotion.title}</h3>
                          <Badge variant={getPromotionBadgeVariant(promotion)}>
                            {!promotion.active 
                              ? 'Inactive' 
                              : isPromotionExpired(promotion)
                                ? 'Expirée'
                                : isPromotionFuture(promotion)
                                  ? 'À venir'
                                  : 'Active'
                            }
                          </Badge>
                        </div>
                        
                        {promotion.description && (
                          <p className="text-sm text-gray-500">{promotion.description}</p>
                        )}
                        
                        <div className="flex items-center gap-1 text-sm font-medium mt-1">
                          {getPromotionIcon(promotion.discount_type)}
                          <span>{formatDiscountValue(promotion)}</span>
                          {promotion.min_order_amount && (
                            <span className="text-gray-500 ml-1">
                              (Min: {promotion.min_order_amount.toLocaleString('fr-FR')} XAF)
                            </span>
                          )}
                        </div>
                        
                        {(promotion.start_date || promotion.end_date) && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {promotion.start_date && format(new Date(promotion.start_date), "dd/MM/yyyy")}
                            {promotion.start_date && promotion.end_date && ' - '}
                            {promotion.end_date && format(new Date(promotion.end_date), "dd/MM/yyyy")}
                          </div>
                        )}
                      </div>
                      
                      {isOwner && (
                        <div className="flex items-center gap-2 self-start">
                          <Switch
                            id={`active-${promotion.id}`}
                            checked={promotion.active}
                            onCheckedChange={() => togglePromotionStatus(promotion.id, promotion.active)}
                            disabled={deletingId === promotion.id}
                          />
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editPromotion(promotion)}
                          >
                            Modifier
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deletePromotion(promotion.id)}
                            disabled={deletingId === promotion.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
