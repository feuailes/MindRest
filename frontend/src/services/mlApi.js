import axios from "axios";
export const mlApi = {
    getPrediction: async (inputs) => {
        // 1. Retrieve the token saved during login
        const token = localStorage.getItem("token");

        // Simple safety check
        if (!token) {
            console.error("No authentication token found. Please log in.");
            throw new Error("Authentication required");
        }

        const response = await fetch("http://127.0.0.1:8000/api/assessment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                // 2. Bearer token allows access to the protected Laravel group
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                sleep_hours: inputs.sleep,
                stress_level: inputs.stress,
                screen_time: inputs.screentime,
                mood_rating: inputs.mood
            }),
        });

        // 3. Robust error handling
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            console.error("Laravel Error Response:", errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // 4. Return the full object so Assessment.jsx can access data.risk_label
        return data;
    },
};