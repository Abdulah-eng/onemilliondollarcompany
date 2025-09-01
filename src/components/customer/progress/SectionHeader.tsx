interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function SectionHeader({ title, actionText, onActionClick }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center px-2 sm:px-0">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {actionText && onActionClick && (
        <button onClick={onActionClick} className="text-sm font-semibold text-primary">
          {actionText}
        </button>
      )}
    </div>
  );
}
