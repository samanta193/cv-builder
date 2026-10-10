"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import AppNav from "@/app/components/AppNav";
import { AiImprove, AiReview, JobMatch } from "./AiAssistant";
import { ResumePreview } from "./templates";
import { generateResumePdf } from "@/lib/pdf";
import { errorMessage, getResume, saveResume } from "@/lib/resumes";
import { useAuthUser } from "@/lib/useAuthUser";
import {
  DEFAULT_RESUME_TITLE,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeContent,
  ResumeForm,
  TemplateId,
  emptyEducation,
  emptyExperience,
  emptyForm,
  emptyProject,
  resolveResumeTitle,
} from "@/lib/resume-types";

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50">
          <AppNav />
          <div className="mx-auto max-w-7xl px-6 py-16 text-center text-slate-500">
            Loading the builder...
          </div>
        </main>
      }
    >
      <Builder />
    </Suspense>
  );
}

function Builder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuthUser();

  const [showPayment, setShowPayment] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("modern");
  const resumeRef = useRef<HTMLDivElement>(null);

  /* Saved-CV state */
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [loadingResume, setLoadingResume] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saveNotice, setSaveNotice] = useState("");
  const [downloading, setDownloading] = useState(false);

  const [form, setForm] = useState<ResumeForm>(emptyForm());

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    emptyExperience(),
  ]);

  const [educations, setEducations] = useState<EducationItem[]>([
    emptyEducation(),
  ]);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [projects, setProjects] = useState<ProjectItem[]>([emptyProject()]);
  /* ---------------------------------------------------------------- *
   * LOAD AN EXISTING CV (/builder?id=...)
   *
   * Fills the builder with the stored content, including the template
   * that was selected when the CV was saved.
   * ---------------------------------------------------------------- */

  const idParam = searchParams.get("id");

  useEffect(() => {
    if (!idParam) {
      /* Fresh CV - nothing is written to the database until Save. */
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets the editor when the ?id param is removed
      setResumeId(null);
      return;
    }

    if (authLoading || !user) return;

    let active = true;

    const loadResume = async () => {
      setLoadingResume(true);
      setLoadError("");

      try {
        const record = await getResume(idParam);
        if (!active) return;

        const saved = record.data;

        setResumeId(record.id);
        setTitle(record.title || "");
        setForm(saved.form);
        setExperiences(saved.experiences);
        setEducations(saved.educations);
        setSkills(saved.skills);
        setProjects(saved.projects);
        setSelectedTemplate(saved.selectedTemplate);
        setSavedAt(new Date(record.updated_at));
      } catch (caught) {
        if (!active) return;
        setLoadError(errorMessage(caught, "We couldn't open that CV."));
      } finally {
        if (active) setLoadingResume(false);
      }
    };

    loadResume();

    return () => {
      active = false;
    };
  }, [idParam, authLoading, user]);

  const updateField = (field: string, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateExperience = (
    index: number,
    field: string,
    value: string
  ) => {
    setExperiences((previous) =>
      previous.map((experience, i) =>
        i === index
          ? { ...experience, [field]: value }
          : experience
      )
    );
  };

  const addExperience = () => {
    setExperiences((previous) => [
      ...previous,
      {
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const updateEducation = (
    index: number,
    field: string,
    value: string
  ) => {
    setEducations((previous) =>
      previous.map((education, i) =>
        i === index
          ? { ...education, [field]: value }
          : education
      )
    );
  };

  const addEducation = () => {
    setEducations((previous) => [
      ...previous,
      {
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducations((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const addSkill = () => {
    const newSkill = skillInput.trim();

    if (!newSkill) return;

    if (skills.includes(newSkill)) {
      setSkillInput("");
      return;
    }

    setSkills((previous) => [...previous, newSkill]);
    setSkillInput("");
  };

  const removeSkill = (index: number) => {
    setSkills((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };
const buildResumeText = () => {
  const lines: string[] = [];

  lines.push(`Name: ${form.name}`);
  if (form.jobTitle) lines.push(`Title: ${form.jobTitle}`);
  const contact = [form.email, form.phone, form.location]
    .filter(Boolean)
    .join(" | ");
  if (contact) lines.push(`Contact: ${contact}`);
  const links = [form.linkedin, form.github, form.portfolio]
    .filter(Boolean)
    .join(" | ");
  if (links) lines.push(`Links: ${links}`);

  if (form.summary) {
    lines.push("", "PROFESSIONAL SUMMARY", form.summary);
  }

  const filledExperiences = experiences.filter(
    (experience) =>
      experience.jobTitle || experience.company || experience.description
  );
  if (filledExperiences.length > 0) {
    lines.push("", "WORK EXPERIENCE");
    filledExperiences.forEach((experience) => {
      lines.push(
        `${experience.jobTitle || "(no title)"} at ${
          experience.company || "(no company)"
        }${experience.location ? ", " + experience.location : ""} (${
          experience.startDate || "?"
        } - ${experience.endDate || "?"})`
      );
      if (experience.description) lines.push(experience.description);
      lines.push("");
    });
  }

  const filledEducations = educations.filter(
    (education) => education.degree || education.institution
  );
  if (filledEducations.length > 0) {
    lines.push("", "EDUCATION");
    filledEducations.forEach((education) => {
      lines.push(
        `${education.degree || "(no degree)"} - ${
          education.institution || "(no institution)"
        } (${education.startDate || "?"} - ${education.endDate || "?"})`
      );
      if (education.description) lines.push(education.description);
    });
  }

  if (skills.length > 0) {
    lines.push("", "SKILLS", skills.join(", "));
  }

  const filledProjects = projects.filter(
    (project) => project.name || project.description
  );
  if (filledProjects.length > 0) {
    lines.push("", "PROJECTS");
    filledProjects.forEach((project) => {
      lines.push(project.name || "(unnamed project)");
      if (project.description) lines.push(project.description);
      if (project.link) lines.push(project.link);
      lines.push("");
    });
  }

  return lines.join("\n").trim();
};
  /* ---------------------------------------------------------------- *
   * SAVE
   *
   * Inserts when this CV has no database id yet, updates the SAME row
   * every time afterwards - so repeated saves never create duplicates.
   * ---------------------------------------------------------------- */

  const collectContent = useCallback(
    (): ResumeContent => ({
      form,
      experiences,
      educations,
      skills,
      projects,
      selectedTemplate,
    }),
    [form, experiences, educations, skills, projects, selectedTemplate]
  );

  const handleSaveResume = async () => {
    if (!user) {
      setSaveError("Please log in before saving your CV.");
      router.push("/login");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveNotice("");

    try {
      const record = await saveResume(resumeId, title, collectContent());

      setResumeId(record.id);
      setTitle(record.title);
      setSavedAt(new Date(record.updated_at ?? Date.now()));
      setSaveNotice("CV saved successfully.");

      /* Keep the id in the URL so a refresh reopens the same record. */
      if (!resumeId) {
        router.replace(`/builder?id=${record.id}`);
      }
    } catch (caught) {
      setSaveError(errorMessage(caught, "We couldn't save your CV."));
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;

    setDownloading(true);

    try {
      await generateResumePdf(
        resumeRef.current,
        resolveResumeTitle(title, form)
      );
    } catch (caught) {
      console.error(caught);
      setSaveError("We couldn't generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  /* Clear the success toast after a few seconds. */
  useEffect(() => {
    if (!saveNotice) return;
    const timer = setTimeout(() => setSaveNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [saveNotice]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppNav />
        <div className="mx-auto max-w-7xl px-6 py-16 text-center text-slate-500">
          Loading your builder...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-100">
      {/* HEADER */}
      <AppNav
        user={user}
        right={
          <span className="hidden items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 sm:inline-flex">
            <span>✦</span> AI-powered
          </span>
        }
      />

      {/* BUILDER */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-2">

        {/* LEFT SIDE — FORM */}
        <section>
          <div className="mb-6">
            <p className="font-semibold text-cyan-500">RESUME BUILDER</p>

            <h1 className="mt-2 text-4xl font-bold text-slate-950">
              {resumeId ? "Edit your CV" : "Create your CV"}
            </h1>

            <p className="mt-2 text-slate-500">
              Enter your information and see your resume update instantly.
            </p>
          </div>

          {loadingResume && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
              Opening your saved CV...
            </div>
          )}

          {loadError && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              <span>{loadError}</span>

              <Link
                href="/my-resumes"
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                Back to My CVs
              </Link>
            </div>
          )}

          {/* CV NAME */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">CV Name</h2>

            <p className="mt-1 text-sm text-slate-500">
              Give this CV a name so you can find it later, for example
              &quot;Software Engineer CV&quot;.
            </p>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={DEFAULT_RESUME_TITLE}
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          <div className="space-y-6">
{/* TEMPLATE SELECTOR */}
<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold text-slate-950">
    Choose a Template
  </h2>

  <p className="mt-1 text-sm text-slate-500">
    Select a design for your resume.
  </p>

  <div className="mt-5 grid gap-3 sm:grid-cols-2">

    <button
      type="button"
      onClick={() => setSelectedTemplate("modern")}
      className={`rounded-xl border p-4 text-left transition ${
        selectedTemplate === "modern"
          ? "border-cyan-400 bg-cyan-50 ring-2 ring-cyan-100"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <p className="font-bold text-slate-950">
        Modern
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Clean and modern design
      </p>
    </button>

    <button
      type="button"
      onClick={() => setSelectedTemplate("professional")}
      className={`rounded-xl border p-4 text-left transition ${
        selectedTemplate === "professional"
          ? "border-cyan-400 bg-cyan-50 ring-2 ring-cyan-100"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <p className="font-bold text-slate-950">
        Professional
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Traditional professional style
      </p>
    </button>

    <button
      type="button"
      onClick={() => setSelectedTemplate("ats")}
      className={`rounded-xl border p-4 text-left transition ${
        selectedTemplate === "ats"
          ? "border-cyan-400 bg-cyan-50 ring-2 ring-cyan-100"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <p className="font-bold text-slate-950">
        ATS Simple
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Simple and ATS-friendly
      </p>
    </button>

    <button
      type="button"
      onClick={() => setSelectedTemplate("executive")}
      className={`rounded-xl border p-4 text-left transition ${
        selectedTemplate === "executive"
          ? "border-cyan-400 bg-cyan-50 ring-2 ring-cyan-100"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <p className="font-bold text-slate-950">
        Executive
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Elegant executive layout
      </p>
    </button>

  </div>
</div> 
            {/* PERSONAL INFORMATION */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Personal Information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <Input
                  label="Full Name"
                  placeholder="Alex Morgan"
                  value={form.name}
                  onChange={(value) =>
                    updateField("name", value)
                  }
                />

                <Input
                  label="Job Title"
                  placeholder="Product Designer"
                  value={form.jobTitle}
                  onChange={(value) =>
                    updateField("jobTitle", value)
                  }
                />

                <Input
                  label="Email"
                  placeholder="alex@email.com"
                  value={form.email}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                />

                <Input
                  label="Phone"
                  placeholder="+880 1XXXXXXXXX"
                  value={form.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Location"
                    placeholder="Dhaka, Bangladesh"
                    value={form.location}
                    onChange={(value) =>
                      updateField("location", value)
                    }
                  />
                  <Input
  label="LinkedIn"
  placeholder="https://linkedin.com/in/yourname"
  value={form.linkedin}
  onChange={(value) =>
    updateField("linkedin", value)
  }
/>

<Input
  label="GitHub"
  placeholder="https://github.com/yourname"
  value={form.github}
  onChange={(value) =>
    updateField("github", value)
  }
/>

<Input
  label="Portfolio / Website"
  placeholder="https://yourwebsite.com"
  value={form.portfolio}
  onChange={(value) =>
    updateField("portfolio", value)
  }
/>
                </div>

              </div>
            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Professional Summary
              </h2>

              <textarea
                rows={5}
                placeholder="Write a short professional summary about yourself..."
                value={form.summary}
                onChange={(e) =>
                  updateField("summary", e.target.value)
                }
                className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />

              <AiImprove
                field="summary"
                text={form.summary}
                context={{ jobTitle: form.jobTitle }}
                onAccept={(newText) => updateField("summary", newText)}
              />
            </div>

            {/* WORK EXPERIENCE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Work Experience
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add your previous jobs and professional experience.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                >
                  + Add Experience
                </button>

              </div>

              <div className="mt-6 space-y-6">

                {experiences.map((experience, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >

                    <div className="mb-5 flex items-center justify-between">

                      <h3 className="font-bold text-slate-900">
                        Experience {index + 1}
                      </h3>

                      {experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeExperience(index)
                          }
                          className="text-sm font-semibold text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <Input
                        label="Job Title"
                        placeholder="Junior Executive"
                        value={experience.jobTitle}
                        onChange={(value) =>
                          updateExperience(
                            index,
                            "jobTitle",
                            value
                          )
                        }
                      />

                      <Input
                        label="Company"
                        placeholder="Global Brand PLC"
                        value={experience.company}
                        onChange={(value) =>
                          updateExperience(
                            index,
                            "company",
                            value
                          )
                        }
                      />

                      <Input
                        label="Location"
                        placeholder="Dhaka, Bangladesh"
                        value={experience.location}
                        onChange={(value) =>
                          updateExperience(
                            index,
                            "location",
                            value
                          )
                        }
                      />

                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label className="text-sm font-semibold text-slate-700">
                            Start Date
                          </label>

                          <input
                            type="text"
                            placeholder="Aug 2025"
                            value={experience.startDate}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-slate-700">
                            End Date
                          </label>

                          <input
                            type="text"
                            placeholder="Present"
                            value={experience.endDate}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                          />
                        </div>

                      </div>

                    </div>

                    <div className="mt-4">

                      <label className="text-sm font-semibold text-slate-700">
                        Description
                      </label>

                      <textarea
                        rows={5}
                        placeholder="Describe your responsibilities and achievements..."
                        value={experience.description}
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                      />

                      <AiImprove
                        field="experience"
                        text={experience.description}
                        context={{
                          jobTitle: experience.jobTitle,
                          company: experience.company,
                        }}
                        onAccept={(newText) =>
                          updateExperience(index, "description", newText)
                        }
                      />

                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* EDUCATION */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Education
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add your educational background.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addEducation}
                  className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                >
                  + Add Education
                </button>

              </div>

              <div className="mt-6 space-y-6">

                {educations.map((education, index) => (

                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >

                    <div className="mb-5 flex items-center justify-between">

                      <h3 className="font-bold text-slate-900">
                        Education {index + 1}
                      </h3>

                      {educations.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeEducation(index)
                          }
                          className="text-sm font-semibold text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <Input
                        label="Degree / Qualification"
                        placeholder="Bachelor of Science in CSE"
                        value={education.degree}
                        onChange={(value) =>
                          updateEducation(
                            index,
                            "degree",
                            value
                          )
                        }
                      />

                      <Input
                        label="Institution"
                        placeholder="North South University"
                        value={education.institution}
                        onChange={(value) =>
                          updateEducation(
                            index,
                            "institution",
                            value
                          )
                        }
                      />

                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">

                      <Input
                        label="Location"
                        placeholder="Dhaka, Bangladesh"
                        value={education.location}
                        onChange={(value) =>
                          updateEducation(
                            index,
                            "location",
                            value
                          )
                        }
                      />

                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label className="text-sm font-semibold text-slate-700">
                            Start Date
                          </label>

                          <input
                            type="text"
                            placeholder="2020"
                            value={education.startDate}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-slate-700">
                            End Date
                          </label>

                          <input
                            type="text"
                            placeholder="2024"
                            value={education.endDate}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                          />
                        </div>

                      </div>

                    </div>

                    <div className="mt-4">

                      <label className="text-sm font-semibold text-slate-700">
                        Description
                      </label>

                      <textarea
                        rows={4}
                        placeholder="Add relevant achievements, coursework, GPA, honors, etc."
                        value={education.description}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                      />

                      <AiImprove
                        field="education"
                        text={education.description}
                        context={{
                          degree: education.degree,
                          institution: education.institution,
                        }}
                        onAccept={(newText) =>
                          updateEducation(index, "description", newText)
                        }
                      />

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* Projects */}
<div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
  <h2 className="text-xl font-bold text-slate-900">Projects</h2>
  <p className="mt-1 text-sm text-slate-500">
    Add projects that showcase your skills and experience.
  </p>

  {projects.map((project, index) => (
    <div
      key={index}
      className="mt-5 rounded-xl border border-slate-200 p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Project Name"
          placeholder="e.g. E-commerce Website"
          value={project.name}
          onChange={(value) => {
            setProjects((previous) =>
              previous.map((item, i) =>
                i === index ? { ...item, name: value } : item
              )
            );
          }}
        />

        <Input
          label="Project Link"
          placeholder="https://example.com"
          value={project.link}
          onChange={(value) => {
            setProjects((previous) =>
              previous.map((item, i) =>
                i === index ? { ...item, link: value } : item
              )
            );
          }}
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-[#19324a]">
          Description
        </label>

        <textarea
          value={project.description}
          onChange={(e) => {
            const value = e.target.value;

            setProjects((previous) =>
              previous.map((item, i) =>
                i === index ? { ...item, description: value } : item
              )
            );
          }}
          placeholder="Describe what you built, your role, and the technologies used."
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
        />

        <AiImprove
          field="project"
          text={project.description}
          context={{ projectName: project.name }}
          onAccept={(newText) => {
            setProjects((previous) =>
              previous.map((item, i) =>
                i === index ? { ...item, description: newText } : item
              )
            );
          }}
        />
      </div>

      {projects.length > 1 && (
        <button
          type="button"
          onClick={() => {
            setProjects((previous) =>
              previous.filter((_, i) => i !== index)
            );
          }}
          className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Remove Project
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={() => {
      setProjects((previous) => [
        ...previous,
        {
          name: "",
          description: "",
          link: "",
        },
      ]);
    }}
    className="mt-4 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-white hover:bg-cyan-600"
  >
    + Add Project
  </button>
</div>
            {/* SKILLS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-slate-950">
                Skills
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add skills that are relevant to your career.
              </p>

              <div className="mt-5 flex gap-3">

                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) =>
                    setSkillInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. React, Figma, Project Management"
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  Add
                </button>

              </div>

              {skills.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">

                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700"
                    >

                      <span>{skill}</span>

                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="font-bold text-cyan-500 hover:text-red-500"
                      >
                        ×
                      </button>

                    </div>
                  ))}

                </div>
              )}

              {skills.length === 0 && (
                <p className="mt-4 text-sm text-slate-400">
                  Add your first skill above.
                </p>
              )}

            </div>

            {/* AI TOOLS */}
            <div className="rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-300 to-cyan-400 p-[1.5px] shadow-lg shadow-cyan-500/10">
              <div className="rounded-[calc(1rem-1.5px)] bg-white p-6">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-sky-500 text-[10px] text-white">
                  ✦
                </span>
                AI Assistant
              </p>

              <div className="mt-4">
                <AiReview getResumeText={buildResumeText} />
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <JobMatch getResumeText={buildResumeText} />
              </div>
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT SIDE — LIVE PREVIEW */}
        <section className="lg:sticky lg:top-6 lg:self-start">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <p className="font-semibold text-cyan-500">
                LIVE PREVIEW
              </p>

              <h2 className="text-2xl font-bold text-slate-950">
                Your Resume
              </h2>
            </div>

           <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSaveResume}
                disabled={saving || loadingResume}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : resumeId ? "Save Changes" : "Save CV"}
              </button>

              <button
                type="button"
                onClick={() => setShowPayment(true)}
                disabled={downloading}
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {downloading ? "Preparing..." : "Download PDF"}
              </button>
            </div>

          </div>

          {saveNotice && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
              <span>{saveNotice}</span>

              <Link
                href="/my-resumes"
                className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100"
              >
                Go to My CVs
              </Link>
            </div>
          )}

          {saveError && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {saveError}
            </div>
          )}

          {savedAt && !saveNotice && (
            <p className="mb-4 text-sm text-slate-400">
              Last saved: {savedAt.toLocaleString()}
            </p>
          )}

         {/* RESUME PAPER */}

<div ref={resumeRef}>
  <ResumePreview
    content={{
      form,
      experiences,
      educations,
      skills,
      projects,
      selectedTemplate,
    }}
  />
</div>
               </section>

      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-950">
                Download Your CV
              </h2>

              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Online payments are launching soon. Until then, PDF downloads are free.
            </p>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">
                  CV PDF
                </span>

                <span className="font-bold text-slate-950">
                  <span className="mr-2 text-sm font-medium text-slate-400 line-through">
                    ৳99
                  </span>
                  Free
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">

              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left font-semibold text-slate-400"
              >
                bKash
                <span className="text-xs font-medium">Coming soon</span>
              </button>

              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left font-semibold text-slate-400"
              >
                Nagad
                <span className="text-xs font-medium">Coming soon</span>
              </button>

              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left font-semibold text-slate-400"
              >
                Credit / Debit Card
                <span className="text-xs font-medium">Coming soon</span>
              </button>

            </div>

            <button
              type="button"
              onClick={async () => {
                setShowPayment(false);
                await handleDownloadPDF();
              }}
              className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Download PDF for free
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              bKash, Nagad and card payments coming soon
            </p>

          </div>
        </div>
      )}

    </main>
  );
}


/* INPUT COMPONENT */
function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
      />

    </div>
  );
}