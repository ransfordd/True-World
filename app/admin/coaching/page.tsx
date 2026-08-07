"use client";

import { CollectionAdmin } from "@/components/admin/CollectionAdmin";

export default function AdminCoachingPage() {
  return (
    <CollectionAdmin
      title="Coaching packages"
      collection="coachingPackages"
      fields={[
        { key: "slug", label: "Slug / id" },
        { key: "name", label: "Name" },
        { key: "path", label: "Path label" },
        { key: "level", label: "Level" },
        { key: "duration", label: "Duration" },
        { key: "purpose", label: "Purpose", type: "textarea" },
        { key: "outcome", label: "Outcome", type: "textarea" },
        { key: "includes", label: "Includes (one per line)", type: "list" },
        { key: "featured", label: "Featured package", type: "checkbox" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      defaults={{
        slug: "",
        name: "",
        path: "",
        level: "",
        duration: "",
        purpose: "",
        outcome: "",
        includes: "",
        featured: false,
        sortOrder: 0,
      }}
    />
  );
}
