"use client";

import { createClientAuth } from "@/lib/client-auth";
import { FormEvent, useState } from "react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const auth = createClientAuth();

    e.preventDefault();

    // setError(`Invalid Credentials for ${email} | ${password}`);

    const { error } = await auth.signUp(name, email, password);

    if (error) {
      setError(error);
    } else {
      setError("");
    }
  };

  return (
    <div>
      <h1 className="text-lg">Sign Up</h1>

      <form onSubmit={onSubmit}>
        <input
          type="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="h-4" />

        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="h-4" />

        <input
          type="password"
          name="password"
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
