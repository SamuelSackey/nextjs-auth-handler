"use client";

import AuthHandler from "./auth-handler";

export function createClientAuth() {
  return new AuthHandler({ isSingleton: true });
}
