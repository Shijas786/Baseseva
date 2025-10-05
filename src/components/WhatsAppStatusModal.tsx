import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Camera, X, MapPin, AlertTriangle, Send, Droplets, User, Phone, Hospital, ArrowLeft } from 'lucide-react';

interface WhatsAppStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: any) => void;
}

const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const urgencyLevels = [
  { value: 'normal', label: 'Normal', color: 'bg-green-500', description: 'Standard blood request', icon: '🟢' },
  { value: 'urgent', label: 'Urgent', color: 'bg-yellow-500', description: 'Needed within 24 hours', icon: '🟡' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500', description: 'Emergency - Immediate need', icon: '🔴' }
];

export function WhatsAppStatusModal({ isOpen, onClose, onSubmit }: WhatsAppStatusModalProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientName) newErrors.patientName = 'Patient name is required';
    if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!formData.hospital) newErrors.hospital = 'Hospital is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.urgency) newErrors.urgency = 'Urgency level is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({
        patientName: '',
        bloodType: '',
        hospital: '',
        contact: '',
        city: '',
        urgency: '',
        description: '',
        unitsNeeded: 1,
        image: null
      });
      setImagePreview(null);
      setErrors({});
      setCurrentStep(1);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetModal = () => {
    setFormData({
      patientName: '',
      bloodType: '',
      hospital: '',
      contact: '',
      city: '',
      urgency: '',
      description: '',
      unitsNeeded: 1,
      image: null
    });
    setImagePreview(null);
    setErrors({});
    setCurrentStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[400px] w-full h-[600px] p-0 bg-gradient-to-br from-green-600 via-green-500 to-green-700 text-white border-0 rounded-t-3xl rounded-b-none">
        {/* WhatsApp-style Header */}
        <DialogHeader className="p-4 pb-2 bg-green-700/50 border-b border-green-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep > 1 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevStep}
                  className="w-8 h-8 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetModal}
                  className="w-8 h-8 text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
              <div>
                <DialogTitle className="text-lg font-semibold text-white">
                  Create Blood Request
                </DialogTitle>
                <p className="text-green-100 text-sm">Step {currentStep} of 3</p>
              </div>
            </div>
            <Button
              onClick={resetModal}
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Patient Information</h3>
                  <p className="text-green-100 text-sm">Tell us about the patient</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Patient Name</Label>
                  <Input
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="Enter patient name"
                    className="bg-white/10 border-white/20 text-white placeholder-green-200 focus:border-white/40"
                  />
                  {errors.patientName && <p className="text-red-300 text-sm">{errors.patientName}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Blood Type Required</Label>
                  <Select value={formData.bloodType} onValueChange={(value) => setFormData(prev => ({ ...prev, bloodType: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-600 border-green-400/30">
                      {bloodTypes.map(type => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-green-500/50">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            {type}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bloodType && <p className="text-red-300 text-sm">{errors.bloodType}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Units Needed</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData(prev => ({ ...prev, unitsNeeded: parseInt(e.target.value) || 1 }))}
                    placeholder="1"
                    className="bg-white/10 border-white/20 text-white placeholder-green-200 focus:border-white/40"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Hospital & Contact */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Hospital className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Hospital Details</h3>
                  <p className="text-green-100 text-sm">Where is the patient?</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Hospital Name</Label>
                  <Input
                    value={formData.hospital}
                    onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
                    placeholder="Enter hospital name"
                    className="bg-white/10 border-white/20 text-white placeholder-green-200 focus:border-white/40"
                  />
                  {errors.hospital && <p className="text-red-300 text-sm">{errors.hospital}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Contact Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                    <Input
                      value={formData.contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                      placeholder="Enter contact number"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-green-200 focus:border-white/40"
                    />
                  </div>
                  {errors.contact && <p className="text-red-300 text-sm">{errors.contact}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-green-200 focus:border-white/40"
                    />
                  </div>
                  {errors.city && <p className="text-red-300 text-sm">{errors.city}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Urgency & Description */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Urgency & Details</h3>
                  <p className="text-green-100 text-sm">How urgent is this request?</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Urgency Level</Label>
                  <div className="space-y-2">
                    {urgencyLevels.map(level => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, urgency: level.value }))}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          formData.urgency === level.value
                            ? 'bg-white/20 border-white text-white'
                            : 'bg-white/5 border-white/20 text-green-100 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{level.icon}</div>
                          <div className="text-left">
                            <div className="font-medium">{level.label}</div>
                            <div className="text-sm opacity-80">{level.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.urgency && <p className="text-red-300 text-sm">{errors.urgency}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Additional Details (Optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add any additional information..."
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder-green-200 focus:border-white/40"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Back
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-white text-green-600 hover:bg-green-50 font-semibold"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-white text-green-600 hover:bg-green-50 font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Request
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
