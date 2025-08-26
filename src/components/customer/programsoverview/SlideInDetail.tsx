import { motion, AnimatePresence } from "framer-motion";
import { ScheduledTask } from "@/pages/customer/MyProgramsPage";
import { ProgramDetailView } from "./ProgramDetailView";

export const SlideInDetail = ({ task, onClose }: { task: ScheduledTask | null; onClose: () => void }) => (
  <AnimatePresence>
    {task && (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-4">
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 mb-2">Close ✖</button>
          <ProgramDetailView program={task} />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
