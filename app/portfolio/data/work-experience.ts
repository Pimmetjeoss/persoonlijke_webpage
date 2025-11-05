export interface WorkExperience {
  id: string
  company: string
  role: string
  period: string
  description: string
  highlights: string[]
}

export const workExperiences: WorkExperience[] = [
  {
    id: "about-me",
    company: "ABOUT ME",
    role: "A. DESIGN DIRECTOR",
    period: "(2020-2021)",
    description:
      "Led design initiatives for Amazon's next-generation e-commerce platform, focusing on user experience optimization and brand consistency.",
    highlights: [
      "Directed a team of 15+ designers across multiple product lines",
      "Implemented design system that reduced development time by 40%",
      "Launched 3 major product redesigns with 25% increase in user engagement",
      "Collaborated with engineering teams to establish design-to-development workflow",
    ],
  },
  {
    id: "ai-agents",
    company: "AI & AGENTS",
    role: "SENIOR DESIGNER",
    period: "(2019-2020)",
    description:
      "Contributed to the design of innovative consumer products, ensuring seamless integration between hardware and software experiences.",
    highlights: [
      "Designed interface components for flagship iOS applications",
      "Worked on cross-functional teams to deliver pixel-perfect experiences",
      "Contributed to Apple's Human Interface Guidelines documentation",
      "Mentored junior designers on design principles and best practices",
    ],
  },
  {
    id: "mcp-server",
    company: "MCP-SERVER",
    role: "PRODUCT DESIGNER",
    period: "(2018-2019)",
    description:
      "Absolutely! We offer seamless integration with CRMs, ERPs, databases, APIs, and other third-party tools your business relies on.",
    highlights: [
      "Designed autonomous vehicle interface systems for safety and usability",
      "Conducted user research with test drivers and passengers",
      "Created visualization tools for sensor data and navigation systems",
      "Prototyped AR/VR experiences for vehicle development teams",
    ],
  },
  {
    id: "website",
    company: "WEBSITE",
    role: "DESIGN LEAD",
    period: "(2017-2018)",
    description:
      "Led design efforts for Uber's rider and driver applications, focusing on accessibility and global market expansion.",
    highlights: [
      "Redesigned core booking flow, increasing conversion by 18%",
      "Launched accessibility features for visually impaired users",
      "Expanded design language to support 15+ new international markets",
      "Established design quality metrics and review processes",
    ],
  },
  {
    id: "contact",
    company: "CONTACT",
    role: "UX DESIGNER",
    period: "(2016-2017)",
    description:
      "Designed cutting-edge user interfaces for Tesla's autopilot and infotainment systems, pushing the boundaries of automotive UX.",
    highlights: [
      "Created intuitive touchscreen interfaces for Model S and Model X",
      "Designed safety-critical UI elements for autopilot features",
      "Improved driver engagement metrics by 35% through UX optimization",
      "Collaborated with engineering teams on HMI design standards",
    ],
  },
  {
    id: "lyft",
    company: "LYFT",
    role: "ART DIRECTOR",
    period: "(2015-2017)",
    description:
      "Shaped Lyft's visual identity and brand experience across digital and physical touchpoints during rapid company growth.",
    highlights: [
      "Developed brand guidelines used across all marketing materials",
      "Art directed campaigns that increased brand recognition by 30%",
      "Designed in-app experiences that improved driver satisfaction scores",
      "Led creative direction for product launches and seasonal campaigns",
    ],
  },
]
