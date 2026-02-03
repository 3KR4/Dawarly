import { useSearchParams, useRouter } from "next/navigation";

export default function useRedirectAfterLogin() {
  const params = useSearchParams();
  const router = useRouter();

  return () => {
    const redirect = params.get("redirect");
    router.replace(redirect || "/");
  };
}
