import { AgeGroup } from "./user";

export type UserRole = 'learner' | 'creator' | 'admin';

export type Profile = {
    id: string;
    role: UserRole;
    ageGroup: AgeGroup;
    displayName: string;
    avatarUrl?: string;
};