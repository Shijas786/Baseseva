// API Service Layer for BaseSeva
// Handles all backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-supabase-project.supabase.co/functions/v1';
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_URL || 'https://your-supabase-project.supabase.co/functions/v1/upload';

// Types
export interface User {
  id: string;
  wallet_address: string;
  name: string;
  email?: string;
  blood_type: string;
  phone?: string;
  city?: string;
  age?: number;
  donation_count: number;
  last_donation?: string;
  is_eligible: boolean;
  nft_count: number;
  streak: number;
  impact_points: number;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface BloodRequest {
  id: string;
  user_id: string;
  patient_name: string;
  blood_type: string;
  hospital: string;
  contact: string;
  description?: string;
  units_needed: number;
  urgency: 'critical' | 'urgent' | 'normal';
  city?: string;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  verified: boolean;
  created_at: string;
  expires_at: string;
  users?: {
    name: string;
    blood_type: string;
    city?: string;
  };
}

export interface Donation {
  id: string;
  user_id: string;
  blood_type: string;
  donation_date: string;
  certificate_url?: string;
  nft_token_id?: string;
  verified: boolean;
  impact_points: number;
  created_at: string;
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  phone?: string;
  coordinates: string;
  open_hours: any;
  blood_types: string[];
  status: 'open' | 'closing_soon' | 'closed';
  rating: number;
  verified: boolean;
  emergency: boolean;
  inventory: any;
  distance_km?: number;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: 'blood_request' | 'donation_verified' | 'nft_minted' | 'emergency_alert' | 'system';
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Authentication API
export const authApi = {
  // Login/Register user
  async login(userData: {
    walletAddress: string;
    name?: string;
    email?: string;
    bloodType?: string;
    phone?: string;
    city?: string;
    age?: number;
  }): Promise<ApiResponse<{ user: User; message: string }>> {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get user profile
  async getProfile(walletAddress: string): Promise<ApiResponse<{ user: User }>> {
    return apiCall(`/auth/profile/${walletAddress}`);
  },
};

// Blood Requests API
export const bloodRequestsApi = {
  // Get all active blood requests
  async getRequests(filters?: {
    bloodType?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  }): Promise<ApiResponse<{ requests: BloodRequest[] }>> {
    const params = new URLSearchParams();
    if (filters?.bloodType) params.append('bloodType', filters.bloodType);
    if (filters?.lat) params.append('lat', filters.lat.toString());
    if (filters?.lng) params.append('lng', filters.lng.toString());
    if (filters?.radius) params.append('radius', filters.radius.toString());

    const queryString = params.toString();
    return apiCall(`/blood-requests${queryString ? `?${queryString}` : ''}`);
  },

  // Create blood request
  async createRequest(requestData: {
    walletAddress: string;
    patientName: string;
    bloodType: string;
    hospital: string;
    contact: string;
    description?: string;
    unitsNeeded?: number;
    urgency?: 'critical' | 'urgent' | 'normal';
    lat?: number;
    lng?: number;
    city?: string;
  }): Promise<ApiResponse<{ request: BloodRequest }>> {
    return apiCall('/blood-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  // Respond to blood request
  async respondToRequest(
    requestId: string,
    responseData: {
      walletAddress: string;
      message?: string;
    }
  ): Promise<ApiResponse<{ response: any }>> {
    return apiCall(`/blood-requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  },
};

// Donations API
export const donationsApi = {
  // Get user donations
  async getUserDonations(walletAddress: string): Promise<ApiResponse<{ donations: Donation[] }>> {
    return apiCall(`/donations/${walletAddress}`);
  },

  // Create donation record
  async createDonation(donationData: {
    walletAddress: string;
    bloodType: string;
    donationDate: string;
    certificateUrl?: string;
    nftTokenId?: string;
  }): Promise<ApiResponse<{ donation: Donation }>> {
    return apiCall('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  },
};

// Blood Banks API
export const bloodBanksApi = {
  // Get blood banks
  async getBloodBanks(filters?: {
    lat?: number;
    lng?: number;
    radius?: number;
  }): Promise<ApiResponse<{ bloodBanks: BloodBank[] }>> {
    const params = new URLSearchParams();
    if (filters?.lat) params.append('lat', filters.lat.toString());
    if (filters?.lng) params.append('lng', filters.lng.toString());
    if (filters?.radius) params.append('radius', filters.radius.toString());

    const queryString = params.toString();
    return apiCall(`/blood-banks${queryString ? `?${queryString}` : ''}`);
  },
};

// Notifications API
export const notificationsApi = {
  // Get user notifications
  async getUserNotifications(
    walletAddress: string,
    unreadOnly?: boolean
  ): Promise<ApiResponse<{ notifications: AppNotification[] }>> {
    const params = new URLSearchParams();
    if (unreadOnly) params.append('unread', 'true');

    const queryString = params.toString();
    return apiCall(`/notifications/${walletAddress}${queryString ? `?${queryString}` : ''}`);
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ApiResponse<{ notification: AppNotification }>> {
    return apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },
};

// File Upload API
export const uploadApi = {
  // Upload donation certificate
  async uploadCertificate(
    file: File,
    walletAddress: string,
    donationId?: string
  ): Promise<ApiResponse<{
    fileName: string;
    publicUrl: string;
    fileSize: number;
    fileType: string;
  }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('walletAddress', walletAddress);
      if (donationId) formData.append('donationId', donationId);

      const response = await fetch(`${UPLOAD_BASE_URL}/certificate`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  // Get file info
  async getFileInfo(fileName: string): Promise<ApiResponse<{ file: any }>> {
    try {
      const response = await fetch(`${UPLOAD_BASE_URL}/info/${fileName}`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('File info fetch failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch file info',
      };
    }
  },

  // Delete file
  async deleteFile(fileName: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${UPLOAD_BASE_URL}/${fileName}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('File deletion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file',
      };
    }
  },
};

// Health check
export const healthApi = {
  async check(): Promise<ApiResponse<{ status: string; timestamp: string; version: string }>> {
    return apiCall('/health');
  },
};

// Export all APIs
export const api = {
  auth: authApi,
  bloodRequests: bloodRequestsApi,
  donations: donationsApi,
  bloodBanks: bloodBanksApi,
  notifications: notificationsApi,
  upload: uploadApi,
  health: healthApi,
};

export default api;