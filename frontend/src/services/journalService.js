import api from './api';

export const journalService = {
    /** GET /api/journal */
    getEntries: async (page = 1) => {
        const { data } = await api.get(`/journal?page=${page}`);
        return data;
    },

    /** POST /api/journal */
    createEntry: async (title, content, mood_tag) => {
        const { data } = await api.post('/journal', { title, content, mood_tag });
        return data;
    },

    /** DELETE /api/journal/:id */
    deleteEntry: async (id) => {
        const { data } = await api.delete(`/journal/${id}`);
        return data;
    },
};
