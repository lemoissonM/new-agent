import axios from 'axios';
import { Fiche, StepDefinition, StepExecutionResult, FicheStep } from '../types/fiche.types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ficheApi = {
  create: async (fiche: Partial<Fiche>): Promise<Fiche> => {
    const response = await api.post<Fiche>('/fiches', fiche);
    return response.data;
  },

  get: async (id: string): Promise<Fiche> => {
    const response = await api.get<Fiche>(`/fiches/${id}`);
    return response.data;
  },

  getAll: async (limit = 50, offset = 0): Promise<Fiche[]> => {
    const response = await api.get<Fiche[]>('/fiches', { params: { limit, offset } });
    return response.data;
  },

  update: async (id: string, updates: Partial<Fiche>): Promise<Fiche> => {
    const response = await api.patch<Fiche>(`/fiches/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/fiches/${id}`);
  },

  getSteps: async (id: string): Promise<StepDefinition[]> => {
    const response = await api.get<StepDefinition[]>(`/fiches/${id}/steps`);
    return response.data;
  },

  executeStep: async (
    id: string,
    step: FicheStep,
    userFeedback?: string
  ): Promise<StepExecutionResult> => {
    const response = await api.post<StepExecutionResult>(
      `/fiches/${id}/steps/${step}/execute`,
      { userFeedback }
    );
    return response.data;
  },

  approveStep: async (id: string, step: FicheStep): Promise<{ currentStep: number; nextStep: StepDefinition | null; isCompleted: boolean }> => {
    const response = await api.post(`/fiches/${id}/steps/${step}/approve`);
    return response.data;
  },
};

export default api;