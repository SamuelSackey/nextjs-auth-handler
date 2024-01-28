import type { NextRequest, NextResponse } from "next/server";
import AuthHandler from "./auth-handler";
import { cookies } from "next/headers";

export function createServerAuth() {
  return AuthHandler.create({ cookieOptions: { cookies } });
}

export function createServerComponentAuth() {
  return AuthHandler.create({
    cookieOptions: { cookies, serverComponent: true },
  });
}

export function createReqResAuth(req: NextRequest, res: NextResponse) {
  return AuthHandler.create({ cookieOptions: { req, res } });
}
