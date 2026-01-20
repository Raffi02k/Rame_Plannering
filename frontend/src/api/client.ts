const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchFromApi(path: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        }
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }

    return res.json();
}

export const api = {
    login: async (username: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const res = await fetch(`${API_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    },
    getMe: async (token: string) => {
        const data = await fetchFromApi('/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { ...data, unitId: data.unit_id };
    },
    getDaySchedule: (unitId: string, date: string) => fetchFromApi(`/schedule/day?unitId=${unitId}&date=${date}`),
    updateTaskStatus: (templateId: string, data: any) => fetchFromApi(`/task-instances/${templateId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            ...data,
            report_data: data.reportData // Map frontend camelCase to backend snake_case
        })
    }),
    createTask: (task: any) => fetchFromApi('/tasks', {
        method: 'POST',
        body: JSON.stringify({
            unit_id: task.unitId,
            title: task.title,
            description: task.description,
            substitute_instructions: task.substituteInstructions,
            category: task.category,
            role_type: task.roleType || 'admin_day', // Default role?
            is_shared: task.isShared || false,
            valid_on_date: task.validOnDate, // Pass specific date if set
            meta_data: {
                ...task.meta,
                timeStart: task.timeStart,
                timeEnd: task.timeEnd,
                requiresSign: task.requiresSign,
                assigneeId: task.assigneeId
            }
        })
    }),
    deleteTask: (taskId: string) => fetchFromApi(`/tasks/${taskId}`, { method: 'DELETE' })
};
