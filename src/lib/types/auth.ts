export type SessionUser = {
    id: string;
    email: string;
};

export type AuthSession = {
    user: SessionUser;
    expiresAt: string;
};