function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="p-8 text-center animate-fade-in">
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center mx-auto mb-3 text-ink-muted">
          <Icon size={18} strokeWidth={1.6} />
        </div>
      )}
      <p className="text-ink-soft text-sm">{title}</p>
      {description && <p className="text-ink-muted text-xs mt-1">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export default EmptyState;
