import axios from "axios";
import { API_BASE_URL } from "./authService";

export const metaService = {

    putMeta: async (meta: any, userId: number, accessToken: string): Promise<void> => {
        try {
            console.log("Meta:", meta);
            console.log("UserId:", userId);
            console.log("AccessToken:", accessToken);
            await axios.put(`${API_BASE_URL}/users/${userId}/meta`, { meta }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error: any) {
            console.error(
                "Failed to fetch user:",
                error.response?.data || error.message
            );
            throw new Error("Failed to fetch user");
        }
    },
};
