"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function useRedirectAfterLogin() {
  const router = useRouter();
  const params = useSearchParams();

  // الدالة دلوقتي تاخد target كـ parameter
  return (target) => {
    if (target) {
      router.replace(target);
      return;
    }

    const redirectFromUrl = params.get("redirect");
    if (redirectFromUrl) {
      router.replace(redirectFromUrl);
      return;
    }

    router.replace("/");
  };
}
