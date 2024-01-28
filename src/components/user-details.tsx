"use client";

import { createClientAuth } from "@/lib/client-auth";
import useSession from "@/lib/use-session";
import { useRouter } from "next/navigation";

export default function UserDetails() {
  const auth = createClientAuth();

  const router = useRouter();

  const { session, error } = useSession();
  const user = session?.user;

  //   const user: TUser = {
  //     _id: "65b6214f1ef58a048010af10",
  //     username: "Leonard",
  //     email: "leo@gmail.com",
  //     role: "user",
  //     created_at: "2024-01-28 09:29:43",
  //     projects: [],
  //   };

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
      <div className="h-6 inline" />
      <button onClick={() => auth.signOut()}>Logout</button>
    </>
  );
}
