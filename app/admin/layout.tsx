import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { CmsAuthProvider } from "@/components/admin/CmsAuthProvider";
import "./admin.css";

export const metadata: Metadata = {
  title: "CMS Admin | THE TRUE WORD",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cms-admin">
      <CmsAuthProvider>
        <AdminShell>{children}</AdminShell>
      </CmsAuthProvider>
    </div>
  );
}
