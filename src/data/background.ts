/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  period: string;
  ongoing: boolean;
  highlights: string[];
}

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
}

/**
 * Client testimonial shown at the top of Section 05.
 * Keep this null until the client has approved the exact wording and credit line
 * (see TESTIMONIAL_DRAFT.md at the project root).
 */
export const TESTIMONIAL: Testimonial | null = null;

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'exp-va',
    role: 'Remote Executive & Media Assistant',
    organization: 'Private Client',
    period: '2021 – Present',
    ongoing: true,
    highlights: [
      'Diary and inbox management across GMT/BST, US Eastern and WAT.',
      'Travel planning, event logistics and speaker run-of-shows.',
      'YouTube channel management: 24+ videos edited, captioned and published.',
    ],
  },
  {
    id: 'exp-freelance',
    role: 'Freelance Full-Stack Developer & UI/UX Designer',
    organization: 'Self-Employed · Remote',
    period: '2023 – Present',
    ongoing: true,
    highlights: [
      'Client portals, intake forms and booking flows built with React, Node.js and PostgreSQL.',
      'Figma wireframes and design systems for real estate, aviation and e-commerce clients.',
    ],
  },
  {
    id: 'exp-cdp',
    role: 'Quantity Surveyor',
    organization: 'Apex Operations Group · Global Remote',
    period: 'Nov 2022 – Aug 2025',
    ongoing: false,
    highlights: [
      'Bills of quantities, cost reports and budget tracking for $1M+ capital projects.',
      'Operations & Commercial Project Coordinator: budget tracking, workflow optimization and reporting.',
    ],
  },
  {
    id: 'exp-orritech',
    role: 'MEP Estimator & Quantity Surveyor',
    organization: 'Vanguard Engineering & Project Services',
    period: 'Dec 2018 – Dec 2019',
    ongoing: false,
    highlights: [
      'Tender documentation for mechanical, electrical and plumbing projects, with a 65% bid success rate.',
      'Operation and maintenance manuals prepared with the engineering team.',
    ],
  },
];

export const CREDENTIALS: Credential[] = [
  {
    id: 'cred-google-pm',
    title: 'Google Project Management Professional Certificate',
    issuer: 'Google · Coursera',
    date: 'Mar 2025',
  },
  {
    id: 'cred-google-ux',
    title: 'Google UX Design Professional Certificate',
    issuer: 'Google · Coursera',
    date: 'Sep 2024',
  },
  {
    id: 'cred-hubspot-crm',
    title: 'Building Your Business With HubSpot Smart CRM',
    issuer: 'HubSpot Academy · Course',
    date: 'Oct 2026',
  },
  {
    id: 'cred-crm',
    title: 'Customer Service Relationship Management (CRM)',
    issuer: 'Fivek Academy',
    date: 'May 2023',
  },
  {
    id: 'cred-fullstack',
    title: 'Full-Stack Web Development',
    issuer: 'App Brewery · Udemy',
    date: 'Aug 2026',
  },
  {
    id: 'cred-pgd',
    title: 'Postgraduate Diploma, Construction Management',
    issuer: 'International Management Institute',
    date: 'In Progress',
  },
  {
    id: 'cred-hnd',
    title: 'Higher National Diploma, Quantity Surveying',
    issuer: 'Accredited Polytechnic Institute',
    date: '2022',
  },
  {
    id: 'cred-pniqs',
    title: 'Probationer Member (PNIQS)',
    issuer: 'Operations & Project Management Association',
    date: '2023',
  },
];
