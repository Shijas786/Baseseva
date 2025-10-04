import { ReactNode } from 'react';
import { cn } from './utils';

// Base Modern Card Component
interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'interactive' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function ModernCard({ 
  children, 
  className, 
  variant = 'default',
  size = 'md',
  onClick 
}: ModernCardProps) {
  const variants = {
    default: "card",
    elevated: "card-elevated",
    interactive: "card-interactive",
    outlined: "surface border-2"
  };

  const sizes = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  };

  return (
    <div 
      className={cn(
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Stats Card
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  color?: 'blue' | 'red' | 'green' | 'purple' | 'orange';
}

export function StatsCard({ title, value, subtitle, icon, trend, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    red: "text-red-600 dark:text-red-400", 
    green: "text-green-600 dark:text-green-400",
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-600 dark:text-orange-400"
  };

  const iconBgColors = {
    blue: "bg-blue-50 dark:bg-blue-950/50",
    red: "bg-red-50 dark:bg-red-950/50", 
    green: "bg-green-50 dark:bg-green-950/50",
    purple: "bg-purple-50 dark:bg-purple-950/50",
    orange: "bg-orange-50 dark:bg-orange-950/50"
  };

  const trendColors = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-gray-600 dark:text-gray-400"
  };

  return (
    <ModernCard variant="elevated">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-secondary text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-primary mb-1">{value}</p>
          {subtitle && (
            <p className="text-tertiary text-sm">{subtitle}</p>
          )}
          {trend && (
            <div className={cn("flex items-center gap-1 mt-3 text-sm font-medium", trendColors[trend.direction])}>
              <span className="text-xs">{trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}</span>
              <span>{Math.abs(trend.value)}% vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            iconBgColors[color],
            colorClasses[color]
          )}>
            {icon}
          </div>
        )}
      </div>
    </ModernCard>
  );
}

// Feature Card
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  badge?: string;
  image?: string;
}

export function FeatureCard({ title, description, icon, action, badge, image }: FeatureCardProps) {
  return (
    <ModernCard variant="elevated" hover interactive onClick={action?.onClick}>
      {image && (
        <div className="relative -m-6 mb-4 h-48 overflow-hidden rounded-t-3xl">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {badge && (
            <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-medium text-white">
              {badge}
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-start gap-4">
        {icon && !image && (
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-blue-400 flex-shrink-0">
            {icon}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold glass-text">{title}</h3>
            {badge && !image && (
              <span className="glass px-2 py-1 rounded-full text-xs font-medium text-white/80">
                {badge}
              </span>
            )}
          </div>
          
          <p className="text-white/70 text-sm leading-relaxed mb-4">{description}</p>
          
          {action && (
            <button className="glass-button text-sm hover:scale-105 transition-transform">
              {action.label}
            </button>
          )}
        </div>
      </div>
    </ModernCard>
  );
}

// Profile Card
interface ProfileCardProps {
  name: string;
  role?: string;
  avatar: string;
  stats?: Array<{
    label: string;
    value: string;
  }>;
  badges?: string[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ProfileCard({ name, role, avatar, stats, badges, action }: ProfileCardProps) {
  return (
    <ModernCard variant="glass" className="text-center">
      <div className="relative">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden glass-strong">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        
        <h3 className="text-xl font-semibold glass-text mb-1">{name}</h3>
        {role && <p className="text-white/60 text-sm mb-4">{role}</p>}
        
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {badges.map((badge, index) => (
              <span key={index} className="glass px-3 py-1 rounded-full text-xs font-medium text-white/80">
                {badge}
              </span>
            ))}
          </div>
        )}
        
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold glass-text">{stat.value}</p>
                <p className="text-white/60 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
        
        {action && (
          <button 
            onClick={action.onClick}
            className="glass-button w-full hover:scale-105 transition-transform"
          >
            {action.label}
          </button>
        )}
      </div>
    </ModernCard>
  );
}

// Notification Card
interface NotificationCardProps {
  title: string;
  message: string;
  time: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: ReactNode;
  unread?: boolean;
  onClick?: () => void;
}

export function NotificationCard({ 
  title, 
  message, 
  time, 
  type = 'info', 
  icon, 
  unread = false,
  onClick 
}: NotificationCardProps) {
  const typeColors = {
    info: "border-blue-400/30 bg-gradient-to-r from-blue-500/10 to-blue-600/20",
    success: "border-green-400/30 bg-gradient-to-r from-green-500/10 to-green-600/20",
    warning: "border-orange-400/30 bg-gradient-to-r from-orange-500/10 to-orange-600/20", 
    error: "border-red-400/30 bg-gradient-to-r from-red-500/10 to-red-600/20"
  };

  const iconColors = {
    info: "text-blue-400",
    success: "text-green-400",
    warning: "text-orange-400",
    error: "text-red-400"
  };

  return (
    <ModernCard 
      variant="outlined"
      className={cn(
        typeColors[type],
        unread && "border-white/30",
        "relative"
      )}
      interactive
      onClick={onClick}
    >
      {unread && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
      )}
      
      <div className="flex items-start gap-3">
        {icon && (
          <div className={cn("w-10 h-10 glass rounded-xl flex items-center justify-center", iconColors[type])}>
            {icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium glass-text truncate">{title}</h4>
            <span className="text-white/50 text-xs ml-2 flex-shrink-0">{time}</span>
          </div>
          
          <p className="text-white/70 text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </ModernCard>
  );
}

// Action Card
interface ActionCardProps {
  title: string;
  description?: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function ActionCard({ 
  title, 
  description, 
  icon, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary' 
}: ActionCardProps) {
  const variants = {
    primary: "border-l-4 border-l-blue-500 hover:border-l-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
    secondary: "border-l-4 border-l-gray-400 hover:border-l-gray-500 hover:bg-gray-50/50 dark:hover:bg-gray-950/20",
    danger: "border-l-4 border-l-red-500 hover:border-l-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20"
  };

  const iconColors = {
    primary: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50",
    secondary: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/50", 
    danger: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50"
  };

  return (
    <ModernCard 
      variant="interactive"
      className={cn(
        "transition-all duration-200",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-transform",
          iconColors[variant],
          loading && "animate-pulse"
        )}>
          {loading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            icon
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
          {description && (
            <p className="text-secondary text-sm">{description}</p>
          )}
        </div>
        
        <div className="text-tertiary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </ModernCard>
  );
}

// Progress Card
interface ProgressCardProps {
  title: string;
  subtitle?: string;
  progress: number; // 0-100
  color?: 'blue' | 'red' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
  icon?: ReactNode;
}

export function ProgressCard({ 
  title, 
  subtitle, 
  progress, 
  color = 'blue', 
  showPercentage = true,
  icon 
}: ProgressCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-400",
    red: "from-red-500 to-red-400",
    green: "from-green-500 to-green-400", 
    purple: "from-purple-500 to-purple-400",
    orange: "from-orange-500 to-orange-400"
  };

  const backgroundColors = {
    blue: "from-blue-500/20 to-blue-600/30 border-blue-400/30",
    red: "from-red-500/20 to-red-600/30 border-red-400/30",
    green: "from-green-500/20 to-green-600/30 border-green-400/30",
    purple: "from-purple-500/20 to-purple-600/30 border-purple-400/30", 
    orange: "from-orange-500/20 to-orange-600/30 border-orange-400/30"
  };

  return (
    <ModernCard 
      variant="gradient"
      className={cn("bg-gradient-to-br", backgroundColors[color])}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold glass-text mb-1">{title}</h3>
          {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/80">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Progress</span>
          {showPercentage && <span className="glass-text font-medium">{progress}%</span>}
        </div>
        
        <div className="h-3 glass rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full bg-gradient-to-r transition-all duration-1000 ease-out rounded-full",
              colorClasses[color]
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    </ModernCard>
  );
}