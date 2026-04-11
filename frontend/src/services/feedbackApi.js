export const feedbackApi = {
    submitFeedback: async (rating, comment) => {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ rating, comment }),
        });

        if (!response.ok) {
            throw new Error(`Feedback submission failed: ${response.status}`);
        }
        return await response.json();
    },

    submitContact: async (formData) => {
        const response = await fetch("http://127.0.0.1:8000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Contact submission failed: ${response.status}`);
        }
        return await response.json();
    }
};
