import { NextResponse, type NextRequest } from "next/server";
import { createReqResAuth } from "./lib/server-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  LOGIN_URL,
  authRoutes,
  publicRoutes,
} from "./routes";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const auth = createReqResAuth(request, response);

  const {
    data: { session },
  } = await auth.getSession();

  const isLoggedIn = !!session?.user;

  // protects the "/account" route and its sub-routes
  //   if (!user && request.nextUrl.pathname.startsWith("/account")) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
      );
    }
    return response;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN_URL, request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
