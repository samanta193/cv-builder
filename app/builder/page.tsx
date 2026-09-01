"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AiImprove, AiReview, JobMatch } from "./AiAssistant";

export default function BuilderPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
  useState("modern");
const resumeRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
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

  const [experiences, setExperiences] = useState([
    {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const [educations, setEducations] = useState([
    {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [projects, setProjects] = useState([
  {
    name: "",
    description: "",
    link: "",
  },
]);
useEffect(() => {
  const loadResume = async () => {
    const params = new URLSearchParams(window.location.search);
    const resumeId = params.get("id");

    if (!resumeId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error loading resume:", error);
      return;
    }

    if (!data?.data) return;

    const saved = data.data;

    if (saved.form) {
      setForm(saved.form);
    }

    if (saved.experiences) {
      setExperiences(saved.experiences);
    }

    if (saved.educations) {
      setEducations(saved.educations);
    }

    if (saved.skills) {
      setSkills(saved.skills);
    }

    if (saved.projects) {
      setProjects(saved.projects);
    }

    if (saved.selectedTemplate) {
      setSelectedTemplate(saved.selectedTemplate);
    }
  };

  loadResume();
}, []);

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
const handleSaveResume = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    alert("Please log in before saving your resume.");
    return;
  }

  const resumeData = {
    form,
    experiences,
    educations,
    skills,
    projects,
    selectedTemplate,
  };

  const { error } = await supabase.from("resumes").insert({
    user_id: user.id,
    title: form.name || "My Resume",
    data: resumeData,
  });

  if (error) {
    console.error(error);
    alert("Failed to save your resume.");
    return;
  }

  alert("Resume saved successfully!");
};
const handleDownloadPDF = async () => {
  if (!resumeRef.current) return;

  const html2canvas = (await import("html2canvas-pro")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(resumeRef.current, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageWidth = 210;
  const pageHeight = 297;

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);

  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${form.name || "resume"}.pdf`);
};
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="text-2xl font-bold">
            <span className="text-cyan-500">CV</span>Builder
          </a>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 sm:inline-flex">
              <span>✦</span> AI-powered
            </span>
            <div className="text-sm text-slate-500">
              Build your professional resume
            </div>
          </div>
        </div>
      </header>

      {/* BUILDER */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-2">

        {/* LEFT SIDE — FORM */}
        <section>
          <div className="mb-6">
            <p className="font-semibold text-cyan-500">
              RESUME BUILDER
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-950">
              Create your resume
            </h1>

            <p className="mt-2 text-slate-500">
              Enter your information and see your resume update instantly.
            </p>
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
        <label className="mb-2 block text-sm font-semibold text-slate-800">
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

           <div className="flex gap-3">
  <button
    type="button"
    onClick={handleSaveResume}
    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-cyan-400 hover:bg-cyan-50"
  >
    Save Resume
  </button>

  <button
    type="button"
    onClick={() => setShowPayment(true)}
    className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
  >
    Download PDF
  </button>
</div>

          </div>

         {/* RESUME PAPER */}

<div ref={resumeRef}>

  {selectedTemplate === "modern" && (
    <ModernTemplate
      form={form}
      experiences={experiences}
      educations={educations}
      skills={skills}
      projects={projects}
    />
  )}

  {selectedTemplate === "professional" && (
    <ProfessionalTemplate
      form={form}
      experiences={experiences}
      educations={educations}
      skills={skills}
      projects={projects}
    />
  )}

  {selectedTemplate === "ats" && (
    <ATSSimpleTemplate
      form={form}
      experiences={experiences}
      educations={educations}
      skills={skills}
      projects={projects}
    />
  )}

  {selectedTemplate === "executive" && (
    <ExecutiveTemplate
      form={form}
      experiences={experiences}
      educations={educations}
      skills={skills}
      projects={projects}
    />
  )}

</div>
               </section>

      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-950">
                Download Your Resume
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
              Choose your preferred payment method to download your resume.
            </p>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">
                  Resume PDF
                </span>

                <span className="font-bold text-slate-950">
                  ৳100
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">

              <button
                type="button"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left font-semibold hover:border-cyan-400 hover:bg-cyan-50"
              >
                bKash
              </button>

              <button
                type="button"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left font-semibold hover:border-cyan-400 hover:bg-cyan-50"
              >
                Nagad
              </button>

              <button
                type="button"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left font-semibold hover:border-cyan-400 hover:bg-cyan-50"
              >
                Credit / Debit Card
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
              Pay ৳100 & Download
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Secure payment • Instant PDF download
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
function ModernTemplate({
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
function ProfessionalTemplate({
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
function ATSSimpleTemplate({
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
function ExecutiveTemplate({
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