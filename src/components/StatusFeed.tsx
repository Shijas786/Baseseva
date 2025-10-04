import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Plus, Clock, MapPin } from 'lucide-react';
import { StatusPostingModal } from './StatusPostingModal';
import { StatusDetailsModal } from './StatusDetailsModal';

interface Status {
  id: string;
  bloodType: string;
  city: string;
  urgency: 'normal' | 'urgent' | 'critical';
  description: string;
  image: File | null;
  timestamp: string;
  expiresAt: string;
  avatar: string;
  userName: string;
}

interface StatusFeedProps {
  onStatusClick?: (status: Status) => void;
}

const urgencyColors = {
  normal: 'from-[var(--success-green)] to-[var(--success-green)]/70',
  urgent: 'from-[var(--warning-orange)] to-[var(--warning-orange)]/70',
  critical: 'from-[var(--blood-red)] to-[var(--blood-red)]/70'
};

const urgencyDots = {
  normal: 'bg-[var(--success-green)]',
  urgent: 'bg-[var(--warning-orange)]',
  critical: 'bg-[var(--blood-red)]'
};

export function StatusFeed({ onStatusClick }: StatusFeedProps) {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  // Sample initial data
  useEffect(() => {
    const sampleStatuses: Status[] = [
      {
        id: '1',
        bloodType: 'O-',
        city: 'New York',
        urgency: 'critical',
        description: 'Emergency blood needed for accident victim at Mount Sinai Hospital. Patient is in critical condition.',
        image: null,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emergency1',
        userName: 'Dr. Sarah Chen'
      },
      {
        id: '2',
        bloodType: 'A+',
        city: 'Los Angeles',
        urgency: 'urgent',
        description: 'Blood needed for scheduled surgery tomorrow morning. Patient has rare blood compatibility issues.',
        image: null,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=urgent1',
        userName: 'Medical Center LA'
      },
      {
        id: '3',
        bloodType: 'B+',
        city: 'Chicago',
        urgency: 'normal',
        description: 'Regular blood donation drive this weekend. Multiple blood types needed for community blood bank.',
        image: null,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=normal1',
        userName: 'Chicago Blood Bank'
      }
    ];
    setStatuses(sampleStatuses);
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff <= 0) return 'Expired';
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const handleAddStatus = (newStatus: Status) => {
    setStatuses(prev => [newStatus, ...prev]);
  };

  const handleStatusClick = (status: Status) => {
    setSelectedStatus(status);
    onStatusClick?.(status);
  };

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Blood Requests</h3>
          <span className="text-sm text-[var(--muted-foreground)]">
            {statuses.length} active requests
          </span>
        </div>

        {/* Status Feed */}
        <div className="flex gap-4 overflow-x-auto pb-2 px-4 scrollbar-hide">
          {/* Add Status Button */}
          <div className="flex flex-col items-center space-y-2 min-w-[70px]">
            <Button
              onClick={() => setIsPostingModalOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--base-blue)] to-[var(--base-blue-light)] hover:from-[var(--base-blue-dark)] hover:to-[var(--base-blue)] shadow-lg hover:shadow-xl transition-all duration-200 p-0 text-[rgba(27,25,25,1)]"
            >
              <Plus className="w-6 h-6 text-white" />
            </Button>
            <span className="text-xs text-[var(--muted-foreground)] text-center leading-tight">
              Add Request
            </span>
          </div>

          {/* Status Items */}
          {statuses.map((status) => {
            const timeRemaining = formatTimeRemaining(status.expiresAt);
            const isExpiring = timeRemaining.includes('left') && 
              (parseInt(timeRemaining) < 2 || timeRemaining.includes('m left'));

            return (
              <div
                key={status.id}
                className="flex flex-col items-center space-y-2 min-w-[70px] cursor-pointer group"
                onClick={() => handleStatusClick(status)}
              >
                {/* Avatar with gradient border */}
                <div className="relative">
                  <div className={`p-0.5 rounded-full bg-gradient-to-br ${urgencyColors[status.urgency]} shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                    <Avatar className="w-14 h-14 border-2 border-[var(--background)]">
                      <AvatarImage src={status.avatar} alt={status.userName} />
                      <AvatarFallback className="bg-[var(--base-blue)] text-white">
                        {status.bloodType}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Urgency dot */}
                  <div className={`absolute -top-1 -right-1 w-4 h-4 ${urgencyDots[status.urgency]} rounded-full border-2 border-[var(--background)] shadow-sm`} />
                  
                  {/* Expiry indicator */}
                  {isExpiring && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--blood-red)] rounded-full border-2 border-[var(--background)] flex items-center justify-center">
                      <Clock className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>

                {/* Status info */}
                <div className="text-center space-y-1">
                  <div className="text-xs font-semibold text-[var(--foreground)]">
                    {status.bloodType}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {status.city.length > 8 ? `${status.city.substring(0, 8)}...` : status.city}
                  </div>
                  <div className={`text-[10px] font-medium ${
                    isExpiring ? 'text-[var(--blood-red)]' : 'text-[var(--muted-foreground)]'
                  }`}>
                    {timeRemaining}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state if no statuses */}
          {statuses.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-[var(--muted-foreground)]" />
              </div>
              <p className="text-[var(--muted-foreground)] mb-2">No active blood requests</p>
              <p className="text-sm text-[var(--muted-foreground)]">Be the first to post a request</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <StatusPostingModal
        isOpen={isPostingModalOpen}
        onClose={() => setIsPostingModalOpen(false)}
        onSubmit={handleAddStatus}
      />

      <StatusDetailsModal
        status={selectedStatus}
        isOpen={!!selectedStatus}
        onClose={() => setSelectedStatus(null)}
      />
    </>
  );
}

// Hide scrollbar utility
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = scrollbarHideStyles;
  document.head.appendChild(style);
}