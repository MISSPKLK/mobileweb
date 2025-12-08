import { EmailOtpType } from "../../../../../../../node_modules/@supabase/auth-js/dist/module/index";

export interface Student {
    id: string;
    title_name: string;
    first_name: string;
    last_name: string;
    email: string;
    year: number;
    major: string;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}