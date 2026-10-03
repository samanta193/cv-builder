"use client";

/* ------------------------------------------------------------------ *
 * RESUME TEMPLATES
 *
 * These components were previously defined inside app/builder/page.tsx.
 * They were moved here (unchanged) so that both the builder and the
 * My CVs page can render the exact same markup - the builder for the
 * live preview, My CVs for generating a PDF of a saved CV. There is
 * still only ONE implementation of every template.
 * ------------------------------------------------------------------ */

import type { ResumeContent } from "@/lib/resume-types";

/* RESUME SECTION */
function ResumeSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="mt-8">

      <h3 className="border-b-2 border-cyan-400 pb-2 text-sm font-bold tracking-wider text-cyan-600">
        {title}
      </h3>

      <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
        {content}
      </div>

    </div>
  );
}

/* MODERN TEMPLATE */
export function ModernTemplate({
  form,
  experiences,
  educations,
  skills,
  projects,


}: {
  form: {
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experiences: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  educations: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
  projects: {
  name: string;
  description: string;
  link: string;
}[];
}) {
  return (
    <div className="min-h-[1000px] bg-white p-8 shadow-xl sm:p-12">

      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-bold text-slate-950">
          {form.name || "Your Name"}
        </h1>

        <p className="mt-2 text-xl font-medium text-cyan-500">
          {form.jobTitle || "Your Job Title"}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          {form.email && <span>{form.email}</span>}
          {form.phone && <span>{form.phone}</span>}
          {form.location && <span>{form.location}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      <ResumeSection
        title="PROFESSIONAL SUMMARY"
        content={
          form.summary ||
          "Your professional summary will appear here."
        }
      />

      {/* EXPERIENCE */}
      <div className="mt-8">
        <h3 className="border-b-2 border-cyan-400 pb-2 text-sm font-bold tracking-wider text-cyan-600">
          WORK EXPERIENCE
        </h3>

        <div className="mt-5 space-y-6">
          {experiences.map((experience, index) => (
            <div key={index}>
              <div className="flex justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-950">
                    {experience.jobTitle || "Job Title"}
                  </h4>

                  <p className="mt-1 font-medium text-cyan-600">
                    {experience.company || "Company Name"}
                  </p>
                </div>

                <div className="text-right text-sm text-slate-500">
                  {experience.startDate || "Start"} —{" "}
                  {experience.endDate || "Present"}

                  {experience.location && (
                    <div className="mt-1">
                      {experience.location}
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                {experience.description ||
                  "Your responsibilities and achievements will appear here."}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* EDUCATION */}
      <div className="mt-8">
        <h3 className="border-b-2 border-cyan-400 pb-2 text-sm font-bold tracking-wider text-cyan-600">
          EDUCATION
        </h3>

        <div className="mt-5 space-y-6">
          {educations.map((education, index) => (
            <div key={index}>
              <div className="flex justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-950">
                    {education.degree || "Degree / Qualification"}
                  </h4>

                  <p className="mt-1 font-medium text-cyan-600">
                    {education.institution || "Institution Name"}
                  </p>
                </div>

                <div className="text-right text-sm text-slate-500">
                  {education.startDate || "Start"} —{" "}
                  {education.endDate || "Present"}

                  {education.location && (
                    <div className="mt-1">
                      {education.location}
                    </div>
                  )}
                </div>
              </div>

              {education.description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                  {education.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
{/* PROJECTS */}
<div className="mt-8">
  <h3 className="border-b-2 border-cyan-400 pb-2 text-sm font-bold tracking-wider text-cyan-600">
    PROJECTS
  </h3>

  <div className="mt-5 space-y-6">
    {projects.map((project, index) => (
      <div key={index}>
        <h4 className="font-bold text-slate-950">
          {project.name || "Project Name"}
        </h4>

        {project.description && (
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
            {project.description}
          </p>
        )}

        {project.link && (
          <p className="mt-2 text-sm text-cyan-600">
            {project.link}
          </p>
        )}
      </div>
    ))}
  </div>
</div>
      {/* SKILLS */}
      <div className="mt-8">
        <h3 className="border-b-2 border-cyan-400 pb-2 text-sm font-bold tracking-wider text-cyan-600">
          SKILLS
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400">
              Your skills will appear here.
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
/* PROFESSIONAL TEMPLATE */
export function ProfessionalTemplate({
  form,
  experiences,
  educations,
  skills,
}: {
  form: {
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experiences: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  educations: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
  projects: {
  name: string;
  description: string;
  link: string;
}[];
}) {
  return (
    <div className="min-h-[1000px] bg-white p-8 shadow-xl sm:p-12">

      {/* HEADER */}
      <div className="border-b-4 border-slate-900 pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900">
          {form.name || "Your Name"}
        </h1>

        <p className="mt-2 text-lg font-semibold text-slate-600">
          {form.jobTitle || "Your Job Title"}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
          {form.email && <span>{form.email}</span>}
          {form.phone && <span>{form.phone}</span>}
          {form.location && <span>{form.location}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mt-7">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Professional Summary
        </h3>

        <div className="mt-2 h-px bg-slate-300" />

        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
          {form.summary ||
            "Your professional summary will appear here."}
        </p>
      </div>

      {/* EXPERIENCE */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Professional Experience
        </h3>

        <div className="mt-2 h-px bg-slate-300" />

        <div className="mt-5 space-y-7">
          {experiences.map((experience, index) => (
            <div key={index}>

              <div className="flex justify-between gap-5">

                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {experience.jobTitle || "Job Title"}
                  </h4>

                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {experience.company || "Company Name"}
                  </p>
                </div>

                <div className="text-right text-sm text-slate-500">
                  <p>
                    {experience.startDate || "Start"} —{" "}
                    {experience.endDate || "Present"}
                  </p>

                  {experience.location && (
                    <p className="mt-1">
                      {experience.location}
                    </p>
                  )}
                </div>

              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                {experience.description ||
                  "Your responsibilities and achievements will appear here."}
              </p>

            </div>
          ))}
        </div>
      </div>

      {/* EDUCATION */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Education
        </h3>

        <div className="mt-2 h-px bg-slate-300" />

        <div className="mt-5 space-y-6">
          {educations.map((education, index) => (
            <div key={index}>

              <div className="flex justify-between gap-5">

                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {education.degree ||
                      "Degree / Qualification"}
                  </h4>

                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {education.institution ||
                      "Institution Name"}
                  </p>
                </div>

                <div className="text-right text-sm text-slate-500">
                  <p>
                    {education.startDate || "Start"} —{" "}
                    {education.endDate || "Present"}
                  </p>

                  {education.location && (
                    <p className="mt-1">
                      {education.location}
                    </p>
                  )}
                </div>

              </div>

              {education.description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                  {education.description}
                </p>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* SKILLS */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Skills
        </h3>

        <div className="mt-2 h-px bg-slate-300" />

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="text-sm font-medium text-slate-700"
              >
                • {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400">
              Your skills will appear here.
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
/* ATS SIMPLE TEMPLATE */
export function ATSSimpleTemplate({
  form,
  experiences,
  educations,
  skills,
}: {
  form: {
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experiences: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  educations: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];projects: {
  name: string;
  description: string;
  link: string;
}[];
}) {
  return (
    <div className="min-h-[1000px] bg-white p-10 shadow-xl sm:p-12">

      {/* HEADER */}
      <div className="text-center">

        <h1 className="text-3xl font-bold text-black">
          {form.name || "Your Name"}
        </h1>

        <p className="mt-1 text-base font-medium text-gray-700">
          {form.jobTitle || "Your Job Title"}
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
          {form.email && <span>{form.email}</span>}
          {form.phone && <span>{form.phone}</span>}
          {form.location && <span>{form.location}</span>}
        </div>

      </div>

      {/* SUMMARY */}
      <div className="mt-8">

        <h2 className="border-b border-black pb-1 text-sm font-bold uppercase tracking-wide text-black">
          Professional Summary
        </h2>

        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-black">
          {form.summary ||
            "Your professional summary will appear here."}
        </p>

      </div>

      {/* EXPERIENCE */}
      <div className="mt-7">

        <h2 className="border-b border-black pb-1 text-sm font-bold uppercase tracking-wide text-black">
          Work Experience
        </h2>

        <div className="mt-4 space-y-6">

          {experiences.map((experience, index) => (
            <div key={index}>

              <div className="flex justify-between gap-4">

                <div>
                  <h3 className="text-sm font-bold text-black">
                    {experience.jobTitle || "Job Title"}
                  </h3>

                  <p className="mt-1 text-sm text-black">
                    {experience.company || "Company Name"}
                  </p>
                </div>

                <div className="text-right text-xs text-gray-600">
                  <p>
                    {experience.startDate || "Start"} —{" "}
                    {experience.endDate || "Present"}
                  </p>

                  {experience.location && (
                    <p className="mt-1">
                      {experience.location}
                    </p>
                  )}
                </div>

              </div>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-black">
                {experience.description ||
                  "Your responsibilities and achievements will appear here."}
              </p>

            </div>
          ))}

        </div>

      </div>

      {/* EDUCATION */}
      <div className="mt-7">

        <h2 className="border-b border-black pb-1 text-sm font-bold uppercase tracking-wide text-black">
          Education
        </h2>

        <div className="mt-4 space-y-5">

          {educations.map((education, index) => (
            <div key={index}>

              <div className="flex justify-between gap-4">

                <div>

                  <h3 className="text-sm font-bold text-black">
                    {education.degree ||
                      "Degree / Qualification"}
                  </h3>

                  <p className="mt-1 text-sm text-black">
                    {education.institution ||
                      "Institution Name"}
                  </p>

                </div>

                <div className="text-right text-xs text-gray-600">

                  <p>
                    {education.startDate || "Start"} —{" "}
                    {education.endDate || "Present"}
                  </p>

                  {education.location && (
                    <p className="mt-1">
                      {education.location}
                    </p>
                  )}

                </div>

              </div>

              {education.description && (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-black">
                  {education.description}
                </p>
              )}

            </div>
          ))}

        </div>

      </div>

      {/* SKILLS */}
      <div className="mt-7">

        <h2 className="border-b border-black pb-1 text-sm font-bold uppercase tracking-wide text-black">
          Skills
        </h2>

        <div className="mt-3">

          {skills.length > 0 ? (
            <p className="text-sm leading-6 text-black">
              {skills.join(" • ")}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Your skills will appear here.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}
/* EXECUTIVE TEMPLATE */
export function ExecutiveTemplate({
  form,
  experiences,
  educations,
  skills,
}: {
  form: {
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experiences: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  educations: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
  projects: {
  name: string;
  description: string;
  link: string;
}[];
}) {
  return (
    <div className="min-h-[1000px] bg-white shadow-xl">

      {/* EXECUTIVE HEADER */}
      <div className="bg-slate-950 px-8 py-10 text-white sm:px-12">

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Executive Resume
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              {form.name || "Your Name"}
            </h1>

            <p className="mt-2 text-lg font-medium text-slate-300">
              {form.jobTitle || "Your Job Title"}
            </p>
          </div>

          <div className="text-sm leading-6 text-slate-300 sm:text-right">
            {form.email && <div>{form.email}</div>}
            {form.phone && <div>{form.phone}</div>}
            {form.location && <div>{form.location}</div>}
          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="px-8 py-8 sm:px-12">

        {/* SUMMARY */}
        <section>

          <div className="flex items-center gap-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
              Executive Profile
            </h2>

            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
            {form.summary ||
              "Your professional summary will appear here."}
          </p>

        </section>

        {/* EXPERIENCE */}
        <section className="mt-9">

          <div className="flex items-center gap-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
              Career Experience
            </h2>

            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <div className="mt-6 space-y-8">

            {experiences.map((experience, index) => (
              <div
                key={index}
                className="grid gap-4 sm:grid-cols-[150px_1fr]"
              >

                {/* DATE */}
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <div>
                    {experience.startDate || "Start"}
                  </div>

                  <div className="my-1 text-slate-300">
                    —
                  </div>

                  <div>
                    {experience.endDate || "Present"}
                  </div>
                </div>

                {/* EXPERIENCE DETAILS */}
                <div className="border-l border-slate-300 pl-5">

                  <h3 className="text-base font-bold text-slate-950">
                    {experience.jobTitle || "Job Title"}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-cyan-600">
                    {experience.company || "Company Name"}
                  </p>

                  {experience.location && (
                    <p className="mt-1 text-xs text-slate-500">
                      {experience.location}
                    </p>
                  )}

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                    {experience.description ||
                      "Your responsibilities and achievements will appear here."}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* EDUCATION */}
        <section className="mt-9">

          <div className="flex items-center gap-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
              Education
            </h2>

            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <div className="mt-6 space-y-6">

            {educations.map((education, index) => (
              <div
                key={index}
                className="grid gap-4 sm:grid-cols-[150px_1fr]"
              >

                {/* DATE */}
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <div>
                    {education.startDate || "Start"}
                  </div>

                  <div className="my-1 text-slate-300">
                    —
                  </div>

                  <div>
                    {education.endDate || "Present"}
                  </div>
                </div>

                {/* EDUCATION DETAILS */}
                <div className="border-l border-slate-300 pl-5">

                  <h3 className="text-base font-bold text-slate-950">
                    {education.degree ||
                      "Degree / Qualification"}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-cyan-600">
                    {education.institution ||
                      "Institution Name"}
                  </p>

                  {education.location && (
                    <p className="mt-1 text-xs text-slate-500">
                      {education.location}
                    </p>
                  )}

                  {education.description && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {education.description}
                    </p>
                  )}

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* SKILLS */}
        <section className="mt-9">

          <div className="flex items-center gap-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
              Core Skills
            </h2>

            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">

            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-slate-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  {skill}
                </div>
              ))
            ) : (
              <span className="text-sm text-slate-400">
                Your skills will appear here.
              </span>
            )}

          </div>

        </section>

      </div>

    </div>
  );
}

/* ------------------------------------------------------------------ *
 * RESUME PREVIEW
 *
 * Single switch used everywhere a resume needs to be rendered.
 * ------------------------------------------------------------------ */

export function ResumePreview({ content }: { content: ResumeContent }) {
  const { form, experiences, educations, skills, projects, selectedTemplate } =
    content;

  if (selectedTemplate === "professional") {
    return (
      <ProfessionalTemplate
        form={form}
        experiences={experiences}
        educations={educations}
        skills={skills}
        projects={projects}
      />
    );
  }

  if (selectedTemplate === "ats") {
    return (
      <ATSSimpleTemplate
        form={form}
        experiences={experiences}
        educations={educations}
        skills={skills}
        projects={projects}
      />
    );
  }

  if (selectedTemplate === "executive") {
    return (
      <ExecutiveTemplate
        form={form}
        experiences={experiences}
        educations={educations}
        skills={skills}
        projects={projects}
      />
    );
  }

  return (
    <ModernTemplate
      form={form}
      experiences={experiences}
      educations={educations}
      skills={skills}
      projects={projects}
    />
  );
}
