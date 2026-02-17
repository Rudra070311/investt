import { EXPERIENCE_MAP } from "./experienceMap";
import { ExperienceConfig } from "../types/experience";

export function resolveExperience(ageGroup: 'minor' | 'adult'): ExperienceConfig {
    return EXPERIENCE_MAP[ageGroup];
}