const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

export interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  username?: string | null;
  plan?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  risk: number;
  mrr: number;
  health: number;
  playbook: string;
}

export interface DashboardAlert {
  id: number;
  text: string;
  color: string;
  time: string;
}

export interface DashboardIntegration {
  id: number;
  name: string;
  status: string;
  lastSync: string;
}

export interface DashboardMetrics {
  monitoredMrr: number;
  monitoredMrrFormatted: string;
  avgChurnRisk: number;
  avgChurnRiskFormatted: string;
  recoveredRevenue: number;
  recoveredRevenueFormatted: string;
  activePlaybooks: number;
  activePlaybooksFormatted: string;
  mrrTrend: string;
  churnTrend: string;
  recoveredTrend: string;
}

export interface DashboardData {
  user: User;
  metrics: DashboardMetrics;
  customers: Customer[];
  alerts: DashboardAlert[];
  integrations: DashboardIntegration[];
  lastSync: string;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function setUser(user: User) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      `Cannot reach API at ${API_URL}. Make sure the backend is running (npm run dev:api).`
    );
  }

  let data: { message?: string };
  try {
    data = await response.json();
  } catch {
    throw new Error(
      response.ok
        ? 'Invalid response from server'
        : `Server error (${response.status}). Is the backend running on port 5000?`
    );
  }

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data as T;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  company: string;
  username?: string;
  plan?: string;
}) {
  const data = await apiFetch<{
    success: boolean;
    token: string;
    user: User;
    message: string;
  }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function loginUser(email: string, password: string) {
  const data = await apiFetch<{
    success: boolean;
    token: string;
    user: User;
    message: string;
  }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function fetchDashboard(search?: string): Promise<DashboardData> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const data = await apiFetch<{ success: boolean } & DashboardData>(
    `/api/dashboard${query}`
  );
  return data;
}

export async function triggerCustomerNudge(customerId: number) {
  return apiFetch<{ success: boolean; message: string; customer: Customer }>(
    `/api/dashboard/customers/${customerId}/trigger`,
    { method: 'POST' }
  );
}

export async function exportCustomersCsv() {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/dashboard/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Export failed');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'churn-customers.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function updateProfile(payload: {
  name: string;
  company: string;
  username?: string;
  plan?: string;
}) {
  const data = await apiFetch<{
    success: boolean;
    user: User;
    message: string;
  }>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  setUser(data.user);
  return data;
}

export async function updatePassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  return apiFetch<{
    success: boolean;
    message: string;
  }>('/api/auth/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function fetchPrediction(
  logins: number,
  tickets: number,
  invoiceDays: number
): Promise<{ success: boolean; risk: number; source: 'flask' | 'fallback' }> {
  return apiFetch<{
    success: boolean;
    risk: number;
    source: 'flask' | 'fallback';
  }>('/api/dashboard/predict', {
    method: 'POST',
    body: JSON.stringify({ logins, tickets, invoiceDays }),
  });
}
