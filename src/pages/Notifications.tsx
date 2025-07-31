
import { useEffect } from "react";
import { Bell } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import NotificationBell from "@/components/NotificationBell";

export default function Notifications() {
  usePageTitle({ title: "Notifications" });

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Bell className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Centre de notifications</h1>
      </div>
      
      <div className="grid gap-8">
        <NotificationBell />
      </div>
    </div>
  );
}
