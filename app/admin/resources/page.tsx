"use client";

import { CollectionAdmin } from "@/components/admin/CollectionAdmin";

export default function AdminResourcesPage() {
  return (
    <CollectionAdmin
      title="Resources"
      collection="resources"
      fields={[
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "image", label: "Image path" },
        { key: "link", label: "External link" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      defaults={{
        title: "",
        description: "",
        image: "/images/1.jpg",
        link: "https://",
        sortOrder: 0,
      }}
    />
  );
}
