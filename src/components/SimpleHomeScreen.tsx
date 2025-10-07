import { memo } from 'react';
import { 
  Droplets, 
  Heart, 
  Trophy, 
  MapPin, 
  Upload, 
  Activity,
  Plus
} from 'lucide-react';

interface SimpleHomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const SimpleHomeScreen = memo(({ onNavigate }: SimpleHomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to BaseSeva</h1>
        <p className="text-gray-600">Your blood donation platform</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => onNavigate('feed')}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 active:bg-gray-50"
        >
          <Activity className="w-8 h-8 text-red-600 mb-2" />
          <h3 className="font-medium text-gray-900">View Requests</h3>
          <p className="text-sm text-gray-600">See blood requests</p>
        </button>

        <button
          onClick={() => onNavigate('upload')}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 active:bg-gray-50"
        >
          <Upload className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="font-medium text-gray-900">Record Donation</h3>
          <p className="text-sm text-gray-600">Upload proof</p>
        </button>

        <button
          onClick={() => onNavigate('map')}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 active:bg-gray-50"
        >
          <MapPin className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-medium text-gray-900">Find Blood Banks</h3>
          <p className="text-sm text-gray-600">Locate centers</p>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 active:bg-gray-50"
        >
          <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
          <h3 className="font-medium text-gray-900">My Profile</h3>
          <p className="text-sm text-gray-600">View achievements</p>
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Your Impact</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">5</div>
            <div className="text-sm text-gray-600">Donations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-sm text-gray-600">Lives Saved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Streak</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Donation Recorded</p>
              <p className="text-xs text-gray-600">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Droplets className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Request Fulfilled</p>
              <p className="text-xs text-gray-600">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
