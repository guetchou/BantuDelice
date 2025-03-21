
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Building2, ChevronLeft, Shield, Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { SubscriptionInterval } from '@/types/subscription';

const planDetails = {
  starter: {
    name: 'Starter',
    monthly: 29,
    yearly: 290,
    features: [
      'Basic restaurant profile',
      'Menu management',
      'Up to 50 orders per month',
      'Standard support'
    ]
  },
  professional: {
    name: 'Professional',
    monthly: 79,
    yearly: 790,
    features: [
      'Everything in Starter',
      'Unlimited orders',
      'Priority placement',
      'Priority support',
      'Advanced analytics'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    monthly: 199,
    yearly: 1990,
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Premium placement',
      'VIP support',
      'Custom integrations'
    ]
  }
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'starter';
  const interval = (searchParams.get('interval') || 'monthly') as SubscriptionInterval;
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (planId && planDetails[planId as keyof typeof planDetails]) {
      setPlan(planDetails[planId as keyof typeof planDetails]);
    } else {
      setPlan(planDetails.starter);
    }
  }, [planId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Subscription Successful",
        description: `You have successfully subscribed to the ${plan?.name} plan.`,
      });
      navigate('/restaurant/dashboard');
    }, 2000);
  };

  if (!plan) return <div>Loading...</div>;

  const amount = interval === 'monthly' ? plan.monthly : plan.yearly;
  const tax = amount * 0.05; // 5% tax
  const total = amount + tax;

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Plans
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Complete Your Subscription</h1>
              <p className="text-muted-foreground mt-2">
                You're subscribing to the {plan.name} plan, billed {interval}.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Enter your billing details to complete your subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Billing Address</Label>
                    <Input id="address" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" required />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <RadioGroup 
                      defaultValue="credit-card" 
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-5 w-5" />
                            <span>Credit Card</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="invoice" id="invoice" />
                        <Label htmlFor="invoice" className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <Building2 className="mr-2 h-5 w-5" />
                            <span>Pay by Invoice</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {paymentMethod === 'credit-card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" required />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'invoice' && (
                    <div className="rounded-md bg-muted p-4">
                      <p className="text-sm">
                        We'll send an invoice to your email address. Payment is due within 15 days.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : `Complete Subscription - $${total.toFixed(2)}`}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{plan.name} Plan ({interval})</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="bg-primary/5 rounded-md p-3 text-sm">
                <p className="font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-primary" />
                  What's included:
                </p>
                <ul className="mt-2 space-y-1.5">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>
                  By completing your purchase, you agree to our{' '}
                  <a href="#" className="underline underline-offset-2">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="underline underline-offset-2">Privacy Policy</a>.
                </p>
                <p className="mt-1">
                  You can cancel your subscription at any time from your dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
