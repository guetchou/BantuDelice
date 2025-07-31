
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Check, X, Info, Crown, Star, Award, Users, Calendar, Clock, ShoppingBag, Rocket } from 'lucide-react';
import Layout from '@/components/Layout';
import { SubscriptionInterval } from '@/types/subscription';

const SubscriptionPlans = () => {
  const [billingInterval, setBillingInterval] = useState<SubscriptionInterval>('monthly');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = (tier: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate(`/subscription/checkout?plan=${tier}&interval=${billingInterval}`);
    }, 1000);
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for new restaurants getting started',
      features: [
        'Basic restaurant profile',
        'Menu management',
        'Up to 50 orders per month',
        'Standard support (24-48h)',
        'Basic analytics'
      ],
      notIncluded: [
        'Priority placement',
        'Marketing campaigns',
        'Dedicated account manager',
        'Advanced analytics'
      ],
      price: {
        monthly: 29,
        yearly: 290
      },
      popular: false,
      icon: ShoppingBag
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For growing restaurants with increasing orders',
      features: [
        'Everything in Starter',
        'Unlimited orders',
        'Priority placement in search results',
        'Priority support (12h)',
        'Advanced analytics',
        'Marketing tools',
        'Online reservations'
      ],
      notIncluded: [
        'Dedicated account manager',
        'Custom integrations'
      ],
      price: {
        monthly: 79,
        yearly: 790
      },
      popular: true,
      icon: Award
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For established restaurants with high order volumes',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Premium placement in search results',
        'VIP support (4h)',
        'Custom integrations',
        'API access',
        'Advanced marketing campaigns',
        'Competitor analysis'
      ],
      notIncluded: [],
      price: {
        monthly: 199,
        yearly: 1990
      },
      popular: false,
      icon: Rocket
    }
  ];

  const planFeatures = [
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: 'Unlimited Customers',
      description: 'Grow your customer base without limits'
    },
    {
      icon: <Calendar className="h-5 w-5 text-primary" />,
      title: 'Flexible Scheduling',
      description: 'Manage your business hours and availability'
    },
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      title: 'Real-time Orders',
      description: 'Get instant notifications for new orders'
    }
  ];

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div className="space-y-6 mb-12">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="mb-2">
            Restaurant Subscription
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">Choose Your Restaurant Plan</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Select the perfect plan for your restaurant's needs. All plans include core features to help you grow your business.
          </p>
        </div>

        <div className="flex justify-center">
          <Tabs
            defaultValue="monthly"
            className="w-full max-w-md"
            onValueChange={(value) => setBillingInterval(value as SubscriptionInterval)}
          >
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 w-full max-w-xs">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly <Badge variant="outline" className="ml-2 bg-primary/10">Save 15%</Badge>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="monthly" className="mt-0" />
            <TabsContent value="yearly" className="mt-0" />
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          return (
            <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'ring-2 ring-primary shadow-lg relative' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary text-white px-3 py-1">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className={plan.popular ? 'pt-8' : ''}>
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-primary/10 mr-3">
                    <PlanIcon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <p className="text-3xl font-bold">
                    ${plan.price[billingInterval]}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{billingInterval === 'monthly' ? 'month' : 'year'}
                    </span>
                  </p>
                  {billingInterval === 'yearly' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${Math.round(plan.price.monthly * 12)} billed yearly (save ${Math.round(plan.price.monthly * 12) - plan.price.yearly})
                    </p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">What's included:</h4>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-1 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="text-sm font-medium text-muted-foreground">Not included:</h4>
                      <ul className="space-y-2.5">
                        {plan.notIncluded.map((feature, index) => (
                          <li key={index} className="flex items-start text-muted-foreground">
                            <X className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {loading ? "Processing..." : "Subscribe Now"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">All Plans Include</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planFeatures.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mt-16 bg-muted/50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Need a custom plan?</h3>
            <p className="text-sm text-muted-foreground">
              Contact us for a plan tailored to your specific needs
            </p>
          </div>
        </div>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
