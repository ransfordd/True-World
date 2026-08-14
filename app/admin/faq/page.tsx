"use client";

import { CollectionAdmin } from "@/components/admin/CollectionAdmin";

export default function AdminFaqPage() {
  return (
    <CollectionAdmin
      title="FAQ"
      collection="faqs"
      fields={[
        { key: "category", label: "Category" },
        { key: "question", label: "Question" },
        { key: "answer", label: "Answer", type: "textarea" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      defaults={{ category: "", question: "", answer: "", sortOrder: 0 }}
    />
  );
}
