export interface User {
    _id: UserId;
    name: string;
    nickname?: string;
    email: string;
    role: string;
    lastLogin: string;
    createdAt: string;
}

export type UserId = string; 