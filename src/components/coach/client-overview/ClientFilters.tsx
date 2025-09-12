import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, SortAsc } from 'lucide-react';
import { motion } from 'framer-motion';

const TOP_NAV_HEIGHT = 64; // adjust to your actual top nav height

const ClientFilters = () => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full z-40`} // spans full width, stays above other content
      style={{ position: 'sticky', top: TOP_NAV_HEIGHT }}
    >
      <Card className="rounded-xl shadow-md bg-white border">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filter by Status */}
          <div className="flex flex-col w-full md:w-auto">
            <p className="font-semibold text-sm text-muted-foreground mb-1">Filter Clients</p>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              <Select>
                <SelectTrigger className="w-full md:w-[180px] bg-white border shadow-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="needs-feedback">Needs Feedback</SelectItem>
                  <SelectItem value="off-track">Off Track</SelectItem>
                  <SelectItem value="missing-program">Missing Program</SelectItem>
                  <SelectItem value="soon-to-expire">Soon to Expire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort By */}
          <div className="flex flex-col w-full md:w-auto">
            <p className="font-semibold text-sm text-muted-foreground mb-1">Sort By</p>
            <div className="flex items-center gap-2">
              <SortAsc size={18} className="text-primary" />
              <Select>
                <SelectTrigger className="w-full md:w-[180px] bg-white border shadow-sm">
                  <SelectValue placeholder="Last Active" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-active">Last Active</SelectItem>
                  <SelectItem value="signup-date">Sign-up Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientFilters;
