import { Application, ResumeVersion } from '@/types';

export const sampleApplications: Application[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineering Intern',
    location: 'Mountain View, CA',
    status: 'interview',
    appliedDate: '2024-01-15',
    deadline: '2024-01-10',
    notes: 'Technical phone screen scheduled for next week. Need to prep system design and behavioral questions. Recruiter: Sarah M.',
    resumeVersion: 'v2',
    salary: '$8,500/mo',
    source: 'Handshake',
    url: 'https://careers.google.com',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Program Manager Intern',
    location: 'Redmond, WA',
    status: 'applied',
    appliedDate: '2024-01-18',
    deadline: '2024-01-20',
    notes: 'Applied through referral from Sarah. Used PM-focused resume version.',
    resumeVersion: 'v3',
    salary: '$8,000/mo',
    source: 'LinkedIn',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
  {
    id: '3',
    company: 'Stripe',
    position: 'Backend Engineering Intern',
    location: 'San Francisco, CA',
    status: 'offer',
    appliedDate: '2024-01-05',
    deadline: '2024-01-01',
    notes: 'Received offer! $9k/mo + housing stipend. Decision deadline Feb 1. Need to negotiate.',
    resumeVersion: 'v2',
    salary: '$9,000/mo',
    source: 'Company Website',
    url: 'https://stripe.com/jobs',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-22',
  },
  {
    id: '4',
    company: 'Shopify',
    position: 'Full Stack Developer Intern',
    location: 'Remote',
    status: 'saved',
    appliedDate: null,
    deadline: '2024-02-01',
    notes: 'Need to tailor resume for e-commerce focus. Check if they sponsor international students.',
    resumeVersion: null,
    salary: '$7,500/mo',
    source: 'WaterlooWorks',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '5',
    company: 'Amazon',
    position: 'SDE Intern',
    location: 'Seattle, WA',
    status: 'rejected',
    appliedDate: '2024-01-08',
    deadline: '2024-01-05',
    notes: 'OA completed but no response after 3 weeks. Received rejection email.',
    resumeVersion: 'v1',
    salary: '$8,700/mo',
    source: 'Amazon Jobs',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-25',
  },
  {
    id: '6',
    company: 'Meta',
    position: 'Production Engineering Intern',
    location: 'Menlo Park, CA',
    status: 'applied',
    appliedDate: '2024-01-20',
    deadline: '2024-01-25',
    notes: 'Waiting for OA link. Should arrive within 1-2 weeks according to Blind.',
    resumeVersion: 'v3',
    salary: '$9,200/mo',
    source: 'Handshake',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '7',
    company: 'Notion',
    position: 'Software Engineer Intern',
    location: 'San Francisco, CA',
    status: 'interview',
    appliedDate: '2024-01-12',
    deadline: '2024-01-15',
    notes: 'Completed first round. Waiting for virtual onsite scheduling.',
    resumeVersion: 'v2',
    salary: '$8,800/mo',
    source: 'LinkedIn',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-23',
  },
  {
    id: '8',
    company: 'Figma',
    position: 'Product Design Intern',
    location: 'San Francisco, CA',
    status: 'saved',
    appliedDate: null,
    deadline: '2024-02-15',
    notes: 'Need to prepare portfolio. Check design requirements.',
    resumeVersion: null,
    salary: '$7,800/mo',
    source: 'Company Website',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
  },
];

export const sampleResumeVersions: ResumeVersion[] = [
  {
    id: 'v1',
    name: 'Base Resume',
    description: 'Original resume - general purpose for all applications',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    content: `# Alex Chen
alex.chen@university.edu | (555) 123-4567 | linkedin.com/in/alexchen | github.com/alexchen

## Education
**University of Waterloo** — Bachelor of Computer Science
Expected Graduation: April 2026 | GPA: 3.8/4.0
Relevant Coursework: Data Structures, Algorithms, Databases, Operating Systems

## Experience
**Software Developer Intern** — TechStartup Inc.
May 2023 - August 2023
- Developed REST APIs using Node.js and Express
- Implemented user authentication with JWT tokens
- Collaborated with frontend team on React components

**Teaching Assistant** — CS 136 (Elementary Algorithm Design)
September 2023 - December 2023
- Held weekly office hours for 200+ students
- Graded assignments and provided feedback

## Projects
**StudyBuddy** — React, Node.js, MongoDB
- Built a study group matching platform for university students
- Implemented real-time chat using WebSockets

## Skills
Languages: JavaScript, Python, Java, C++
Frameworks: React, Node.js, Express
Tools: Git, Docker, AWS`,
  },
  {
    id: 'v2',
    name: 'Tech-Focused',
    description: 'Emphasizes technical skills, system design, and quantified impact',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    content: `# Alex Chen
alex.chen@university.edu | (555) 123-4567 | linkedin.com/in/alexchen | github.com/alexchen

## Education
**University of Waterloo** — Bachelor of Computer Science (Co-op)
Expected Graduation: April 2026 | GPA: 3.8/4.0
Relevant Coursework: Data Structures, Algorithms, Databases, Operating Systems, Distributed Systems

## Technical Experience
**Software Developer Intern** — TechStartup Inc.
May 2023 - August 2023
- Architected and implemented RESTful API serving 10,000+ daily requests
- Reduced database query latency by 40% through query optimization and indexing
- Built CI/CD pipeline using GitHub Actions, reducing deployment time by 60%
- Implemented JWT-based authentication with refresh token rotation

**Teaching Assistant** — CS 136 (Elementary Algorithm Design)
September 2023 - December 2023
- Mentored 200+ students on algorithm design and complexity analysis
- Created automated testing suite for assignment grading

## Technical Projects
**Distributed Task Queue** — Go, Redis, PostgreSQL
- Built a distributed job processing system handling 1000+ jobs/minute
- Implemented retry logic with exponential backoff

**StudyBuddy** — React, Node.js, MongoDB, Socket.io
- Full-stack study group platform with real-time collaboration
- Deployed on AWS with auto-scaling configuration

## Technical Skills
Languages: JavaScript/TypeScript, Python, Go, Java, C++, SQL
Frameworks: React, Node.js, Express, FastAPI, Next.js
Infrastructure: Docker, Kubernetes, AWS (EC2, S3, Lambda), GitHub Actions
Databases: PostgreSQL, MongoDB, Redis`,
  },
  {
    id: 'v3',
    name: 'PM-Focused',
    description: 'Highlights leadership, product thinking, and cross-functional collaboration',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-18',
    content: `# Alex Chen
alex.chen@university.edu | (555) 123-4567 | linkedin.com/in/alexchen | github.com/alexchen

## Education
**University of Waterloo** — Bachelor of Computer Science (Co-op)
Expected Graduation: April 2026 | GPA: 3.8/4.0
Minor: Economics | Relevant Coursework: Product Management, UX Design, Business Strategy

## Leadership & Product Experience
**Software Developer Intern** — TechStartup Inc.
May 2023 - August 2023
- Led cross-functional team of 4 to ship new user onboarding flow, improving activation by 25%
- Conducted user interviews and synthesized feedback into actionable product requirements
- Presented weekly progress updates to stakeholders and executives
- Collaborated with design team to iterate on UI/UX based on user testing results

**Teaching Assistant** — CS 136 (Elementary Algorithm Design)
September 2023 - December 2023
- Managed and prioritized support requests from 200+ students
- Identified common pain points and created supplementary learning materials

**Product Lead** — UW Tech Club
September 2023 - Present
- Leading team of 8 to build campus event discovery app
- Defined product roadmap and prioritized features based on user research
- Coordinated with university administration on partnership opportunities

## Product Projects
**StudyBuddy** — User Research, Wireframing, Full-stack Development
- Identified unmet need through 30+ user interviews
- Created product spec and designed user flows in Figma
- Built MVP and iterated based on beta user feedback
- Achieved 500+ signups in first month of launch

## Skills
Product: User Research, Wireframing, A/B Testing, Roadmap Planning, Agile/Scrum
Technical: React, Node.js, SQL, Python
Tools: Figma, Jira, Notion, Amplitude`,
  },
];
