import { ca } from "date-fns/locale";

export interface AttackLog {
    id: string;
    ip: string;
    username: string;
    password: string;
    timestamp: string;
    threat_score: number;       
    attack_type: string;        
    ai_analysis: string;
}

export interface ApiResponse {
    success: boolean;
    count: number;
    data: AttackLog[];
}

export const fetchAttacks = async (): Promise<ApiResponse> => {
    try {
        const response = await fetch("http://shadow-api-gateway:3000/api/attacks", {
            cache: "no-store",
        });
        if (!response.ok) {
            throw new Error("Failed to fecth threat");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, count: 0, data: [] };
    }
};