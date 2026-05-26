"use client";

import { useRouter } from "next/navigation";

export default function useRedirectAfterLogin() {
  const router = useRouter();

  // الدالة دلوقتي تاخد target كـ parameter
  return (target) => {
    if (target) {
      router.replace(target);
      return;
    }

    const redirectFromUrl =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect")
        : null;
    if (redirectFromUrl) {
      router.replace(redirectFromUrl);
      return;
    }

    router.replace("/");
  };
}
