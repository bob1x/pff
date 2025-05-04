// src/apis/applicationApi.ts

import API from "../client"

export interface Application {
    id: number
    applicant: string
    status: string
    applied_at: string
    total_score: number
    experience_score: number
    skills_score: number
    projects_score: number
    education_score: number
    job_title: string
}

export interface PaginatedApplications {
    results: Application[]
    count: number
}

export async function fetchLeaderboard(
    jobId: number,
    page: number = 1
): Promise<PaginatedApplications> {
    const res = await API.get<PaginatedApplications>("/applications/ApplicationViewSet/",{
        params: { job: jobId, page },
    })
    const data = res.data
    if (!data.results || typeof data.count !== "number") {
        throw new Error("Unexpected leaderboard response shape")
    }
    return data
}
