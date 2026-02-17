export type AITone = 'educational' | 'neutral';

export type AIContext = {
    tone: AITone;
    allowAdvice: boolean;
    allowPredictions: boolean;
};