import { Reveal, CountUp } from "./components/Motion";

const features = [
  {
    icon: "✦",
    title: "AI writing, three ways",
    description:
      "Rewrite any section as Professional, Concise or ATS Optimized. The AI polishes your own words and never invents experience.",
  },
  {
    icon: "◉",
    title: "You stay in control",
    description:
      "Every AI suggestion is shown first. Accept it, edit it, or reject it — nothing changes until you say so.",
  },
  {
    icon: "▤",
    title: "Live resume preview",
    description:
      "See your resume update instantly as you type, exactly as it will look when you download it.",
  },
  {
    icon: "▣",
    title: "Real, ATS-friendly templates",
    description:
      "Four professionally designed templates — Modern, Professional, ATS and Executive — built for real job applications.",
  },
  {
    icon: "✓",
    title: "AI resume review",
    description:
      "Get a full review of your finished resume: clarity, ATS-readiness, weak wording, repetition and missing information.",
  },
  {
    icon: "⇄",
    title: "Job description matcher",
    description:
      "Paste a job post and see where your resume already matches, which wording to align, and any honest gaps.",
  },
];

const steps = [
  {
    number: "01",
    title: "Enter your information",
    description:
      "Add your education, experience, skills, projects and other professional details.",
  },
  {
    number: "02",
    title: "Let AI improve your resume",
    description:
      "Get smart suggestions to make your content clearer, stronger and more professional.",
  },
  {
    number: "03",
    title: "Download & apply",
    description:
      "Choose your favorite template, preview your resume and download it when you're ready.",
  },
];

const templates = [
  {
    name: "Modern",
    tagline: "Cyan sidebar with a clean two-column layout.",
  },
  {
    name: "Professional",
    tagline: "Classic centered header for formal applications.",
  },
  {
    name: "ATS",
    tagline: "Single-column, parser-safe and distraction-free.",
  },
  {
    name: "Executive",
    tagline: "Dark header band with a confident, senior feel.",
  },
];

const faqs = [
  {
    question: "Are the resumes ATS-friendly?",
    answer:
      "Yes. Our resume templates are designed with ATS-friendly structure, readable formatting, and standard resume sections to help applicant tracking systems understand your CV.",
  },
  {
    question: "Can I edit my resume after creating it?",
    answer:
      "Yes. You can edit your personal information, education, experience, skills, projects, and other sections whenever you want.",
  },
  {
    question: "Can I download my resume as a PDF?",
    answer:
      "Yes. Once your resume is complete, you can download it as a professional PDF depending on the plan or template you've selected.",
  },
  {
    question: "Can I pay using bKash or Nagad?",
    answer:
      "Yes. CVBuilder is designed for users in Bangladesh and will support local payment methods such as bKash and Nagad alongside card payments.",
  },
  {
    question: "Can I create more than one resume?",
    answer:
      "Yes. Depending on your plan, you can create and manage multiple resume versions for different jobs and career opportunities.",
  },
  {
    question: "Do I need a credit or debit card?",
    answer:
      "No. You will be able to use supported local payment methods such as bKash and Nagad, as well as credit or debit cards.",
  },
];

/* Skeleton line helper classes are plain divs; each template preview below
   mirrors the real template's actual layout in the builder. */

function TemplatePreview({ index }: { index: number }) {
  if (index === 0) {
    // Modern: cyan left sidebar
    return (
      <div className="flex h-full gap-3 rounded-xl bg-white p-4">
        <div className="w-1/3 space-y-3 rounded-lg bg-cyan-500/90 p-3">
          <div className="mx-auto h-8 w-8 rounded-full bg-white/30" />
          <div className="h-1.5 rounded bg-white/50" />
          <div className="h-1.5 w-4/5 rounded bg-white/40" />
          <div className="pt-2">
            <div className="h-1.5 w-1/2 rounded bg-white/60" />
            <div className="mt-2 h-1.5 rounded bg-white/30" />
            <div className="mt-1.5 h-1.5 rounded bg-white/30" />
          </div>
        </div>
        <div className="flex-1 space-y-3 py-1">
          <div className="h-3 w-3/4 rounded bg-slate-800" />
          <div className="h-1.5 w-1/2 rounded bg-cyan-400" />
          <div className="space-y-1.5 pt-2">
            <div className="h-1.5 rounded bg-slate-200" />
            <div className="h-1.5 rounded bg-slate-200" />
            <div className="h-1.5 w-4/5 rounded bg-slate-200" />
          </div>
          <div className="h-1.5 w-2/5 rounded bg-slate-700" />
          <div className="space-y-1.5">
            <div className="h-1.5 rounded bg-slate-200" />
            <div className="h-1.5 w-5/6 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }
  if (index === 1) {
    // Professional: centered classic header
    return (
      <div className="h-full rounded-xl bg-white p-5">
        <div className="border-b-2 border-slate-800 pb-3 text-center">
          <div className="mx-auto h-3 w-1/2 rounded bg-slate-800" />
          <div className="mx-auto mt-2 h-1.5 w-1/3 rounded bg-slate-400" />
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <div className="h-1.5 w-1/3 rounded bg-slate-700" />
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 rounded bg-slate-200" />
              <div className="h-1.5 rounded bg-slate-200" />
              <div className="h-1.5 w-3/4 rounded bg-slate-200" />
            </div>
          </div>
          <div>
            <div className="h-1.5 w-1/4 rounded bg-slate-700" />
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 rounded bg-slate-200" />
              <div className="h-1.5 w-5/6 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (index === 2) {
    // ATS: plain single column
    return (
      <div className="h-full rounded-xl bg-white p-5">
        <div className="h-3 w-2/5 rounded bg-slate-900" />
        <div className="mt-2 h-1.5 w-3/5 rounded bg-slate-300" />
        <div className="mt-4 space-y-1.5">
          <div className="h-1.5 w-1/4 rounded bg-slate-500" />
          <div className="h-1.5 rounded bg-slate-200" />
          <div className="h-1.5 rounded bg-slate-200" />
          <div className="h-1.5 w-4/5 rounded bg-slate-200" />
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="h-1.5 w-1/3 rounded bg-slate-500" />
          <div className="h-1.5 rounded bg-slate-200" />
          <div className="h-1.5 w-5/6 rounded bg-slate-200" />
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="h-1.5 w-1/4 rounded bg-slate-500" />
          <div className="h-1.5 w-2/3 rounded bg-slate-200" />
        </div>
      </div>
    );
  }
  // Executive: dark header band
  return (
    <div className="h-full overflow-hidden rounded-xl bg-white">
      <div className="bg-slate-900 p-4">
        <div className="h-3 w-1/2 rounded bg-white" />
        <div className="mt-2 h-1.5 w-1/3 rounded bg-cyan-400" />
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="col-span-2 space-y-1.5">
          <div className="h-1.5 w-1/2 rounded bg-slate-700" />
          <div className="h-1.5 rounded bg-slate-200" />
          <div className="h-1.5 rounded bg-slate-200" />
          <div className="h-1.5 w-4/5 rounded bg-slate-200" />
          <div className="pt-2">
            <div className="h-1.5 w-2/5 rounded bg-slate-700" />
            <div className="mt-1.5 h-1.5 rounded bg-slate-200" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 rounded bg-slate-200" />
          <div className="h-1.5 rounded bg-slate-200" />
          <div className="h-1.5 w-3/4 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#" className="text-2xl font-bold tracking-tight">
            <span className="text-cyan-500">CV</span>Builder
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-950">
              Features
            </a>
            <a href="#templates" className="transition hover:text-slate-950">
              Templates
            </a>
            <a href="#how-it-works" className="transition hover:text-slate-950">
              How it works
            </a>
            <a href="#pricing" className="transition hover:text-slate-950">
              Pricing
            </a>
            <a href="#faq" className="transition hover:text-slate-950">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-xl px-5 py-2.5 text-center font-semibold text-slate-700 transition hover:text-slate-950"
            >
              Log In
            </a>

            <a
              href="/signup"
              className="rounded-xl bg-slate-950 px-6 py-2.5 text-center font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Ambient aurora */}
        <div className="aurora-a pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="aurora-b pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        {/* Faint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #7dd3fc 1px, transparent 1px), linear-gradient(to bottom, #7dd3fc 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          {/* LEFT SIDE */}
          <div className="max-w-2xl">
            <div className="hero-in hero-delay-1 mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <span className="animate-pulse">✦</span>
              Build a better resume with AI
            </div>

            <h1 className="hero-in hero-delay-2 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Create a Resume
              <span className="block bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                That Gets Noticed.
              </span>
            </h1>

            <p className="hero-in hero-delay-3 mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Build a professional, ATS-friendly resume in minutes. Choose a
              template, add your information, and let our smart tools help you
              create a resume you&rsquo;re proud of.
            </p>

            <div className="hero-in hero-delay-4 mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="/builder"
                className="group sheen rounded-xl bg-cyan-400 px-7 py-4 text-center font-bold text-slate-950 shadow-lg shadow-cyan-400/25 transition hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-xl hover:shadow-cyan-400/30"
              >
                Create My Resume{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#templates"
                className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
              >
                Explore Templates
              </a>
            </div>

            <div className="hero-in hero-delay-5 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <span>✓ ATS-friendly</span>
              <span>✓ Easy to edit</span>
              <span>✓ Professional templates</span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hero-in hero-delay-3 relative mx-auto w-full max-w-xl">
            <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-3xl" />

            {/* Floating score card */}
            <div className="float-slow absolute -right-2 -top-8 z-20 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 shadow-xl backdrop-blur-md sm:-right-8">
              <div className="text-xs text-slate-400">Resume Score</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-bold text-white">92</span>
                <span className="text-xs font-semibold text-green-400">
                  Excellent
                </span>
              </div>
            </div>

            {/* Floating AI chip */}
            <div className="float-slower absolute -left-3 bottom-10 z-20 flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-slate-900/80 px-4 py-3 shadow-xl backdrop-blur-md sm:-left-8">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-500 text-sm text-slate-950">
                ✦
              </span>
              <div>
                <p className="text-xs font-semibold text-white">
                  AI suggestion applied
                </p>
                <p className="text-[10px] text-slate-400">
                  Summary rewritten · Professional
                </p>
              </div>
            </div>

            {/* Resume card */}
            <div className="relative rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur sm:p-6">
              <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-xl sm:p-8">
                <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">
                      Alex Morgan
                    </h2>
                    <p className="mt-1 text-sm font-medium text-cyan-600">
                      Product Designer
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Dhaka, Bangladesh · alex@email.com
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-lg text-cyan-600">
                    AM
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6">
                  <div className="col-span-2 space-y-6">
                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-cyan-600">
                        Experience
                      </h3>
                      <p className="text-sm font-bold">
                        Senior Product Designer
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        2022 — Present
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="h-2 rounded bg-slate-200" />
                        <div className="h-2 rounded bg-slate-200" />
                        <div className="h-2 w-4/5 rounded bg-slate-200" />
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-cyan-600">
                        Education
                      </h3>
                      <p className="text-sm font-bold">Bachelor of Science</p>
                      <p className="mt-1 text-xs text-slate-400">
                        University of Design
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="h-2 rounded bg-slate-200" />
                        <div className="h-2 w-3/4 rounded bg-slate-200" />
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-cyan-600">
                        Projects
                      </h3>
                      <div className="space-y-2">
                        <div className="h-2 rounded bg-slate-200" />
                        <div className="h-2 rounded bg-slate-200" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-cyan-100 px-2 py-1 text-[10px] text-cyan-700">
                          Figma
                        </span>
                        <span className="rounded-full bg-cyan-100 px-2 py-1 text-[10px] text-cyan-700">
                          UX
                        </span>
                        <span className="rounded-full bg-cyan-100 px-2 py-1 text-[10px] text-cyan-700">
                          UI
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider">
                        Languages
                      </h3>
                      <div className="space-y-2">
                        <div className="h-2 rounded bg-slate-200" />
                        <div className="h-2 w-3/4 rounded bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 px-6 py-12 sm:grid-cols-4 lg:px-8">
          <div className="px-4 text-center">
            <p className="text-3xl font-bold text-slate-950 sm:text-4xl">
              <CountUp value={10} suffix="K+" />
            </p>
            <p className="mt-2 text-sm text-slate-500">Resumes Created</p>
          </div>

          <div className="px-4 text-center">
            <p className="text-3xl font-bold text-slate-950 sm:text-4xl">
              <CountUp value={95} suffix="%" />
            </p>
            <p className="mt-2 text-sm text-slate-500">ATS Friendly</p>
          </div>

          <div className="px-4 text-center">
            <p className="text-3xl font-bold text-slate-950 sm:text-4xl">
              <CountUp value={3} />
            </p>
            <p className="mt-2 text-sm text-slate-500">AI Writing Modes</p>
          </div>

          <div className="px-4 text-center">
            <p className="text-3xl font-bold text-slate-950 sm:text-4xl">
              <CountUp value={5} suffix=" Min" />
            </p>
            <p className="mt-2 text-sm text-slate-500">Average Build Time</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-slate-50 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-semibold uppercase tracking-wider text-cyan-500">
                Powerful Features
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Everything you need to build a better resume
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Simple tools that help you create a professional resume without
                spending hours formatting it.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={(index % 3) * 90}>
                <div className="group h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-sky-50 text-xl text-cyan-600 transition duration-300 group-hover:scale-110 group-hover:from-cyan-400 group-hover:to-sky-400 group-hover:text-white">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="max-w-2xl">
              <p className="font-semibold uppercase tracking-wider text-cyan-500">
                How It Works
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Your resume. Three simple steps.
              </h2>
            </div>
          </Reveal>

          <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {/* Connector line */}
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent md:block" />

            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 130}>
                <div className="relative">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-white text-lg font-black text-cyan-500 shadow-sm">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES — single showcase of the four real builder templates */}
      <section
        id="templates"
        className="relative overflow-hidden bg-slate-950 px-6 py-24 lg:px-8"
      >
        <div className="aurora-b pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center">
              <p className="font-semibold uppercase tracking-wider text-cyan-400">
                Resume Templates
              </p>
              <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
                Designed to help you stand out
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
                Four real templates, ready in the builder. Pick one and switch
                any time — your content stays.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((template, index) => (
              <Reveal key={template.name} delay={index * 90}>
                <div className="group h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/10">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 p-3 transition duration-300 group-hover:scale-[1.02]">
                    <TemplatePreview index={index} />
                  </div>

                  <div className="px-2 pb-1 pt-5">
                    <h3 className="text-lg font-bold text-white">
                      {template.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {template.tagline}
                    </p>
                    <a
                      href="/builder"
                      className="mt-4 block rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-white transition group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950"
                    >
                      Use Template
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-slate-50 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-semibold uppercase tracking-wider text-cyan-500">
                Simple &amp; Transparent Pricing
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Build for free. Pay only when you&rsquo;re ready.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Create and edit your resume for free. Upgrade only when you
                need premium templates and downloadable files.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {/* FREE */}
            <Reveal delay={0}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-950">Free</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    START HERE
                  </span>
                </div>

                <div className="mt-5 text-4xl font-bold text-slate-950">৳0</div>
                <p className="mt-2 text-slate-500">Try the CV builder</p>

                <ul className="mt-8 space-y-4 text-sm text-slate-600">
                  <li>✓ Create your resume</li>
                  <li>✓ Basic ATS-friendly templates</li>
                  <li>✓ Edit your information</li>
                  <li>✓ Live resume preview</li>
                  <li>✓ Basic CV customization</li>
                </ul>

                <a
                  href="#builder"
                  className="mt-8 block rounded-xl border border-slate-300 px-5 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Start for Free
                </a>
              </div>
            </Reveal>

            {/* PRO */}
            <Reveal delay={110}>
              <div className="relative h-full rounded-3xl border-2 border-cyan-400 bg-white p-8 shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 px-5 py-1.5 text-xs font-bold text-slate-950 shadow-md">
                  MOST POPULAR
                </div>

                <h3 className="text-xl font-bold text-slate-950">Pro</h3>
                <div className="mt-5 text-4xl font-bold text-slate-950">
                  ৳99
                </div>
                <p className="mt-2 text-slate-500">One-time payment</p>

                <ul className="mt-8 space-y-4 text-sm text-slate-600">
                  <li>✓ Everything in Free</li>
                  <li>✓ Premium ATS templates</li>
                  <li>✓ AI resume suggestions</li>
                  <li>✓ Download CV as PDF</li>
                  <li>✓ Multiple resume versions</li>
                </ul>

                <a
                  href="#builder"
                  className="sheen mt-8 block rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
                >
                  Choose Pro
                </a>

                <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                  <p className="text-xs font-medium text-slate-400">
                    Pay securely with
                  </p>
                  <div className="mt-3 flex justify-center gap-2">
                    <span className="rounded-lg bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-600">
                      bKash
                    </span>
                    <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
                      Nagad
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                      Card
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* PREMIUM */}
            <Reveal delay={220}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-950">Premium</h3>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-600">
                    BEST VALUE
                  </span>
                </div>

                <div className="mt-5 text-4xl font-bold text-slate-950">
                  ৳199
                </div>
                <p className="mt-2 text-slate-500">One-time payment</p>

                <ul className="mt-8 space-y-4 text-sm text-slate-600">
                  <li>✓ Everything in Pro</li>
                  <li>✓ All premium templates</li>
                  <li>✓ Advanced AI suggestions</li>
                  <li>✓ Unlimited resume versions</li>
                  <li>✓ Priority support</li>
                </ul>

                <a
                  href="#builder"
                  className="mt-8 block rounded-xl border border-slate-300 px-5 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Choose Premium
                </a>

                <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                  <p className="text-xs font-medium text-slate-400">
                    Pay securely with
                  </p>
                  <div className="mt-3 flex justify-center gap-2">
                    <span className="rounded-lg bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-600">
                      bKash
                    </span>
                    <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
                      Nagad
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                      Card
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            No subscription required. Pay once and download your resume.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="text-center">
              <p className="font-semibold uppercase tracking-wider text-cyan-500">
                FAQ
              </p>
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Frequently asked questions
              </h2>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 transition hover:border-slate-300 open:border-cyan-200 open:bg-cyan-50/30 open:shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold">
                    {faq.question}
                    <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition duration-300 group-open:rotate-45 group-open:bg-cyan-100 group-open:text-cyan-600">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="builder" className="px-6 py-20 lg:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-16 text-center sm:px-16">
            <div className="aurora-a pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />
            <div className="aurora-b pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

            <div className="relative">
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Ready to build your resume?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
                Create a professional, job-ready resume in minutes — without
                fighting with complicated formatting.
              </p>

              <a
                href="/builder"
                className="group sheen mt-8 inline-block rounded-xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 shadow-lg shadow-cyan-400/25 transition hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-xl hover:shadow-cyan-400/30"
              >
                Start Building My Resume{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-12 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
          <div>
            <div className="text-2xl font-bold">
              <span className="text-cyan-400">CV</span>Builder
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Build professional resumes faster with AI-powered tools and
              modern templates.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#templates" className="transition hover:text-white">
              Templates
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-8 text-sm text-slate-500">
          © 2026 CVBuilder. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
