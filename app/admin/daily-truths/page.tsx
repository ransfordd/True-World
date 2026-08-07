"use client";

import { CollectionAdmin } from "@/components/admin/CollectionAdmin";

export default function AdminDailyTruthsPage() {
  return (
    <CollectionAdmin
      title="Daily Truths"
      collection="dailyTruths"
      fields={[
        { key: "text", label: "Quote text", type: "textarea" },
        { key: "reference", label: "Reference" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      defaults={{ text: "", reference: "", sortOrder: 0 }}
    />
  );
}
