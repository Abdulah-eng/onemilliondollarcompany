// src/components/customer/programsoverview/SlideInDetail.tsx
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProgramDetailView from "./ProgramDetailView";

export default function SlideInDetail({ task, isMobile, onClose }: { task: any, isMobile: boolean, onClose: () => void }) {
  if (!task) return null;

  return isMobile ? (
    <Drawer open={!!task} onOpenChange={() => onClose()}>
      <DrawerContent>
        <ProgramDetailView task={task} />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={!!task} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <ProgramDetailView task={task} />
      </DialogContent>
    </Dialog>
  );
}
