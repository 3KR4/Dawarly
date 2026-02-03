import { useAuth } from "@/Contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // 👈 الباث الحالي

  if (loading) return { allowed: false };

  if (!isAuthenticated) {
    router.push(`/register?redirect=${encodeURIComponent(pathname)}`);
    return { allowed: false };
  }

  return { allowed: true };
}
