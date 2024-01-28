"use client";

import { createClientAuth } from "@/lib/client-auth";
import useSession from "@/lib/use-session";
import { useRouter } from "next/navigation";

export default function UserDetails() {
  const auth = createClientAuth();

  const router = useRouter();

  const { session, error } = useSession();
  const user = session?.user;

  return (
    <>
      {error ? (
        <p>{error}</p>
      ) : user ? (
        <>
          <p>{`username: ${user.username}`}</p>
          <p>{`email: ${user?.email}`}</p>
        </>
      ) : (
        <p>Loading ...</p>
      )}

      <br />

      <button onClick={() => router.back()}>Go Back</button>

      <div className="h-3" />

      <button onClick={() => auth.signOut()}>Logout</button>
    </>
  );
}
