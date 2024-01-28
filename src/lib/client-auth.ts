"use client";

import AuthHandler from "./auth-handler";

export function createClientAuth() {
  return AuthHandler.create({ isSingleton: true });
}
