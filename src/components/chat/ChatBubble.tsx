import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, MessageSquare, MessageSquareMore } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: Phone,
      label: "Appelez-nous",
      action: () => window.location.href = "tel:+123456789"
    },
    {
      icon: MessageSquare,
      label: "Chat en Direct",
      action: () => setIsOpen(true)
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      action: () => window.open("https://wa.me/123456789")
    },
    {
      icon: MessageSquare,
      label: "Telegram",
      action: () => window.open("https://t.me/username")
    },
    {
      icon: MessageSquareMore,
      label: "SMS",
      action: () => window.location.href = "sms:+123456789"
    }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Comment pouvons-nous vous aider ?</SheetTitle>
          <SheetDescription>
            Choisissez votre moyen de contact préféré
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {contactOptions.map((option) => (
            <Button
              key={option.label}
              variant="outline"
              className="w-full flex items-center gap-2 text-lg"
              onClick={option.action}
            >
              <option.icon className="w-5 h-5" />
              {option.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatBubble;