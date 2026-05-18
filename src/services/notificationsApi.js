import { API_BASE_URL, authHeaders } from "../../constants/api";

export const getNotifications = async () => {
    try {
        const request = await fetch(`${API_BASE_URL}/my-profile/notifications`, {
            method: "GET",
            headers: authHeaders(),
        })
        if (!request.ok) return null
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}
