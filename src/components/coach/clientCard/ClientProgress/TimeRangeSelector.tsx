import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type TimeRange = '1week' | '1month' | '6months';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Time Range:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[120px] h-8 text-sm bg-background border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border-border shadow-lg z-50">
          <SelectItem value="1week">1 Week</SelectItem>
          <SelectItem value="1month">1 Month</SelectItem>
          <SelectItem value="6months">6 Months</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeRangeSelector;