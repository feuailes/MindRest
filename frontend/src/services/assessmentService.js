import api from './api';

export const assessmentService = {
    /** POST /api/assessment */
    submit: async (payload) => {
        // payload: { sleep_hours, stress_level, screen_time, mood_rating }
        const { data } = await api.post('/assessment', payload);
        return data;
    },

    /** GET /api/assessment — history */
    getHistory: async () => {
        const { data } = await api.get('/assessment');
        return data;
    },
};
