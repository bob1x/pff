// src/apis/jobApi.ts
import API from './client'

export interface Job {
    id: number
    title: string
    full_description: string
    category: string
    location: string
    experience_level: string
    created_at: string
}

export interface JobQueryParams {
    category?: string
    location?: string
    experience_level?: string
    search?: string
    ordering?: string
}

// src/apis/jobApi.ts
const jobApi = {
    async getPaginated(params: JobQueryParams & { page?: number }) {
        const res = await API.get('/jobs/JobPosting/', { params });
        

        const data = res.data;

        if (data && Array.isArray(data.results)) {
            return {
                results: data.results,
                count: data.count
            };
        }

        throw new Error("Unexpected API response format");
    },
};


export default jobApi
