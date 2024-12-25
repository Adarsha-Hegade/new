export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  phoneNumber: string;
  profilePhoto?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'scored';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  documentUrl: string;
  points: number;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  submittedAt: string;
  score?: number;
  scoredAt?: string;
  scoredBy?: string;
}