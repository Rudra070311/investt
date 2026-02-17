import { ExperienceConfig } from "../types/experience";

export const EXPERIENCE_MAP: Record<
    'minor' | 'adult',
    ExperienceConfig
> = {
    minor: {
        level: 'guided',
        allowedAdvancedSimulation: false,
        showRiskWarnings: true,
        aiTone: 'simple',
    },
    adult: {
        level: 'full',
        allowedAdvancedSimulation: true,
        showRiskWarnings: false,
        aiTone: 'full',
    },
};