// app/services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://clarity-florence-sunshine-alter.trycloudflare.com/api';

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
  fechaRecordatorio?: string;
}

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
}

const getHeaders = async () => {
  const userData = await AsyncStorage.getItem('user');
  const headers: any = {
    'Content-Type': 'application/json',
  };
  if (userData) {
    const user = JSON.parse(userData);
    headers['X-User-Id'] = user.id.toString();
  }
  return headers;
};

export const api = {
  getTareas: async (): Promise<Tarea[]> => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_BASE_URL}/tareas`, { headers });
      if (!response.ok) throw new Error('Error fetching tareas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tareas:', error);
      throw error;
    }
  },

  getTarea: async (id: number): Promise<Tarea> => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, { headers });
      if (!response.ok) throw new Error(`Error fetching tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tarea ${id}:`, error);
      throw error;
    }
  },

  createTarea: async (tarea: Omit<Tarea, 'id'>): Promise<Tarea> => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_BASE_URL}/tareas`, {
        method: 'POST',
        headers,
        body: JSON.stringify(tarea)
      });
      if (!response.ok) throw new Error('Error creating tarea');
      return await response.json();
    } catch (error) {
      console.error('Error creating tarea:', error);
      throw error;
    }
  },

  updateTarea: async (id: number, tarea: Partial<Tarea>): Promise<Tarea> => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(tarea)
      });
      if (!response.ok) throw new Error(`Error updating tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating tarea ${id}:`, error);
      throw error;
    }
  },

  deleteTarea: async (id: number): Promise<void> => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error(`Error deleting tarea ${id}`);
    } catch (error) {
      console.error(`Error deleting tarea ${id}:`, error);
      throw error;
    }
  },

  login: async (username: string, password: string): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Login fallido');
    return await response.json();
  },

  register: async (username: string, password: string, nombre: string): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, nombre })
    });
    if (!response.ok) throw new Error('Registro fallido');
    return await response.json();
  }
};