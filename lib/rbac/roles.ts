export const Roles = {
    ADMIN: 'admin',
    LEARNER: 'learner',
    CREATOR: 'creator',
} as const;

export type Role = typeof Roles[keyof typeof Roles];