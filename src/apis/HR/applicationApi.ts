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

export interface ApplicationStats {
    total_applications: number
    scored_applications: number
    unscored_applications: number
    average_total_score: number
    average_experience_score: number
    average_skills_score: number
    average_projects_score: number
    average_education_score: number
}

/**
 * Leaderboard: paginated, scored applications for a single job.
 */
export async function fetchLeaderboard(
    jobId: number,
    page: number = 1
): Promise<PaginatedApplications> {
    const res = await API.get<PaginatedApplications>(
        "/applications/ApplicationViewSet/",
        { params: { job: jobId, page } }
    )
    const data = res.data
    if (!Array.isArray(data.results) || typeof data.count !== "number") {
        throw new Error("Unexpected leaderboard response shape")
    }
    return data
}

/**
 * Overall stats (total / scored / averages).
 * If jobId is passed, sends it as `?job=<id>`.
 */
export async function fetchApplicationStats(
    jobId?: number
): Promise<ApplicationStats> {
    // build only-if-present query
    const params: Record<string, number> = {}
    if (typeof jobId === "number") {
        params.job = jobId   // ← must be `job`, matching your DRF action
    }

    const res = await API.get<ApplicationStats>(
        "/applications/ApplicationStatViewSet/stats/",
        { params }
    )
    const data = res.data

    // basic shape-check
    if (
        typeof data.total_applications !== "number" ||
        typeof data.scored_applications !== "number" ||
        typeof data.unscored_applications !== "number"
    ) {
        throw new Error("Unexpected stats response shape")
    }

    return data
}
