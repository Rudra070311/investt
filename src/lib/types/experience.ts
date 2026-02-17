export type ExperienceLevel = 'restricted' | 'guided' | 'full';

export type ExperienceConfig = {
    level: ExperienceLevel;
    allowedAdvancedSimulation: boolean;
    showRiskWarnings: boolean;
    aiTone: 'simple' | 'full';
};