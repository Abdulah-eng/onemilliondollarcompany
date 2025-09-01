// src/components/customer/viewprogram/shared/GuideDrawer.tsx

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronUp } from "lucide-react";
import React from "react";

interface GuideDrawerProps {
  // Pass any object that has a 'name' property
  guideData: { name: string } | null;
  isMobile: boolean;
  triggerText: string;
  children: React.ReactNode;
}

export default function GuideDrawer({ guideData, isMobile, triggerText, children }: GuideDrawerProps) {
  if (!guideData) {
    return null;
  }

  // On desktop, render the content directly (inline)
  if (!isMobile) {
    return <>{children}</>;
  }
  
  // On mobile/tablet, render the drawer system
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {/* This is the "peeky" bar at the bottom */}
        <div className="sticky bottom-[76px] z-10 p-4">
          <div className="flex items-center justify-between w-full max-w-md mx-auto h-14 px-4 bg-card border rounded-xl shadow-lg cursor-pointer active:scale-95 transition-transform">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="font-bold text-lg flex-shrink-0">{triggerText}</span>
              <span className="font-semibold text-muted-foreground truncate">{guideData.name}</span>
            </div>
            <div className="flex flex-col items-center text-primary animate-pulse">
                <ChevronUp className="h-5 w-5"/>
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[80%] rounded-t-3xl border-none bg-background pt-4">
        {/* The scrollable content inside the opened drawer */}
        <div className="overflow-y-auto p-4">
           {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
