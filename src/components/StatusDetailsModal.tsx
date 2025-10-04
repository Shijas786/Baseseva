import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Share2, 
  Heart, 
  AlertTriangle,
  Calendar,
  User,
  MessageCircle
} from 'lucide-react';

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

interface StatusDetailsModalProps {
  status: Status | null;
  isOpen: boolean;
  onClose: () => void;
}

const urgencyConfig = {
  normal: {
    color: 'bg-[var(--success-green)]',
    textColor: 'text-[var(--success-green)]',
    label: 'Normal',
    description: 'Standard blood request',
    gradient: 'from-[var(--success-green)] to-[var(--success-green)]/70'
  },
  urgent: {
    color: 'bg-[var(--warning-orange)]',
    textColor: 'text-[var(--warning-orange)]',
    label: 'Urgent',
    description: 'Needed within 24 hours',
    gradient: 'from-[var(--warning-orange)] to-[var(--warning-orange)]/70'
  },
  critical: {
    color: 'bg-[var(--blood-red)]',
    textColor: 'text-[var(--blood-red)]',
    label: 'Critical',
    description: 'Emergency - Immediate need',
    gradient: 'from-[var(--blood-red)] to-[var(--blood-red)]/70'
  }
};

export function StatusDetailsModal({ status, isOpen, onClose }: StatusDetailsModalProps) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (!status) return;

    const updateTimer = () => {
      const now = new Date();
      const expires = new Date(status.expiresAt);
      const diff = expires.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s remaining`);
      } else {
        setTimeRemaining(`${seconds}s remaining`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Blood Request - ${status?.bloodType}`,
        text: `Urgent: ${status?.bloodType} blood needed in ${status?.city}. ${status?.description}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `Blood Request: ${status?.bloodType} needed in ${status?.city}. ${status?.description}`
      );
    }
  };

  const handleContact = () => {
    // In a real app, this would open a contact modal or direct message
    console.log('Contact donor:', status?.userName);
  };

  if (!status) return null;

  const urgency = urgencyConfig[status.urgency];
  const isExpiring = timeRemaining.includes('remaining') && 
    (timeRemaining.includes('m') && parseInt(timeRemaining) < 60);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-[var(--card)] border-[var(--glass-border)] backdrop-blur-xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Blood Request Details</DialogTitle>
          <DialogDescription>
            View detailed information about this blood request including urgency, location, and contact details.
          </DialogDescription>
        </DialogHeader>
        
        {/* Header with gradient */}
        <div className={`bg-gradient-to-br ${urgency.gradient} p-6 text-white relative`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-3 border-white/20">
                  <AvatarImage src={status.avatar} alt={status.userName} />
                  <AvatarFallback className="bg-white/20 text-white text-xl">
                    {status.bloodType}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${urgency.color} rounded-full border-2 border-white flex items-center justify-center`}>
                  {status.urgency === 'critical' && <AlertTriangle className="w-3 h-3 text-white" />}
                  {status.urgency === 'urgent' && <Clock className="w-3 h-3 text-white" />}
                  {status.urgency === 'normal' && <Heart className="w-3 h-3 text-white" />}
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">{status.bloodType}</h2>
                <p className="text-white/90 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {status.userName}
                </p>
                <p className="text-white/80 flex items-center gap-1 text-sm">
                  <MapPin className="w-3 h-3" />
                  {status.city}
                </p>
              </div>
            </div>
          </div>

          {/* Urgency badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/20 text-white border-white/30">
              {urgency.label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Time info */}
          <div className="bg-[var(--glass-bg)] rounded-lg p-4 border border-[var(--glass-border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="text-sm text-[var(--muted-foreground)]">
                  Posted {formatTimestamp(status.timestamp)}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${isExpiring ? 'text-[var(--blood-red)]' : 'text-[var(--muted-foreground)]'}`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{timeRemaining}</span>
              </div>
            </div>
          </div>

          {/* Image if available */}
          {status.image && (
            <div className="rounded-lg overflow-hidden border border-[var(--glass-border)]">
              <ImageWithFallback
                src={URL.createObjectURL(status.image)}
                alt="Medical report"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--foreground)]">Request Details</h3>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              {status.description}
            </p>
          </div>

          {/* Urgency info */}
          <div className="bg-[var(--glass-bg)] rounded-lg p-4 border border-[var(--glass-border)]">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${urgency.color}`} />
              <div>
                <p className="font-medium text-[var(--foreground)]">{urgency.label} Priority</p>
                <p className="text-sm text-[var(--muted-foreground)]">{urgency.description}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-[var(--glass-border)]">
            <Button
              onClick={handleContact}
              className="flex-1 bg-gradient-to-r from-[var(--base-blue)] to-[var(--base-blue-light)] hover:from-[var(--base-blue-dark)] hover:to-[var(--base-blue)] text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="px-4 border-[var(--glass-border)] hover:bg-[var(--glass-bg)]"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Emergency contact info for critical requests */}
          {status.urgency === 'critical' && (
            <div className="bg-[var(--blood-red)]/10 border border-[var(--blood-red)]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[var(--blood-red)]" />
                <span className="font-semibold text-[var(--blood-red)]">Emergency Alert</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                This is a critical blood request. If you can donate, please contact immediately.
              </p>
              <Button
                size="sm"
                className="mt-3 bg-[var(--blood-red)] hover:bg-[var(--blood-red-dark)] text-white"
              >
                <Phone className="w-3 h-3 mr-2" />
                Emergency Contact
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}