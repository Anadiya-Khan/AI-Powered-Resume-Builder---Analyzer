import React from "react";
import { useNavigate } from "react-router-dom";
import TemplateOne from "../components/templates/Templatesone";
import TemplateTwo from "../components/templates/Templatestwo";
import Backbutton from "../components/Backbutton";

export default function SelectTemplate() {
  const navigate = useNavigate();

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <Backbutton/>
      <h1 className="text-3xl font-bold mb-6">Choose a template</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate("/create-resume", { state: { template: "one" } })}
          className="border rounded-lg p-4 cursor-pointer hover:shadow-lg"
        >
          <div className="mb-3 text-sm font-medium">Template One</div>
          <div className="bg-white p-4">
            <TemplateOne
              data={{
                fullName: "Alexandra Rivera",
                role: "Senior Frontend Engineer",
                email: "alex.rivera@example.com",
                phone: "(555) 214-7890",
                address: "San Francisco, CA",
                links: [
                  "https://github.com/alexrivera",
                  "https://linkedin.com/in/alexrivera",
                  "https://alexandra.dev",
                ],
                professionalSummary:
                  "Frontend engineer with 8+ years building performant, accessible web apps. Passionate about component-driven design, TypeScript, and mentorship.",
                skills: ["React", "TypeScript", "Tailwind CSS", "GraphQL", "Jest", "Vite"],
                education: [
                  {
                    degree: "B.Sc. Computer Science",
                    institution: "University of California, Berkeley",
                    year: "2015",
                    grade: "3.8 GPA",
                  },
                ],
                experience: [
                  {
                    title: "Senior Frontend Engineer",
                    company: "TechLabs Inc.",
                    startDate: "2021-06",
                    endDate: "Present",
                    description:
                      "Led frontend team to rebuild the core product UI, improving load time by 40% and increasing conversion by 12%. Mentored 5 engineers and introduced testing standards.",
                  },
                  {
                    title: "Frontend Engineer",
                    company: "WebWorks",
                    startDate: "2018-01",
                    endDate: "2021-05",
                    description:
                      "Built reusable component library used across three products, reduced duplication and sped up delivery of features.",
                  },
                ],
                projects: [
                  {
                    name: "OpenResume",
                    description:
                      "An open-source resume builder enabling users to compose and export modern resumes.",
                    link: "https://github.com/alexrivera/openresume",
                  },
                ],
              }}
            />
          </div>
        </div>

        <div
          onClick={() => navigate("/create-resume", { state: { template: "two" } })}
          className="border rounded-lg p-4 cursor-pointer hover:shadow-lg"
        >
          <div className="mb-3 text-sm font-medium">Template Two</div>
          <div className="bg-white p-4">
            <TemplateTwo
              data={{
                fullName: "Omar Patel",
                role: "Product Designer",
                email: "omar.patel@example.com",
                phone: "(415) 982-3344",
                address: "Palo Alto, CA",
                links: ["https://dribbble.com/omarpatel", "https://linkedin.com/in/omarpatel"],
                professionalSummary:
                  "Product designer focused on usable, delightful interfaces. 6+ years designing consumer and B2B products — from concept through launch.",
                skills: ["Figma", "UX Research", "Design Systems", "Prototyping", "HTML/CSS"],
                education: [
                  {
                    degree: "B.Des. Interaction Design",
                    institution: "School of Visual Arts",
                    year: "2016",
                    grade: "Distinction",
                  },
                ],
                experience: [
                  {
                    title: "Senior Product Designer",
                    company: "BrightApps",
                    startDate: "2020-03",
                    endDate: "Present",
                    description:
                      "Designed a cross-platform design system and led research that improved onboarding completion by 25%.",
                  },
                  {
                    title: "Product Designer",
                    company: "Pixelhouse",
                    startDate: "2017-07",
                    endDate: "2019-12",
                    description: "Collaborated with engineers to ship accessible, responsive UI components used by millions of users.",
                  },
                ],
                projects: [
                  {
                    name: "Onboardly",
                    description: "A micro-interaction library and onboarding toolkit for SaaS products.",
                    link: "https://github.com/omarpatel/onboardly",
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
