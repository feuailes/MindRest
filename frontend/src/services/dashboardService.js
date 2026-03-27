import api from './api';

export const dashboardService = {
    /** GET /api/dashboard */
    getData: async () => {
        const { data } = await api.get('/dashboard');
        return data;
    },
};

export const exerciseService = {
    /** GET /api/exercises */
    getAll: async () => {
        const { data } = await api.get('/exercises');
        return data;
    },
};

export const gameService = {
    /** GET /api/games */
    getAll: async () => {
        const { data } = await api.get('/games');
        return data;
    },
};

export const activityService = {
    /** POST /api/activity-logs */
    log: async (activityType, duration, exerciseId = null, gameId = null) => {
        const { data } = await api.post('/activity-logs', {
            activity_type: activityType,
            duration_minutes: duration,
            exercise_id: exerciseId,
            game_id: gameId
        });
        return data;
    }
};
