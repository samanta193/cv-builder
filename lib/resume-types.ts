/* ------------------------------------------------------------------ *
 * RESUME DATA MODEL
 *
 * One shared definition of the shape stored in the `resumes.data`
 * JSONB column. The builder, the dashboard and the My CVs page all
 * use this so a saved CV can always be reconstructed exactly.
 * ------------------------------------------------------------------ */

export type TemplateId = "modern" | "professional" | "ats" | "executive";

export const TEMPLATE_IDS: TemplateId[] = [
  "modern",
  "professional",
  "ats",
  "executive",
];

export type ResumeForm = {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
};

export type ExperienceItem = {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type EducationItem = {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type ProjectItem = {
  name: string;
  description: string;
  link: string;
};

export type ResumeContent = {
  form: ResumeForm;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  selectedTemplate: TemplateId;
};

/* A row of the `resumes` table. */
export type ResumeRecord = {
  id: string;
  user_id: string;
  title: string;
  data: ResumeContent;
  created_at: string;
  updated_at: string;
};

/* Lightweight row used by list views (no heavy `data` payload). */
export type ResumeSummary = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export const DEFAULT_RESUME_TITLE = "My Resume";

export const emptyForm = (): ResumeForm => ({
  name: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
});

export const emptyExperience = (): ExperienceItem => ({
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
});

export const emptyEducation = (): EducationItem => ({
  degree: "",
  institution: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
});

export const emptyProject = (): ProjectItem => ({
  name: "",
  description: "",
  link: "",
});

export const emptyResumeContent = (): ResumeContent => ({
  form: emptyForm(),
  experiences: [emptyExperience()],
  educations: [emptyEducation()],
  skills: [],
  projects: [emptyProject()],
  selectedTemplate: "modern",
});

/* ------------------------------------------------------------------ *
 * NORMALISATION
 *
 * Rows saved by earlier versions of the app may be missing newer
 * fields (linkedin / github / portfolio / projects / template). This
 * fills in whatever is absent so loading an old CV never crashes the
 * builder.
 * ------------------------------------------------------------------ */

type Loose = Record<string, unknown>;

const str = (value: unknown): string =>
  typeof value === "string" ? value : "";

export function normalizeResumeContent(raw: unknown): ResumeContent {
  const base = emptyResumeContent();

  if (!raw || typeof raw !== "object") return base;

  const source = raw as Loose;
  const rawForm = (source.form ?? {}) as Loose;

  const form: ResumeForm = {
    name: str(rawForm.name),
    jobTitle: str(rawForm.jobTitle),
    email: str(rawForm.email),
    phone: str(rawForm.phone),
    location: str(rawForm.location),
    linkedin: str(rawForm.linkedin),
    github: str(rawForm.github),
    portfolio: str(rawForm.portfolio),
    summary: str(rawForm.summary),
  };

  const experiences = Array.isArray(source.experiences)
    ? (source.experiences as Loose[]).map((item) => ({
        jobTitle: str(item?.jobTitle),
        company: str(item?.company),
        location: str(item?.location),
        startDate: str(item?.startDate),
        endDate: str(item?.endDate),
        description: str(item?.description),
      }))
    : [];

  const educations = Array.isArray(source.educations)
    ? (source.educations as Loose[]).map((item) => ({
        degree: str(item?.degree),
        institution: str(item?.institution),
        location: str(item?.location),
        startDate: str(item?.startDate),
        endDate: str(item?.endDate),
        description: str(item?.description),
      }))
    : [];

  const projects = Array.isArray(source.projects)
    ? (source.projects as Loose[]).map((item) => ({
        name: str(item?.name),
        description: str(item?.description),
        link: str(item?.link),
      }))
    : [];

  const skills = Array.isArray(source.skills)
    ? (source.skills as unknown[]).filter(
        (item): item is string => typeof item === "string"
      )
    : [];

  const template = str(source.selectedTemplate) as TemplateId;

  return {
    form,
    experiences: experiences.length > 0 ? experiences : base.experiences,
    educations: educations.length > 0 ? educations : base.educations,
    skills,
    projects: projects.length > 0 ? projects : base.projects,
    selectedTemplate: TEMPLATE_IDS.includes(template) ? template : "modern",
  };
}

/* Title fallback used on save and in list views. */
export function resolveResumeTitle(
  title: string | null | undefined,
  form?: ResumeForm
): string {
  const trimmed = (title ?? "").trim();
  if (trimmed) return trimmed;

  const name = (form?.name ?? "").trim();
  if (name) return `${name} Resume`;

  return DEFAULT_RESUME_TITLE;
}
