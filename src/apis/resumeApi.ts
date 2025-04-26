// src/apis/resumeApi.ts
import API from './client'
import type { RawParsedResume } from "@/lib/parsing/types";
/**
 * The shape of the record returned by UploadedResumeSerializer.
 * Adjust fields to match exactly what your serializer outputs.
 */
export interface UploadedResume {
    id: number
    file: string         // URL to the stored PDF
    status: string       // e.g. "parsed", "pending"
    created_at: string   // ISO timestamp
    updated_at: string   // ISO timestamp
}

/**
 * The shape of the JSON you save in ParsedResume.parsed_json.
 * This matches your parse_resume output exactly:
 * - name: full name + title
 * - contact: { email, phone }
 * - summary: string
 * - skills: comma‑separated string
 * - experience: array of job entries
 * - education: big text blob
 */
export interface ParsedExperienceEntry {
    job_title: string
    company: string
    dates: string | null
    descriptions: string[]
}

export interface ParsedResumeData {
    name: string
    contact: {
        email: string
        phone: string
    }
    summary: string
    skills: string
    experience: ParsedExperienceEntry[]
    education: string
}


const resumeApi = {
    async upload(file: File): Promise<UploadedResume & { parsed_json?: ParsedResumeData }> {
        const form = new FormData()
        form.append('file', file)
        const res = await API.post<UploadedResume & { parsed_json?: ParsedResumeData }>(
            '/resumes/ResumeUpload/',  // must match your DRF prefix exactly
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        return res.data
    },
    // if you still need a separate fetch:
    async getParsedResume(id: number): Promise<RawParsedResume> {
        const { data } = await API.get<RawParsedResume>(`resumes/ParsedResume/${id}/`);
        return data;
    },
}

export default resumeApi
