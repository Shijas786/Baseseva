import { memo, useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Droplets, 
  Phone, 
  Plus,
  Search
} from 'lucide-react';

interface SimpleBloodRequestFeedProps {
  onNavigate: (screen: string) => void;
}

interface BloodRequest {
  id: string;
  name: string;
  bloodType: string;
  city: string;
  urgency: 'low' | 'medium' | 'high';
  timeAgo: string;
  description: string;
  phone: string;
}

const mockRequests: BloodRequest[] = [
  {
    id: '1',
    name: 'John Doe',
    bloodType: 'O+',
    city: 'New York',
    urgency: 'high',
    timeAgo: '2 hours ago',
    description: 'Emergency surgery needed',
    phone: '+1-555-0123'
  },
  {
    id: '2',
    name: 'Jane Smith',
    bloodType: 'A-',
    city: 'Los Angeles',
    urgency: 'medium',
    timeAgo: '4 hours ago',
    description: 'Regular transfusion needed',
    phone: '+1-555-0456'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    bloodType: 'B+',
    city: 'Chicago',
    urgency: 'low',
    timeAgo: '1 day ago',
    description: 'Scheduled procedure',
    phone: '+1-555-0789'
  }
];

export const SimpleBloodRequestFeed = memo(({ onNavigate }: SimpleBloodRequestFeedProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredRequests = mockRequests.filter(request =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.bloodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRequest = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSubmitRequest = (data: any) => {
    console.log('New request:', data);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Blood Requests</h1>
          <button
            onClick={handleCreateRequest}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 active:bg-red-700"
          >
            <Plus className="w-4 h-4" />
            Create Request
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="p-4 space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{request.name}</h3>
                <p className="text-sm text-gray-600">{request.city}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                {request.urgency}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-red-600" />
                <span>{request.bloodType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{request.timeAgo}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{request.description}</p>

            <div className="flex gap-2">
              <button
                onClick={() => window.open(`tel:${request.phone}`)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 active:bg-red-700"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button
                onClick={() => onNavigate('map')}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center gap-2 active:bg-gray-200"
              >
                <MapPin className="w-4 h-4" />
                Directions
              </button>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No requests found</p>
            <button
              onClick={handleCreateRequest}
              className="bg-red-600 text-white px-6 py-2 rounded-lg active:bg-red-700"
            >
              Create First Request
            </button>
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Blood Request</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter patient name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the need for blood"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg active:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitRequest({})}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg active:bg-red-700"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
