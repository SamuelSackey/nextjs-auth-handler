"use client";

import AuthClientHandler from "./auth-client-handler";

export function createClientAuth() {
  return AuthClientHandler.create();
}
