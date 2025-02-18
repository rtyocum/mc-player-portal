import { SessionData } from "@/lib/auth";
import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const session = (await response.json()) as SessionData;
          setSession(session);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);
  return { session, loading };
}
