// src/components/customer/viewprogram/shared/GuideDrawer.tsx

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import React, { useState, useEffect } from "react";

interface GuideDrawerProps {
  guideData: { name: string } | null;
  isMobile: boolean;
  children: React.ReactNode;
}

export default function GuideDrawer({ guideData, isMobile, children }: GuideDrawerProps) {
  const [snap, setSnap] = useState<number | string | null>(0.15);

  // Reset the drawer to its peeky state when the guide data changes (e.g., user selects a new exercise)
  useEffect(() => {
    setSnap(0.15);
  }, [guideData]);

  if (!guideData) {
    return null;
  }

  // On desktop, render the content directly (inline)
  if (!isMobile) {
    return <>{children}</>;
  }
  
  // On mobile/tablet, render the controlled drawer
  return (
    <Drawer
      open={!!guideData}
      snapPoints={[0.15, 0.8]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <DrawerContent className="h-[80%] rounded-t-3xl border-none bg-background pt-4">
        <div className="overflow-y-auto p-4">
           {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
