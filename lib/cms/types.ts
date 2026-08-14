/**
 * File-backed CMS types for The True Word self-hosted church CMS.
 * Staff manage content via /admin — no MDX or deploy required for content edits.
 */

export type CmsRole = "admin" | "editor";

export type CmsUser = {
  id: string;
  email: string;
  /** bcrypt hash */
  passwordHash: string;
  role: CmsRole;
  name?: string;
};

export type CmsMedia = {
  id: string;
  filename: string;
  url: string;
  alt: string;
  createdAt: string;
};

export type CmsArticle = {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  category: "TEACHING" | "FAITH";
  /** Public image path, e.g. /images/... or /uploads/... */
  coverImageUrl: string;
  /** HTML body */
  bodyHtml: string;
  featured: boolean;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

export type CmsTestimonial = {
  id: string;
  names: string;
  role: string;
  initials: string;
  quote: string;
  sortOrder: number;
};

export type CmsResource = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  sortOrder: number;
};

export type CmsDailyTruth = {
  id: string;
  text: string;
  reference: string;
  sortOrder: number;
};

export type CmsCoachingPackage = {
  id: string;
  slug: string;
  name: string;
  path: string;
  level: string;
  duration: string;
  purpose: string;
  outcome: string;
  featured: boolean;
  includes: string[];
  sortOrder: number;
};

export type CmsCourseTier = {
  id: string;
  slug: string;
  name: string;
  theme: string;
  level: string;
  focus: string[];
  practices: string[];
  outcome: string;
  sortOrder: number;
};

export type CmsSiteSettings = {
  name: string;
  tagline: string;
  email: string;
  website: string;
  instagram: string;
  instagramHandle: string;
  youtube: string;
  youtubeFeaturedVideoId: string;
  logo: string;
};

export type CmsFaq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export type CmsTextItem = {
  title: string;
  text: string;
};

export type CmsAbout = {
  introLead: string;
  introSub: string;
  story: string[];
  founderName: string;
  founderLead: string;
  founderBody: string;
  uniqueItems: CmsTextItem[];
  impactItems: CmsTextItem[];
  vision: string;
  missionLines: string[];
  joinTitle: string;
  joinBody: string;
};

export type CmsHomepagePillar = {
  name: string;
  line: string;
};

export type CmsHomepage = {
  heroHeadline: string;
  heroSub: string;
  aboutHeading: string;
  aboutParagraphs: string[];
  pillars: CmsHomepagePillar[];
  welcomeTitle: string;
  welcomeSubtitle: string;
};

export type CmsExaltationLine = {
  id: string;
  text: string;
  sortOrder: number;
};

export type CmsMessageType = "question" | "prayer" | "coaching" | "subscribe";

export type CmsMessage = {
  id: string;
  type: CmsMessageType;
  name: string;
  email: string;
  phone: string;
  body: string;
  package: string;
  topic?: string;
  isPrivate: boolean;
  read: boolean;
  createdAt: string;
};

export type CmsStore = {
  version: 1 | 2;
  users: CmsUser[];
  media: CmsMedia[];
  articles: CmsArticle[];
  testimonials: CmsTestimonial[];
  resources: CmsResource[];
  dailyTruths: CmsDailyTruth[];
  coachingPackages: CmsCoachingPackage[];
  courseTiers: CmsCourseTier[];
  settings: CmsSiteSettings;
  faqs: CmsFaq[];
  about: CmsAbout;
  homepage: CmsHomepage;
  exaltationLines: CmsExaltationLine[];
  creed: string;
  messages: CmsMessage[];
};
