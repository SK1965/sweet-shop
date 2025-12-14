import api from '../lib/axios';

export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'customer';
}

export const register = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: any) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// We might not have a dedicated /me endpoint yet, but for now we can rely on 
// the fact that after login we have the user details. 
// If we reload, we might need to persistent state or fetch user.
// Since the backend doesn't have a /me endpoint, we'll implement one or 
// just rely on client side state for this session (less robust on reload).
// For a robust app, we should add /me to backend.
// Let's add a placeholder for now or stick to checking based on cookies availability if possible (not possible from JS).
// I will assume for now we get user on login. on Reload, we might be "logged out" in UI if we don't persist.
// To fix this, I'll add a simple localStorage persistence for 'user' as a backup, 
// strictly for UI state (token is still in cookie).
