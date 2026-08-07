"use client";

import { CollectionAdmin } from "@/components/admin/CollectionAdmin";

export default function AdminTestimonialsPage() {
  return (
    <CollectionAdmin
      title="Testimonials"
      collection="testimonials"
      fields={[
        { key: "names", label: "Names" },
        { key: "role", label: "Role" },
        { key: "initials", label: "Initials" },
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      defaults={{
        names: "",
        role: "",
        initials: "",
        quote: "",
        sortOrder: 0,
      }}
    />
  );
}
