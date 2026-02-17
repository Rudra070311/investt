export function resolveAgePolicy(ageGroup: 'minor' | 'adult') {
    return {
        allowAdvancedSimulation: ageGroup === 'adult',
        aiComplexity: ageGroup === 'adult' ? 'full' : 'simple',
    }
}