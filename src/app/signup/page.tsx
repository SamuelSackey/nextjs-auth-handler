"use client";

import { createClientAuth } from "@/lib/client-auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const auth = createClientAuth();

    e.preventDefault();

    // setError(`Invalid Credentials for ${email} | ${password}`);

    const { error } = await auth.signUp({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });

    if (error) {
      setError(error);
    } else {
      setError("");
      router.refresh();
    }
  };

  return (
    <div>
      <h1 className="text-lg">Sign Up</h1>

      <form onSubmit={onSubmit}>
        <input
          type="first_name"
          placeholder="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <div className="h-4" />

        <input
          type="last_name"
          placeholder="last_name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <div className="h-4" />

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="h-4" />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="h-6" />

        <button className="border border-white">Sign Up</button>
      </form>
      <div className="h-10" />
      <h1 className="text-xl">{error}</h1>
    </div>
  );
}
