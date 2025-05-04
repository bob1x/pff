// src/apis/jobApi.ts
import API from './client'

export interface Job {
    id: number
    title: string
    company_name: string

    // ── replaced full_description with discrete sections ──
    job_description: string
    required_skills: string
    required_experience: string
    required_education: string

    category: string
    location: string
    experience_level: string
    contract_type: "Full time" | "Part Time" | "Internship" | "Contract" | "Freelance"
    application_start: string
    application_deadline: string | null
    is_open: boolean
    created_at: string
}

export interface JobQueryParams {
    category?: string
    location?: string
    experience_level?: string
    contract_type?: string
    open?: boolean
    search?: string
    ordering?: string
    page?: number
}

const jobApi = {
    async getPaginated(params: JobQueryParams & { page?: number }) {
        const res = await API.get('/jobs/JobPosting/', { params })
        const data = res.data

        if (data && Array.isArray(data.results)) {
            return {
                results: data.results as Job[],
                count: data.count as number
            }
        }

        throw new Error("Unexpected API response format")
    },
}

export default jobApi
