"use client";

import { useEffect, useState } from "react";
import { Session } from "./auth-handler";
import { createClientAuth } from "./client-auth";

export default function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = createClientAuth();

    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await auth.getSession();

      if (session) setSession(session);

      setError(error);
    };

    getSession();
  }, []);

  return { session, error };
}
