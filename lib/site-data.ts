export const SITE = {
  name: "THE TRUE WORD",
  tagline: "Spreading Light. Speaking Truth.",
  email: "info@thetrueword.com",
  website: "https://www.thetrueword-gh.com",
  instagram: "https://www.instagram.com/thetrueword2025",
  instagramHandle: "@thetrueword2025",
  youtube: "https://www.youtube.com/@THETRUEWORDBYERICPADDYBOSO",
  /** Optional watch?v= ID — homepage “Latest Message” uses HQ thumb + watch link when set */
  youtubeFeaturedVideoId: "",
  logo: "/images/logo.png.png",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/journey", label: "Journey" },
  { href: "/coaching", label: "Coaching" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/articles", label: "Articles" },
  { href: "/resources", label: "Resources" },
  { href: "/prayer-requests", label: "Prayer" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
] as const;

export const COACHING_PACKAGES = [
  {
    id: "awakening",
    name: "Awakening Coaching",
    path: "Seeker's Path",
    level: "Beginner",
    duration: "4 Weeks",
    purpose:
      "Remember your true identity and begin living with spiritual awareness.",
    outcome: "Clarity and the beginning of higher awareness.",
    featured: false,
    includes: [
      "4× weekly 60-min 1:1 sessions",
      "Daily mindfulness practices (5–10 min)",
      "Guided journaling prompts",
      "Private support group access",
      "Personalized faith & awakening plan",
    ],
  },
  {
    id: "transformation",
    name: "Transformation Coaching",
    path: "Disciple's Path",
    level: "Intermediate",
    duration: "8 Weeks",
    purpose: "Heal wounds, break patterns, and embody truth.",
    outcome: "Inner transformation with freedom, peace, and alignment.",
    featured: true,
    includes: [
      "8× weekly 60–90 min 1:1 sessions",
      "Emotional healing practices",
      "Conscious living challenges & meditations",
      "Group circle + coach check-ins",
      "Advanced resources",
    ],
  },
  {
    id: "impact",
    name: "Impact Mentorship",
    path: "Master's Path",
    level: "Advanced",
    duration: "12 Weeks",
    purpose: "Create real-world impact and lasting transformation.",
    outcome: "Embody awakening and lead others.",
    featured: false,
    includes: [
      "12× weekly 90-min 1:1 sessions",
      "Leadership and legacy training",
      "Mentorship on spiritual/social projects",
      "Personal Impact Plan",
      "Advanced meditations & master resources",
    ],
  },
] as const;

export const COURSE_TIERS = [
  {
    id: "seeker",
    name: "The Seeker's Path",
    theme: "Curiosity → Awareness",
    level: "Beginner",
    focus: [
      "Introduction to awakening",
      "Inner divinity",
      "Basic mindfulness",
      "Recognizing illusions",
    ],
    practices: [
      "5-min stillness meditation",
      'Journaling “Who am I beneath my name and story?”',
      "Faith and synchronicity reflection",
      "Short universal-truth readings",
    ],
    outcome: "Courage to look within; foundation for deeper exploration.",
  },
  {
    id: "disciple",
    name: "The Disciple's Path",
    theme: "Awareness → Transformation",
    level: "Intermediate",
    focus: [
      "Limiting beliefs",
      "Emotional and generational wounds",
      "Conscious choices",
      "Embodying love and truth",
    ],
    practices: [
      "Healing meditations",
      "Forgiveness and gratitude rituals",
      'Journaling “What patterns must I release…”',
      "Weekly conscious habit challenge",
    ],
    outcome: "Freedom, peace, and alignment; awareness becomes tangible change.",
  },
  {
    id: "master",
    name: "The Master's Path",
    theme: "Transformation → Impact",
    level: "Advanced",
    focus: [
      "Leadership through consciousness",
      "Service and legacy",
      "Building communities",
      "Impact as extension of awakening",
    ],
    practices: [
      "Personal Impact Plan",
      "Community service or mentoring",
      'Journaling “How can my life become a message…”',
      "Advanced oneness meditations",
    ],
    outcome: "Embody awakening; become a vessel of truth who leads others.",
  },
] as const;

export const DAILY_TRUTHS = [
  {
    text: "Your identity is not found in what you do, but in who you are in the Spirit.",
    ref: "Identity Truth",
  },
  {
    text: "True awakening begins when you see beyond the veil of religious tradition.",
    ref: "Spiritual Insight",
  },
  {
    text: "The Kingdom operates in power, not just in words.",
    ref: "Kingdom Principle",
  },
  {
    text: "Your spiritual DNA carries the seeds of divine purpose.",
    ref: "Purpose Reality",
  },
  {
    text: "Walking in truth requires both revelation and application.",
    ref: "Walking in Truth",
  },
  {
    text: "The prophetic opens doors that religion has sealed shut.",
    ref: "Prophetic Truth",
  },
  {
    text: "Your breakthrough is tied to your level of spiritual perception.",
    ref: "Breakthrough Key",
  },
] as const;

export const FAQ_ITEMS = [
  {
    category: "Awakening",
    question: "What is Awakening?",
    answer:
      "Awakening is remembering who you truly are beyond conditioning, fear, and illusion. It is not becoming something new, but uncovering your original essence connected to Source. It is a journey, not a destination—a soul remembering its light. It does not create superiority; it humbles you into love, truth, and oneness.",
  },
  {
    category: "About",
    question: "What is The True Word?",
    answer:
      "The True Word is a spiritual awakening movement reconnecting humanity to Source—restoring direct connection with the Most High through Yahushua (Jesus). Unlike religion’s traditions and doctrines, it focuses on awakening the divine truth already within you.",
  },
  {
    category: "About",
    question: "Is The True Word a religion or church?",
    answer:
      "No. It is not a religion, denomination, or church. It is a return to the oldest truth—the living Word Yahushua revealed before institutions reshaped it.",
  },
  {
    category: "Faith",
    question: "Why Yahushua instead of Jesus?",
    answer:
      "Yahushua is the Hebrew name meaning “Yah saves.” It carries the depth of His divine mission. He came not to build religion but to reveal the eternal path of freedom.",
  },
  {
    category: "Faith",
    question: "Is this message against churches or faith traditions?",
    answer:
      "No. We do not condemn churches. We invite seekers beyond walls, rituals, and fear-based traditions to rediscover the fullness of Yahushua’s truth.",
  },
  {
    category: "Awakening",
    question: 'What does it mean to "awaken the divine within"?',
    answer:
      "It means remembering who you are and why you’re here: a child of the Most High with divine light, purpose, and identity—living from this truth instead of fear, guilt, or external control.",
  },
  {
    category: "Faith",
    question: "How is this different from traditional Christianity?",
    answer:
      "Traditional Christianity often emphasizes doctrines, guilt, and rituals. The True Word emphasizes direct connection with the Most High, freedom from man-made control, rediscovery of divine nature, and living the divine blueprint Yahushua revealed.",
  },
  {
    category: "Faith",
    question: 'Why "Religion binds but Truth liberates"?',
    answer:
      "Religion can use fear and rules to keep people dependent on institutions. Truth liberates by revealing that divine connection was always within and cannot be taken away.",
  },
  {
    category: "About",
    question: 'What do you mean by "Truth Above Tradition"?',
    answer:
      "Choosing the unfiltered Word of the Most High over doctrines and distortions. We honor what Yahushua lived and taught, not what was reshaped for power, control, or division.",
  },
  {
    category: "Faith",
    question: "What role does scripture play?",
    answer:
      "We honor scripture as a sacred witness, read through the Spirit. The written Word points to the Living Word—Yahushua Himself.",
  },
  {
    category: "Community",
    question: "Who is The True Word for?",
    answer:
      "Seekers, the spiritually restless, and the chosen remnant who feel there is more than religion has shown. If these words stir you, you are already awakening.",
  },
  {
    category: "Faith",
    question: "Do I have to leave my faith to follow this path?",
    answer:
      "No. This is not abandoning faith—it is deepening it. Honor traditions while awakening to the original truth Yahushua lived.",
  },
  {
    category: "Awakening",
    question: 'How do I know if I am "chosen"?',
    answer:
      "If the message resonates—if you feel called, stirred, and hungry for truth—the Spirit is confirming. Signs include deep inner restlessness, sensitivity, hunger for truth, feeling different or misunderstood, strong intuition, unshakable calling, tests and trials, and a magnetic pull toward the Divine.",
  },
  {
    category: "Journey",
    question: "How do I begin my journey with The True Word?",
    answer:
      "Open your heart. Read the teachings, meditate on scripture with fresh eyes, and invite the Spirit. Contact us for more direction as you return step by step to your true self.",
  },
  {
    category: "Awakening",
    question: "Do you believe everyone will awaken?",
    answer:
      "Not everyone will choose to. This message is especially for those ready to listen, question, and walk in freedom—the remnant called out of conformity.",
  },
  {
    category: "Community",
    question: "How can I connect with the community?",
    answer:
      "Website www.thetrueword-gh.com · Instagram @thetrueword2025 · Email info@thetrueword.com",
  },
] as const;

export const TESTIMONIALS = [
  {
    names: "Daniel & Abena",
    role: "Engaged Couple",
    initials: "D&A",
    quote:
      "Before joining True Word's pre-marital sessions, we thought love was enough. But these consultations opened our eyes to the deeper meaning of marriage. We discovered patterns that could have caused future pain and learned how to build our union on faith, truth, and purpose. Today, we feel more prepared, aligned, and excited to walk into marriage with confidence.",
  },
  {
    names: "Kwame & Akosua",
    role: "Married Couple",
    initials: "K&A",
    quote:
      "After 8 years of marriage, we were drifting apart. Communication had broken down, and we felt more like roommates than partners. The True Word Marriage Renewal sessions gave us tools to listen to each other again, heal old wounds, and reconnect spiritually. Our home now feels alive with love and laughter once more.",
  },
] as const;

export const RESOURCES = [
  {
    title: "Spiritual Evolution",
    image: "/images/1.jpg",
    description: "Begin spiritual transformation; awaken divine consciousness.",
    link: "http://books2read.com/u/m25v91",
  },
  {
    title: "Divine Revelations",
    image: "/images/2.jpg",
    description: "Profound spiritual truths; deepen divine connection.",
    link: "http://books2read.com/u/47ppzE",
  },
  {
    title: "Sacred Wisdom",
    image: "/images/3.jpg",
    description: "Ancient wisdom and timeless truths for modern seekers.",
    link: "https://books2read.com/u/4jjNrZ",
  },
  {
    title: "Path to Enlightenment",
    image: "/images/4.jpg",
    description: "Guide to awakening and divine purpose.",
    link: "https://books2read.com/u/3GZ27K",
  },
  {
    title: "Awakening Practices",
    image: "/images/5.jpg",
    description: "Practical exercises and reflections for daily awakening.",
    link: "https://www.books2read.com/u/3nLMJP",
  },
  {
    title: "Inner Light",
    image: "/images/6.jpg",
    description: "Short reflections and meditations for inner light.",
    link: "https://www.books2read.com/u/baMe2Q",
  },
  {
    title: "Becoming Whole",
    image: "/images/7.jpg",
    description: "Guide toward integration and wholeness.",
    link: "https://www.books2read.com/u/boAWN1",
  },
] as const;
