import type { RawParsedResume } from "./types";
import type {
    Resume,
    ResumeProfile,
    ResumeWorkExperience,
    ResumeEducation,
    ResumeProject,
    ResumeSkills,
} from "../redux/types";

export function normalizeParsed(parsed: RawParsedResume): Resume {
    // PROFILE
    const profile: ResumeProfile = {
        name: parsed.name.replace(/\n/g, " ").trim(),
        summary: parsed.profile?.trim() || "",
        email: parsed.contact.email?.trim() || "",
        phone: parsed.contact.phone?.trim() || "",

        location: parsed.contact.location?.trim() || "",

        // try multiple fallbacks: linkedin, website, generic url
        url:
            (parsed.contact.linkedin?.trim() || "")
            || (parsed.contact.website?.trim() || "")
            || (parsed.contact.url?.trim() || "")
            || "",
    };

    // EXPERIENCE
    const workExperiences: ResumeWorkExperience[] =
        (parsed.experience || []).map(e => ({
            company: "",        // parser doesn’t separate company
            jobTitle: e.title,
            date: e.duration || "",
            descriptions: e.description
                .map(item => item.replace(/^•\s*/, '').trim()),
        }));

    // PROJECTS
    const projects: ResumeProject[] =
        (parsed.projects || []).map(p => ({
            project: p.title,
            date: "",
            descriptions: p.description
                .map(item => item.replace(/^•\s*/, '').trim()),
        }));

    // SKILLS
    let skillsList: string[] = [];

    if (typeof parsed.skills === "string") {
        skillsList = parsed.skills
            .split("•")
            .map((s) => s.trim())
            .filter(Boolean);
    } else if (Array.isArray(parsed.skills)) {
        skillsList = parsed.skills;
    }

    const skills: ResumeSkills = {
        featuredSkills: [],
        descriptions: skillsList,
    };

    // EDUCATION
    const educations: ResumeEducation[] = parsed.education
        ? [
            {
                school: "",
                degree: "",
                gpa: "",
                date: "",
                descriptions: parsed.education
                    .split("\n")
                    .map((l) => l.replace(/^•\s*/, '').trim())
                    .filter(Boolean),
            },
        ]
        : [];

    // CUSTOM (certifications + leadership + additional) - strip bullets
    const rawCustom = [
        ...(parsed.certifications || []),
        ...(parsed.leadership || []),
        ...(parsed.additional_information || []),
    ];
    const customDescriptions = rawCustom
        .map(item => item.replace(/^•\s*/, '').trim())
        .filter(Boolean);

    return {
        profile,
        workExperiences,
        educations,
        projects,
        skills,
        custom: { descriptions: customDescriptions },
    };
}
