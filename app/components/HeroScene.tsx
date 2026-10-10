export default function HeroScene() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* =========================
          BACKGROUND DECORATIONS
      ========================== */}

      {/* Top-right soft blob */}
      <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-sky-100/80" />

      {/* Bottom-left soft blob */}
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-200/70" />

      {/* Bottom-left yellow orbit */}
      <div className="pointer-events-none absolute bottom-[-20px] left-[-40px] hidden h-24 w-52 rounded-[50%] border-2 border-amber-300 sm:block" />

      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <div className="relative z-10 max-w-2xl">

            {/* Small badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-50 to-emerald-50 px-5 py-2.5 text-sm font-medium text-[#19324a]">
              <span className="text-amber-400">✦</span>
              <span>AI-powered CV builder for Bangladesh</span>
            </div>

            {/* Main heading */}
            <h1 className="max-w-[650px] text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#19324a] sm:text-6xl lg:text-[68px]">
              Build a CV you’re
              <span className="block bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent">
                proud of.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500 sm:text-xl">
              Create a professional CV in minutes with our easy-to-use
              builder. Choose from beautiful templates, customize it your way,
              and take the next step in your career.
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-5">

              <a
                href="/builder"
                className="group inline-flex items-center gap-3 rounded-full bg-sky-400 px-8 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(56,189,248,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-500"
              >
                Start Building Free

                <span className="text-xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#templates"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-[#19324a] transition hover:border-sky-200 hover:bg-sky-50"
              >
                View Templates
              </a>

            </div>

            {/* Feature highlights */}
            <div className="mt-16 grid max-w-2xl grid-cols-3">

              <HeroFeature
                icon="ϟ"
                iconBg="bg-sky-50"
                iconColor="text-sky-500"
                title="Easy to Use"
                description={
                  <>
                    No design skills
                    <br />
                    needed.
                  </>
                }
              />

              <HeroFeature
                icon="▣"
                iconBg="bg-emerald-50"
                iconColor="text-emerald-500"
                title="Professional Templates"
                description={
                  <>
                    Modern & ATS-friendly
                    <br />
                    designs.
                  </>
                }
                bordered
              />

              <HeroFeature
                icon="♢"
                iconBg="bg-amber-50"
                iconColor="text-amber-500"
                title="Download Anytime"
                description={
                  <>
                    Free to build.
                    <br />
                    One-click PDF.
                  </>
                }
              />

            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <div className="relative min-h-[650px] lg:min-h-[700px]">

            {/* Decorative curved line */}
            <svg
              className="pointer-events-none absolute left-[2%] top-[34%] hidden h-[250px] w-[420px] lg:block"
              viewBox="0 0 420 250"
              fill="none"
            >
              <path
                d="M15 205 C90 270, 170 240, 190 165 C215 75, 290 40, 395 100"
                stroke="url(#heroGradient)"
                strokeWidth="2"
                fill="none"
              />

              <defs>
                <linearGradient
                  id="heroGradient"
                  x1="0"
                  y1="0"
                  x2="420"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5EEAD4" />
                  <stop offset="1" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
            </svg>

            {/* Decorative dots */}
            <div className="absolute left-[5%] top-[45%] h-4 w-4 rotate-45 rounded-[3px] bg-emerald-300" />

            <div className="absolute bottom-[22%] left-[9%] h-4 w-4 rounded-full bg-amber-300" />

            <div className="absolute right-[34%] top-[49%] h-3 w-3 rounded-full bg-sky-300" />

            {/* Yellow decorative lines */}
            <div className="absolute right-[21%] top-[8%] hidden lg:block">
              <div className="absolute h-7 w-1.5 -rotate-[20deg] rounded-full bg-amber-300" />
              <div className="absolute left-4 top-2 h-6 w-1.5 rotate-[50deg] rounded-full bg-amber-300" />
              <div className="absolute left-8 top-7 h-6 w-1.5 rotate-[80deg] rounded-full bg-amber-300" />
            </div>

            {/* =================================================
                MAIN CV CARD
            ================================================== */}

            <div
              className="
                absolute
                left-[5%]
                top-[8%]
                z-20
                w-[390px]
                max-w-[72%]
                rounded-[22px]
                border
                border-slate-100
                bg-white
                p-6
                shadow-[0_30px_70px_rgba(25,50,74,0.12)]
                sm:w-[430px]
                lg:left-[10%]
                lg:w-[430px]
                lg:max-w-none
              "
            >

              {/* Profile header */}
              <div className="flex items-start gap-4 border-b border-slate-100 pb-5">

                {/* Profile image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-sky-100">
                  <div
                    aria-hidden="true"
                    className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-300 to-emerald-300 text-2xl font-bold text-white"
                  >
                    SK
                  </div>
                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="text-lg font-bold text-[#19324a]">
                    Samanta Khan
                  </h3>

                  <p className="text-xs text-slate-400">
                    Frontend Developer
                  </p>

                  <div className="mt-3 space-y-1.5 text-[10px] text-slate-500">

                    <div className="flex items-center gap-2">
                      <span className="text-sky-400">▣</span>
                      samanta@example.com
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sky-400">⌕</span>
                      +880 17** ***678
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sky-400">●</span>
                      Dhaka, Bangladesh
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sky-400">in</span>
                      linkedin.com/in/samanta
                    </div>

                  </div>
                </div>
              </div>

              {/* Experience */}
              <MiniResumeSection title="EXPERIENCE">

                <div className="relative pl-4">

                  <div className="absolute left-0 top-1 h-[88px] w-px bg-sky-300" />

                  <div className="absolute -left-[3px] top-1 h-1.5 w-1.5 rounded-full bg-sky-400" />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-[#19324a]">
                        Junior Frontend Developer
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-400">
                        Nexora Digital Ltd, Dhaka
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-[8px] text-slate-400">
                      Aug 2025 – Present
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-[8px] leading-4 text-slate-500">
                    <p>• Built 12 reusable React components, cutting new page build time by 30%</p>
                    <p>• Improved Lighthouse performance score from 62 to 91 on the client portal</p>
                    <p>• Shipped responsive UI for 3 client projects using Next.js and Tailwind</p>
                  </div>
                </div>

              </MiniResumeSection>

              {/* Education */}
              <MiniResumeSection title="EDUCATION">

                <div className="relative pl-4">

                  <div className="absolute left-0 top-1 h-[62px] w-px bg-sky-300" />

                  <div className="absolute -left-[3px] top-1 h-1.5 w-1.5 rounded-full bg-sky-400" />

                  <p className="text-[10px] font-bold text-[#19324a]">
                    B.Sc. in Computer Science & Engineering
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    North South University
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    CGPA: 3.50
                  </p>
                </div>

              </MiniResumeSection>

              {/* Skills */}
              <MiniResumeSection title="SKILLS">

                <div className="flex flex-wrap gap-1.5">
                  {[
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "Git",
                    "Supabase",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-sky-50 px-2.5 py-1 text-[8px] font-medium text-slate-500"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

              </MiniResumeSection>
            </div>

            {/* =================================================
                CHOOSE TEMPLATE CARD
            ================================================== */}

            <div
              className="
                absolute
                right-[1%]
                top-[13%]
                z-30
                hidden
                w-[235px]
                rounded-[20px]
                border
                border-slate-100
                bg-white
                p-5
                shadow-[0_20px_50px_rgba(25,50,74,0.10)]
                md:block
              "
            >
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-xl text-sky-400">
                  ▤
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#19324a]">
                    Choose a template
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Modern • Professional • ATS
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                CUSTOMIZE CARD
            ================================================== */}

            <div
              className="
                absolute
                right-[0%]
                top-[35%]
                z-30
                hidden
                w-[195px]
                rounded-[20px]
                border
                border-emerald-100
                bg-emerald-50/80
                p-5
                md:block
              "
            >
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-500">
                  ✦
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#19324a]">
                    Customize
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Colors • Fonts • Layout
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                DOWNLOAD CARD
            ================================================== */}

            <div
              className="
                absolute
                right-[0%]
                top-[58%]
                z-30
                hidden
                w-[195px]
                rounded-[20px]
                border
                border-sky-100
                bg-white
                p-5
                shadow-[0_20px_50px_rgba(25,50,74,0.08)]
                md:block
              "
            >
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-xl text-sky-500">
                  ↓
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#19324a]">
                    Download
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    PDF • One click
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                LAPTOP + PLANT
            ================================================== */}

            <div className="absolute bottom-[3%] right-[5%] hidden lg:block">

              {/* Laptop */}
              <div className="relative h-[115px] w-[235px]">

                {/* Screen */}
                <div className="absolute left-7 top-0 h-[88px] w-[170px] -skew-x-12 rounded-[10px] border-4 border-slate-200 bg-sky-50 shadow-lg">

                  <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200" />

                </div>

                {/* Laptop base */}
                <div className="absolute bottom-1 left-0 h-5 w-[225px] skew-x-[-18deg] rounded-b-[10px] rounded-t-sm border border-slate-200 bg-slate-100 shadow-md" />

              </div>

              {/* Plant */}
              <div className="absolute -right-8 bottom-0 h-[150px] w-[110px]">

                {/* Pot */}
                <div className="absolute bottom-0 left-8 h-12 w-14 rounded-b-xl bg-slate-100 shadow-sm">
                  <div className="absolute left-2 top-2 h-1 w-10 rounded-full bg-slate-200" />
                </div>

                {/* Leaves */}
                <div className="absolute bottom-10 left-8 h-20 w-10 -rotate-[35deg] rounded-[100%_0_100%_0] bg-emerald-300" />

                <div className="absolute bottom-12 left-14 h-24 w-11 rotate-[30deg] rounded-[0_100%_0_100%] bg-emerald-400" />

                <div className="absolute bottom-16 left-1 h-16 w-9 -rotate-[65deg] rounded-[100%_0_100%_0] bg-emerald-200" />

                <div className="absolute bottom-14 left-11 h-20 w-2 rotate-[15deg] rounded-full bg-emerald-500" />

              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


/* ============================================================
   SMALL COMPONENTS
============================================================ */

function HeroFeature({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  bordered = false,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <div
      className={`
        px-5
        first:pl-0
        ${bordered ? "border-l border-r border-slate-100" : ""}
      `}
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
      >
        <span className={`text-2xl ${iconColor}`}>{icon}</span>
      </div>

      <h3 className="text-sm font-semibold text-[#19324a]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}


function MiniResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <h4 className="mb-3 text-[10px] font-bold tracking-[0.14em] text-[#19324a]">
        {title}
      </h4>

      {children}
    </div>
  );
}