"use client";

import { CollectionAdmin } from "@/components/admin/CollectionAdmin";

export default function AdminExaltationPage() {
  return (
    <CollectionAdmin
      title="Exaltation words"
      collection="exaltationLines"
      fields={[
        { key: "text", label: "Line", type: "textarea" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      defaults={{ text: "", sortOrder: 0 }}
    />
  );
}
