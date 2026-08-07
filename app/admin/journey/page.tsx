"use client";

import { CollectionAdmin } from "@/components/admin/CollectionAdmin";

export default function AdminJourneyPage() {
  return (
    <CollectionAdmin
      title="Journey tiers"
      collection="courseTiers"
      fields={[
        { key: "slug", label: "Slug / id" },
        { key: "name", label: "Name" },
        { key: "theme", label: "Theme" },
        { key: "level", label: "Level" },
        { key: "focus", label: "Focus points (one per line)", type: "list" },
        {
          key: "practices",
          label: "Practices (one per line)",
          type: "list",
        },
        { key: "outcome", label: "Outcome", type: "textarea" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      defaults={{
        slug: "",
        name: "",
        theme: "",
        level: "",
        focus: "",
        practices: "",
        outcome: "",
        sortOrder: 0,
      }}
    />
  );
}
