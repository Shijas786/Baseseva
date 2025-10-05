import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Camera, X, MapPin, Clock, AlertTriangle, Send, Droplets, User, Phone, Hospital, MessageSquare } from 'lucide-react';

interface StatusPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: any) => void;
}

const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const urgencyLevels = [
  { value: 'normal', label: 'Normal', color: 'bg-[var(--success-green)]', description: 'Standard blood request' },
  { value: 'urgent', label: 'Urgent', color: 'bg-[var(--warning-orange)]', description: 'Needed within 24 hours' },
  { value: 'critical', label: 'Critical', color: 'bg-[var(--blood-red)]', description: 'Emergency - Immediate need' }
];

export function StatusPostingModal({ isOpen, onClose, onSubmit }: StatusPostingModalProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: '',
    hospital: '',
    contact: '',
    city: '',
    urgency: '',
    description: '',
    unitsNeeded: 1,
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.urgency) newErrors.urgency = 'Urgency level is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newStatus = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      userName: 'Anonymous Donor' // In real app, get from user context
    };

    onSubmit(newStatus);
    
    // Reset form
    setFormData({
      bloodType: '',
      city: '',
      urgency: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  const selectedUrgency = urgencyLevels.find(level => level.value === formData.urgency);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-[var(--card)] border-[var(--glass-border)] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-[var(--base-blue)] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Post Blood Request
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Create a new blood request with your requirements and urgency level.
          </div>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Image Upload */}
          <div className="space-y-3">
            <Label>Medical Report / Image (Optional)</Label>
            {imagePreview ? (
              <div className="relative">
                <ImageWithFallback
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-full h-40 object-cover rounded-lg border border-[var(--glass-border)]"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 w-8 h-8 p-0"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--glass-border)] rounded-lg cursor-pointer hover:bg-[var(--glass-bg)] transition-colors">
                <Camera className="w-8 h-8 mb-2 text-[var(--muted-foreground)]" />
                <span className="text-sm text-[var(--muted-foreground)]">
                  Tap to add photo
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Blood Type Selection */}
          <div className="space-y-3">
            <Label>Blood Type Required *</Label>
            <div className="grid grid-cols-4 gap-2">
              {bloodTypes.map((type) => (
                <Button
                  key={type}
                  variant={formData.bloodType === type ? "default" : "outline"}
                  className={`h-12 ${
                    formData.bloodType === type
                      ? 'bg-[var(--blood-red)] hover:bg-[var(--blood-red-dark)] text-white'
                      : 'border-[var(--glass-border)] hover:bg-[var(--glass-bg)]'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, bloodType: type }))}
                >
                  {type}
                </Button>
              ))}
            </div>
            {errors.bloodType && (
              <p className="text-sm text-[var(--blood-red)]">{errors.bloodType}</p>
            )}
          </div>

          {/* City Input */}
          <div className="space-y-3">
            <Label htmlFor="city">City / Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <Input
                id="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="pl-10 bg-[var(--input)] border-[var(--glass-border)] h-12"
              />
            </div>
            {errors.city && (
              <p className="text-sm text-[var(--blood-red)]">{errors.city}</p>
            )}
          </div>

          {/* Urgency Level */}
          <div className="space-y-3">
            <Label>Urgency Level *</Label>
            <div className="space-y-2">
              {urgencyLevels.map((level) => (
                <div
                  key={level.value}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.urgency === level.value
                      ? 'border-[var(--base-blue)] bg-[var(--base-blue)]/10'
                      : 'border-[var(--glass-border)] hover:bg-[var(--glass-bg)]'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, urgency: level.value }))}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${level.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{level.label}</span>
                        {level.value === 'critical' && <Clock className="w-4 h-4 text-[var(--blood-red)]" />}
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">{level.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.urgency && (
              <p className="text-sm text-[var(--blood-red)]">{errors.urgency}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your blood requirement, patient condition, hospital details..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] bg-[var(--input)] border-[var(--glass-border)] resize-none"
            />
            {errors.description && (
              <p className="text-sm text-[var(--blood-red)]">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t border-[var(--glass-border)]">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[var(--glass-border)] hover:bg-[var(--glass-bg)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-[var(--base-blue)] to-[var(--base-blue-light)] hover:from-[var(--base-blue-dark)] hover:to-[var(--base-blue)] text-white"
          >
            {selectedUrgency && (
              <div className={`w-2 h-2 rounded-full ${selectedUrgency.color} mr-2`} />
            )}
            Post Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}