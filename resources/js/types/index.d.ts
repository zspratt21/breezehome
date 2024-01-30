export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    avatar: string;
    two_factor_enabled: 1 | 0;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
