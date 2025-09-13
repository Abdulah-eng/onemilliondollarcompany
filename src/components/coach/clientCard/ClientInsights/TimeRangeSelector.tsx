import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type TimeRange = '1week' | '1month' | '6months';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1week">1 Week</SelectItem>
        <SelectItem value="1month">1 Month</SelectItem>
        <SelectItem value="6months">6 Months</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimeRangeSelector;