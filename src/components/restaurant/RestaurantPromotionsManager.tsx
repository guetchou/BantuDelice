import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from 'date-fns';
import { DateRange } from "react-day-picker";
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { supabase } from '@/integrations/supabase/client';
import { ReloadIcon, Copy, CheckCircle, AlertTriangle, Plus, Trash2, LoaderIcon } from "lucide-react";

interface RestaurantPromotionsManagerProps {
  restaurantId: string;
}

const promotionSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.number().min(1).max(99),
  valid_from: z.date(),
  valid_to: z.date(),
  promotion_hours: z.array(z.object({
    days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])),
    start: z.string(),
    end: z.string(),
  })).optional(),
  conditions: z.array(z.string()).optional(),
  min_order_value: z.number().optional(),
});

const RestaurantPromotionsManager: React.FC<RestaurantPromotionsManagerProps> = ({ restaurantId }) => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copiedPromotionId, setCopiedPromotionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [promotionToDeleteId, setPromotionToDeleteId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof promotionSchema>>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: "",
      description: "",
      discount_type: 'percentage',
      discount_value: 10,
      valid_from: range?.from || new Date(),
      valid_to: range?.to || new Date(),
    },
  })

  function handleDateChange(date: DateRange | undefined) {
    setRange(date);
    form.setValue("valid_from", date?.from || new Date());
    form.setValue("valid_to", date?.to || new Date());
  }

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('restaurant_promotions')
          .select('*')
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error fetching promotions:', error);
          toast({
            title: "Error",
            description: "Failed to fetch promotions",
            variant: "destructive",
          });
        } else {
          setPromotions(data || []);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch promotions",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [restaurantId]);

  const onSubmit = async (values: z.infer<typeof promotionSchema>) => {
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('restaurant_promotions')
        .insert([{
          ...values,
          restaurant_id: restaurantId,
          valid_from: values.valid_from.toISOString(),
          valid_to: values.valid_to.toISOString(),
        }])
        .select();

      if (error) {
        console.error('Error creating promotion:', error);
        toast({
          title: "Error",
          description: "Failed to create promotion",
          variant: "destructive",
        });
      } else {
        setPromotions([...promotions, data[0]]);
        toast({
          title: "Success",
          description: "Promotion created successfully",
        });
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
      toast({
        title: "Error",
        description: "Failed to create promotion",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyPromotion = async (promotion: any) => {
    setIsCopying(true);
    setCopiedPromotionId(promotion.id);
    try {
      const { data, error } = await supabase
        .from('restaurant_promotions')
        .insert([{
          ...promotion,
          restaurant_id: restaurantId,
          title: `${promotion.title} (Copy)`,
          id: undefined,
          valid_from: new Date().toISOString(),
          valid_to: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        }])
        .select();

      if (error) {
        console.error('Error copying promotion:', error);
        toast({
          title: "Error",
          description: "Failed to copy promotion",
          variant: "destructive",
        });
      } else {
        setPromotions([...promotions, data[0]]);
        toast({
          title: "Success",
          description: "Promotion copied successfully",
        });
      }
    } catch (error) {
      console.error('Error copying promotion:', error);
      toast({
        title: "Error",
        description: "Failed to copy promotion",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
      setCopiedPromotionId(null);
    }
  };

  const deletePromotion = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('restaurant_promotions')
        .delete()
        .eq('id', promotionToDeleteId);

      if (error) {
        console.error('Error deleting promotion:', error);
        toast({
          title: "Error",
          description: "Failed to delete promotion",
          variant: "destructive",
        });
      } else {
        setPromotions(promotions.filter(promotion => promotion.id !== promotionToDeleteId));
        toast({
          title: "Success",
          description: "Promotion deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast({
        title: "Error",
        description: "Failed to delete promotion",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setPromotionToDeleteId(null);
      setOpen(false);
    }
  };

  const togglePromotionStatus = async (promotion: any) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_promotions')
        .update({ status: promotion.status === 'active' ? 'inactive' : 'active' })
        .eq('id', promotion.id)
        .select();

      if (error) {
        console.error('Error updating promotion status:', error);
        toast({
          title: "Error",
          description: "Failed to update promotion status",
          variant: "destructive",
        });
      } else {
        setPromotions(promotions.map(p => p.id === promotion.id ? data[0] : p));
        toast({
          title: "Success",
          description: "Promotion status updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating promotion status:', error);
      toast({
        title: "Error",
        description: "Failed to update promotion status",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Promotions</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create Promotion</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Promotion</DialogTitle>
              <DialogDescription>
                Create a new promotion for your restaurant.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discount_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a discount type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Discount Value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="valid_from"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Valid From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                            disabled={(date) =>
                              date < new Date()
                            }
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
                  name="valid_to"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Valid To</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <LoaderIcon className="mr-2 h-8 w-8 animate-spin" />
        </div>
      ) : promotions.length === 0 ? (
        <div className="flex items-center justify-center">
          <AlertTriangle className="mr-2 h-4 w-4" />
          <span>No promotions found</span>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your restaurant promotions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Valid From</TableHead>
              <TableHead>Valid To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell className="font-medium">{promotion.title}</TableCell>
                <TableCell>{promotion.description}</TableCell>
                <TableCell>
                  {promotion.discount_type === 'percentage' ? `${promotion.discount_value}%` : `${promotion.discount_value} XAF`}
                </TableCell>
                <TableCell>{new Date(promotion.valid_from).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(promotion.valid_to).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPromotion(promotion)}
                      disabled={isCopying && copiedPromotionId === promotion.id}
                    >
                      {isCopying && copiedPromotionId === promotion.id ? (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Copy className="mr-2 h-4 w-4" />
                      )}
                      Copy
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your promotion.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                          </DialogClose>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              setPromotionToDeleteId(promotion.id);
                              deletePromotion();
                            }}
                            disabled={isDeleting}
                          >
                            {isDeleting && (
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      className={cn("w-full", 
                        promotion.status === 'active' ? "bg-green-500 hover:bg-green-600" : 
                        promotion.status === 'scheduled' ? "bg-blue-500 hover:bg-blue-600" :
                        promotion.status === 'expired' ? "bg-gray-500 hover:bg-gray-600" : ""
                      )}
                      onClick={() => togglePromotionStatus(promotion)}
                    >
                      {promotion.status === 'active' ? 'Deactivate' : 'Activate'} Promotion
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default RestaurantPromotionsManager;
