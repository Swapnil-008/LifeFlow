import { activityMeta, relativeTime } from '../../utils/activity';

function ActivityItem({ activity }) {
  const { icon: Icon, accent } = activityMeta(activity.type);

  const accentClasses = {
    brand: 'bg-brand-50 text-brand-600',
    amber: 'bg-amber-50 text-amber-600',
    coral: 'bg-coral-50 text-coral-600',
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${accentClasses[accent]}`}>
        <Icon size={15} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink truncate">{activity.title}</p>
        {activity.description && <p className="text-xs text-ink-muted truncate mt-0.5">{activity.description}</p>}
      </div>
      <span className="text-[11px] text-ink-muted shrink-0 mt-0.5">{relativeTime(activity.createdAt)}</span>
    </div>
  );
}

export default ActivityItem;
