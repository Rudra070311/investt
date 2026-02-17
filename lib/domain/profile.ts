import { Role } from "../rbac/roles"

export type Profile = {
    id: string;
    role: Role;
    ageGroup: 'minor' | 'adult';
};