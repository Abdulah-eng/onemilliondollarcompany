import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  MessageCircle,
  X,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ClientFiltersProps {
  onFilterChange: (filters: {
    status: string[];
    badges: string[];
  }) => void;
}

const ClientFilters = ({ onFilterChange }: ClientFiltersProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'no_status', label: 'No Status', icon: Clock, color: 'bg-gray-100 text-gray-800' },
    { value: 'waiting_offer', label: 'Waiting Offer', icon: DollarSign, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'missing_program', label: 'Missing Program', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
    { value: 'program_active', label: 'Program Active', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
    { value: 'on_track', label: 'On Track', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'off_track', label: 'Off Track', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
    { value: 'soon_to_expire', label: 'Soon to Expire', icon: Clock, color: 'bg-orange-100 text-orange-800' }
  ];

  const badgeOptions = [
    { value: 'new_message', label: 'New Message', icon: MessageCircle, color: 'bg-blue-100 text-blue-800' },
    { value: 'awaiting_checkin', label: 'Awaiting Check-in', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'new_feedback', label: 'New Feedback', icon: CheckCircle, color: 'bg-green-100 text-green-800' }
  ];

  const handleStatusToggle = (status: string) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status];
    setSelectedStatus(newStatus);
    onFilterChange({ status: newStatus, badges: selectedBadges });
  };

  const handleBadgeToggle = (badge: string) => {
    const newBadges = selectedBadges.includes(badge)
      ? selectedBadges.filter(b => b !== badge)
      : [...selectedBadges, badge];
    setSelectedBadges(newBadges);
    onFilterChange({ status: selectedStatus, badges: newBadges });
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedBadges([]);
    onFilterChange({ status: [], badges: [] });
  };

  const hasActiveFilters = selectedStatus.length > 0 || selectedBadges.length > 0;

  return (
    <Card className="shadow-lg rounded-xl border-0 bg-gradient-to-br from-background to-muted/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">{t('clients.filterClients')}</h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
{t('clients.clearAll')}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Status Filters */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
{t('clients.status')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedStatus.includes(option.value);
                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusToggle(option.value)}
                    className={cn(
                      "flex items-center gap-2 transition-all duration-200",
                      isSelected ? option.color : "hover:bg-muted hover:border-primary/50"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Badge Filters */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
{t('clients.badges')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {badgeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedBadges.includes(option.value);
                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBadgeToggle(option.value)}
                    className={cn(
                      "flex items-center gap-2 transition-all duration-200",
                      isSelected ? option.color : "hover:bg-muted hover:border-primary/50"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-xs font-medium text-muted-foreground">{t('clients.activeFilters')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedStatus.map((status) => {
                  const option = statusOptions.find(o => o.value === status);
                  return (
                    <Badge key={status} variant="secondary" className="text-xs px-2 py-1">
                      {option?.label}
                    </Badge>
                  );
                })}
                {selectedBadges.map((badge) => {
                  const option = badgeOptions.find(o => o.value === badge);
                  return (
                    <Badge key={badge} variant="secondary" className="text-xs px-2 py-1">
                      {option?.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientFilters;