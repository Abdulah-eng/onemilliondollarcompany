import { postJson } from '@/lib/utils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function generateAIPersonalPlan(params: { userId: string }): Promise<{ plan: any }> {
  return await postJson(`${API_BASE}/api/ai/generate-plan`, params);
}


