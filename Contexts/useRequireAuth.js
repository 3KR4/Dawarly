"use client";

import { useAuth } from "@/Contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function useRequireAuth({ aggressive = false } = {}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) return { allowed: false };

  // المستخدم مش مسجل
  if (!isAuthenticated) {
    // منع اللوب: لو احنا بالفعل في صفحة تسجيل
    if (!pathname.startsWith("/register")) {
      // فقط لو aggressive mode أو مسار محمي
      if (aggressive || pathname.startsWith("/dashboard")) {
        router.push(`/register?redirect=${encodeURIComponent(pathname)}`);
      }
    }
    return { allowed: false };
  }

  return { allowed: true };
}
