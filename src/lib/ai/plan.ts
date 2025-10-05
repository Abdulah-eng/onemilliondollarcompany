import { postJson } from '@/lib/utils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function generateAIPersonalPlan(params: { userId: string }): Promise<{ plan: any }> {
  return await postJson(`${API_BASE}/api/ai/generate-plan`, params);
}

export async function generateAIMultiPlans(params: { userId: string }): Promise<{ items: Array<{ category: string; programId: string; status: 'ready' | 'processing' }> }> {
  return await postJson(`${API_BASE}/api/ai/generate-plans`, params);
}

export async function generateWeeklyAIFeedback(params: { userId: string; weekOf: string }): Promise<{ status: string }> {
  return await postJson(`${API_BASE}/api/ai/generate-weekly-feedback`, params);
}


