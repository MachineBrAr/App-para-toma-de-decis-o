import { SavedDecision, DecisionAnalysisResponse } from '../types/decision';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions_v1';

export function getSavedDecisions(): SavedDecision[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse saved decisions:', err);
    return [];
  }
}

export function saveDecisionToHistory(decision: {
  title: string;
  context?: string;
  options: string[];
  language: 'pt' | 'en';
  data: DecisionAnalysisResponse;
}): SavedDecision {
  const current = getSavedDecisions();
  const newDecision: SavedDecision = {
    id: `dec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: decision.title,
    context: decision.context,
    options: decision.options,
    language: decision.language,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: decision.data,
    status: 'reviewing',
  };

  const updated = [newDecision, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to store decision in localStorage:', err);
  }
  return newDecision;
}

export function updateSavedDecision(id: string, partial: Partial<SavedDecision>): SavedDecision[] {
  const current = getSavedDecisions();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...partial,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update decision:', err);
  }
  return updated;
}

export function deleteSavedDecision(id: string): SavedDecision[] {
  const current = getSavedDecisions();
  const filtered = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete decision:', err);
  }
  return filtered;
}
