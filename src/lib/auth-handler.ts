import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { jwtExpiryDate } from "./jwt";
import type { NextRequest, NextResponse } from "next/server";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export type TUser = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  verified: boolean;
};

export type Session = {
  user: TUser;
  token: string;
};

type TSessionResponse = {
  data: {
    session: Session | null;
  };
  error: string | null;
};

type CookieOptions = {
  cookies?: () => ReadonlyRequestCookies;
  req?: NextRequest;
  res?: NextResponse;
  serverComponent?: boolean;
};

type AuthHandlerOptions = {
  isSingleton?: boolean;
  cookieOptions?: CookieOptions;
};

export default class AuthHandler {
  private static instance: AuthHandler | null = null;
  private cookieOptions: CookieOptions = {};

  private constructor(options?: AuthHandlerOptions) {
    if (options && options.cookieOptions) {
      this.cookieOptions = options.cookieOptions;
    }
  }

  public static create(options?: AuthHandlerOptions): AuthHandler {
    if (options && options.isSingleton === true) {
      if (AuthHandler.instance instanceof AuthHandler) {
        return AuthHandler.instance;
      }

      AuthHandler.instance = new AuthHandler(options);

      return AuthHandler.instance;
    }

    return new AuthHandler(options);
  }

  async signUp({
    first_name,
    last_name,
    email,
    password,
    role = "HR_MANAGER",
  }: {
    first_name: string;
    last_name: string;

    email: string;
    password: string;
    role?: string;
  }): Promise<{ error: string | null }> {
    // Convert credentials to json
    const body = JSON.stringify({
      first_name,
      last_name,
      role,
      email,
      password,
    });

    try {
      const res = await fetch(`${backendUrl}/api/v1/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (res.ok) return { error: null };

      const error = await res.json();

      throw new Error(error.detail);
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ error: string | null }> {
    // Convert credentials to url encoded string
    const data = new URLSearchParams();
    data.append("username", email);
    data.append("password", password);
    const body = data.toString();

    try {
      const res = await fetch(`${backendUrl}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      if (res.ok) {
        const { access_token }: { access_token: string } = await res.json();

        const isVerified = (await this.getSession(access_token))?.data?.session
          ?.user?.verified;

        if (isVerified) {
          const expiryDate = () => {
            const date = jwtExpiryDate(access_token);
            date.setMinutes(date.getMinutes() - 15);
            return date;
          };

          if (this.cookieOptions.serverComponent !== true) {
            setCookie("auth-token", access_token, {
              expires: expiryDate(),
              secure: true,
              req: this.cookieOptions.req,
              res: this.cookieOptions.res,
              cookies: this.cookieOptions.cookies,
            });
          }

          return { error: null };
        } else throw new Error("Account is not verified");
      }

      const error = await res.json();

      throw new Error(error.detail);
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      if (this.cookieOptions.serverComponent !== true) {
        deleteCookie("auth-token", {
          req: this.cookieOptions.req,
          res: this.cookieOptions.res,
          cookies: this.cookieOptions.cookies,
        });
      }
      return { error: null };
    } catch (error) {
      return { error: `Error logging out: ${(error as Error).message}` };
    }
  }

  async getSession(tokenString?: string): Promise<TSessionResponse> {
    const token =
      tokenString ||
      getCookie("auth-token", {
        req: this.cookieOptions.req,
        res: this.cookieOptions.res,
        cookies: this.cookieOptions.cookies,
      });

    if (token) {
      const isValid = jwtExpiryDate(token) > new Date();

      if (isValid) {
        try {
          const res = await fetch(`${backendUrl}/api/v1/users/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const user = await res.json();

            return {
              data: { session: { user, token } },
              error: null,
            };
          }

          const error = await res.json();

          throw new Error(error.detail);
        } catch (error) {
          // user response error
          return { data: { session: null }, error: (error as Error).message };
        }
      }

      // token expired
      this.signOut();
      return { data: { session: null }, error: "token expired" };
    }

    // not logged in
    return { data: { session: null }, error: "user not logged in" };
  }

  async verify(verification_token: string): Promise<{ error: string | null }> {
    try {
      const res = await fetch(`${backendUrl}/api/v1/register/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verification_token }),
      });

      if (res.ok) return { error: null };

      const error = await res.json();

      throw new Error(error.detail);
    } catch (error) {
      // user response error
      return { error: (error as Error).message };
    }
  }

  async resendVerification(email: string): Promise<{ error: string | null }> {
    try {
      const res = await fetch(`${backendUrl}/api/v1/register/verify/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) return { error: null };

      const error = await res.json();

      throw new Error(error.detail);
    } catch (error) {
      // user response error
      return { error: (error as Error).message };
    }
  }
}
