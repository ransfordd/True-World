import { FAQ_ITEMS } from "@/lib/site-data";
import type {
  CmsAbout,
  CmsExaltationLine,
  CmsFaq,
  CmsHomepage,
} from "./types";

function nid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export const DEFAULT_CREED = `We are two, yet we are one.
Joined not by chance, but by divine design.
Our love is not fragile—
It is fire refined by truth,
It is water that heals,
It is a seed that grows into legacy.
We choose faith when fear whispers.
We choose truth when silence tempts.
We choose love when storms rise.
Our words will build, not break.
Our hands will heal, not wound.
Our hearts will forgive, not forsake.
Today, we vow not only to endure—
But to exalt our marriage
As a living testimony of God's purpose.
Together, we are strength.
Together, we are sanctuary.
Together, we are eternal.`;

export const DEFAULT_EXALTATION = [
  "Awakened Love, Eternal Union.",
  "From Wounds to Wonders.",
  "Two Hearts, One Divine Purpose.",
  "When Truth Heals, Love Reigns.",
  "Marriage is the altar where love becomes legacy.",
  "Faith builds, Truth heals, Love endures.",
  "Your union is sacred, your love is eternal, your purpose is divine.",
  "Every struggle can be transformed into strength.",
  "A healed marriage is a healed generation.",
  "Love renewed, hope restored, destiny awakened.",
  "In truth we unite, in love we endure.",
  "Marriage is not survival—it is sacred exaltation.",
];

export function defaultFaqs(): CmsFaq[] {
  return FAQ_ITEMS.map((f, i) => ({
    id: nid("faq"),
    category: f.category,
    question: f.question,
    answer: f.answer,
    sortOrder: i,
  }));
}

export function defaultExaltationLines(): CmsExaltationLine[] {
  return DEFAULT_EXALTATION.map((text, i) => ({
    id: nid("exa"),
    text,
    sortOrder: i,
  }));
}

export function defaultAbout(): CmsAbout {
  return {
    introLead:
      "A global movement awakening souls to their divine truth and purpose",
    introSub:
      "Discover our story, our founder, and what makes The True Word unique in restoring the original truth.",
    story: [
      "The True Word was birthed from a divine calling—a vision to restore the original truth that has been obscured by centuries of religious tradition and human interpretation.",
      "Founded by Eric Paddy Boso, this movement emerged not as another institution, but as a living testament to the unfiltered Word of God.",
      "We are not an organization—we are a movement united to remember and embody the True Word that Yahushua lived and taught.",
    ],
    founderName: "Eric Paddy Boso",
    founderLead:
      "A prophetic voice committed to unveiling divine truth and empowering believers to walk in their full identity and purpose.",
    founderBody:
      "Through faithful study, prayer, and revelation, Eric restores the original teachings of Yahushua—beyond dogma to spiritual awakening and transformation.",
    uniqueItems: [
      {
        title: "Truth Above Tradition",
        text: "We honor the uncompromised Word of God over religious traditions that have obscured divine truth.",
      },
      {
        title: "Global Community",
        text: "We bring together believers from all backgrounds, cultures, and nations in unity and purpose.",
      },
      {
        title: "Practical Transformation",
        text: "We provide real tools, coaching, and resources that empower lasting change.",
      },
    ],
    impactItems: [
      { title: "Global", text: "Reaching souls worldwide through digital platforms" },
      { title: "Transformed", text: "Lives awakened to true identity and purpose" },
      {
        title: "Unified",
        text: "Community beyond cultural and denominational barriers",
      },
      { title: "Empowered", text: "Believers equipped for lasting transformation" },
    ],
    vision:
      "Ignite a global awakening where humanity rediscovers direct connection to the Divine Source—beyond religion, division, and fear—ushering in truth, freedom, and unity.",
    missionLines: [
      "Break illusions separating people from true divine nature",
      "Awaken individuals to live by the True Word within",
      "Empower seekers with knowledge, practices, and community",
      "Build a global movement of awakened souls",
    ],
    joinTitle: "Join the Movement",
    joinBody:
      "Step into the path of awakening—whether through the Journey, coaching, or the wider community. Your identity and destiny are waiting.",
  };
}

export function defaultHomepage(): CmsHomepage {
  return {
    heroHeadline: "Spreading Light. Speaking Truth.",
    heroSub: "Awakening the Divine Within Humanity.",
    aboutHeading: "About Us",
    aboutParagraphs: [
      "A global faith-based movement unveiling divine truth, igniting purpose, and empowering lives through prophetic insight and spiritual teaching.",
      "Founded by Eric Paddy Boso, we restore the unfiltered Word of God beyond religious tradition—so believers walk in full identity and destiny.",
      "Not an institution: a living community united to remember and embody the True Word Yahushua lived and taught.",
    ],
    pillars: [
      { name: "Faith", line: "Trust rooted in the living Word" },
      { name: "Truth", line: "Revelation beyond tradition" },
      { name: "Transformation", line: "Renewed mind, renewed life" },
      { name: "Impact", line: "Awakening that multiplies" },
    ],
    welcomeTitle: "Welcome TO",
    welcomeSubtitle: "THE TRUE WORD",
  };
}
